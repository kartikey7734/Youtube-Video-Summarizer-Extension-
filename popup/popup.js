document.addEventListener('DOMContentLoaded', () => {
    // Views and containers
    const notesView = document.getElementById('notes-view');
    const settingsView = document.getElementById('settings-view');
    const manualSummaryView = document.getElementById('manual-summary-view');
    const notesContainer = document.getElementById('notes-container');
    const emptyMessage = document.getElementById('empty-message');

    // Buttons
    const settingsBtn = document.getElementById('settings-btn');
    const manualEntryBtn = document.getElementById('manual-entry-btn');
    const settingsBackBtn = document.getElementById('settings-back-btn');
    const manualBackBtn = document.getElementById('manual-back-btn');
    const saveButton = document.getElementById('saveButton');
    const generateManualSummaryBtn = document.getElementById('generateManualSummaryBtn');
    const fetchTranscriptBtn = document.getElementById('fetchTranscriptBtn');


    // Settings elements
    const apiKeyInput = document.getElementById('apiKeyInput');
    const statusMessage = document.getElementById('statusMessage');

    // Manual summary elements
    const manualTitleInput = document.getElementById('manualTitleInput');
    const manualUrlInput = document.getElementById('manualUrlInput');
    const manualTranscriptInput = document.getElementById('manualTranscriptInput');
    const manualStatusMessage = document.getElementById('manualStatusMessage');

    // --- View Switching ---
    const showView = (viewToShow) => {
        [notesView, settingsView, manualSummaryView].forEach(view => {
            if (view === viewToShow) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        });
    };

    settingsBtn.addEventListener('click', () => showView(settingsView));
    manualEntryBtn.addEventListener('click', () => showView(manualSummaryView));
    settingsBackBtn.addEventListener('click', () => showView(notesView));
    manualBackBtn.addEventListener('click', () => showView(notesView));

    // --- Notes Management ---

    const renderNotes = (summaries) => {
        notesContainer.innerHTML = '';
        const videoIds = Object.keys(summaries).sort().reverse(); // Show newest first

        if (videoIds.length === 0) {
            emptyMessage.classList.remove('hidden');
        } else {
            emptyMessage.classList.add('hidden');
            videoIds.forEach(videoId => {
                const note = summaries[videoId];

                const noteItem = document.createElement('div');
                noteItem.className = 'note-item';
                noteItem.innerHTML = `
                    <div class="note-header">
                        <span class="note-title">${note.title}</span>
                        <button class="delete-btn" title="Delete Note">&times;</button>
                    </div>
                    <div class="note-content">
                        <h3>Summary</h3>
                        <p>${note.summary}</p>
                        ${note.takeaways && note.takeaways.length > 0 ?
                            `<h3>Key Takeaways</h3>
                             <ul>${note.takeaways.map(item => `<li>${item}</li>`).join('')}</ul>`
                             : ''
                        }
                        ${note.actionItems && note.actionItems.length > 0 ?
                            `<h3>Action Items</h3>
                             <ul>${note.actionItems.map(item => `<li>${item}</li>`).join('')}</ul>`
                             : ''
                        }
                    </div>
                `;
                notesContainer.appendChild(noteItem);

                // Event listener for expanding/collapsing the note
                noteItem.querySelector('.note-header').addEventListener('click', () => {
                     noteItem.querySelector('.note-content').classList.toggle('expanded');
                });

                // Event listener for deleting the note
                noteItem.querySelector('.delete-btn').addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent the expand/collapse toggle
                    deleteNote(videoId);
                });
            });
        }
    };

    const loadNotes = () => {
        chrome.storage.local.get('savedSummaries', (data) => {
            renderNotes(data.savedSummaries || {});
        });
    };

    const deleteNote = (videoId) => {
        chrome.storage.local.get('savedSummaries', (data) => {
            const summaries = data.savedSummaries || {};
            delete summaries[videoId];
            chrome.storage.local.set({ savedSummaries: summaries }, () => {
                loadNotes(); // Re-render the list
            });
        });
    };

    // --- Settings Management ---

    // Load saved API key into settings
    chrome.storage.sync.get('geminiApiKey', (data) => {
        if (data.geminiApiKey) {
            apiKeyInput.value = data.geminiApiKey;
        }
    });

    // Save API key
    saveButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
                statusMessage.textContent = 'Saved!';
                setTimeout(() => {
                    statusMessage.textContent = '';
                }, 2000);
            });
        } else {
             statusMessage.textContent = 'Please enter a key.';
             statusMessage.style.color = '#ff8a80';
             setTimeout(() => {
                    statusMessage.textContent = '';
                    statusMessage.style.color = '#4caf50';
                }, 2000);
        }
    });

    // --- Transcript Fetching from URL ---
    fetchTranscriptBtn.addEventListener('click', () => {
        const url = manualUrlInput.value.trim();
        if (!url || !url.includes('youtube.com/watch')) {
            manualStatusMessage.textContent = 'Please enter a valid YouTube URL.';
            manualStatusMessage.style.color = '#ff8a80';
            setTimeout(() => {
                manualStatusMessage.textContent = '';
                manualStatusMessage.style.color = '#4caf50';
            }, 2500);
            return;
        }
        
        fetchTranscriptBtn.disabled = true;
        fetchTranscriptBtn.textContent = 'Fetching...';
        manualStatusMessage.textContent = '';

        chrome.runtime.sendMessage({ type: 'FETCH_TRANSCRIPT_FROM_URL', url }, (response) => {
            if (chrome.runtime.lastError || !response || response.status === 'error') {
                manualStatusMessage.textContent = response.message || 'Failed to fetch transcript.';
                manualStatusMessage.style.color = '#ff8a80';
            } else {
                manualTranscriptInput.value = response.transcript;
                manualStatusMessage.textContent = 'Transcript pasted!';
                setTimeout(() => {
                    manualStatusMessage.textContent = '';
                }, 2000);
            }

            fetchTranscriptBtn.disabled = false;
            fetchTranscriptBtn.textContent = 'Fetch & Paste Transcript';
        });
    });


    // --- Manual Summary Generation ---
    generateManualSummaryBtn.addEventListener('click', () => {
        const transcript = manualTranscriptInput.value.trim();
        if (!transcript) {
            manualStatusMessage.textContent = 'Please paste a transcript.';
            manualStatusMessage.style.color = '#ff8a80';
            setTimeout(() => {
                manualStatusMessage.textContent = '';
                manualStatusMessage.style.color = '#4caf50';
            }, 2500);
            return;
        }

        generateManualSummaryBtn.disabled = true;
        generateManualSummaryBtn.textContent = 'Summarizing...';
        manualStatusMessage.textContent = '';

        chrome.runtime.sendMessage({ type: 'SUMMARIZE_VIDEO', transcript }, (response) => {
            if (chrome.runtime.lastError || !response || response.status === 'error') {
                manualStatusMessage.textContent = response.message || 'Summarization failed.';
                manualStatusMessage.style.color = '#ff8a80';
                generateManualSummaryBtn.disabled = false;
                generateManualSummaryBtn.textContent = 'Generate Summary';
                return;
            }

            // Successfully summarized, now save it
            const summaryResult = response.data;
            const videoTitle = manualTitleInput.value.trim() || `Manual Note ${new Date().toLocaleDateString()}`;
            const summaryData = {
                title: videoTitle,
                summary: summaryResult.summary,
                takeaways: summaryResult.takeaways,
                actionItems: summaryResult.actionItems
            };
            const videoId = `manual-${Date.now()}`;

            chrome.runtime.sendMessage({ type: 'SAVE_SUMMARY', videoId, summaryData }, (saveResponse) => {
                if (saveResponse && saveResponse.status === 'success') {
                    // Success! Clear form, switch view, and reload notes
                    manualTitleInput.value = '';
                    manualTranscriptInput.value = '';
                    manualUrlInput.value = '';
                    generateManualSummaryBtn.disabled = false;
                    generateManualSummaryBtn.textContent = 'Generate Summary';
                    showView(notesView);
                    loadNotes();
                } else {
                    manualStatusMessage.textContent = 'Failed to save the note.';
                    manualStatusMessage.style.color = '#ff8a80';
                    generateManualSummaryBtn.disabled = false;
                    generateManualSummaryBtn.textContent = 'Generate Summary';
                }
            });
        });
    });

    // Initial load
    loadNotes();
});
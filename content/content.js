// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // This handles requests to fetch the transcript for a URL opened in the background
    if (request.type === 'GET_TRANSCRIPT') {
        // Use the existing getTranscript function
        getTranscript()
            .then(transcript => {
                sendResponse({ status: 'success', transcript: transcript });
            })
            .catch(error => {
                sendResponse({ status: 'error', message: error.message });
            });
        return true; // Indicates we will respond asynchronously
    }
});


let summarizeButton = null;
let modal = null;

// --- Helper functions for robustly finding elements in dynamic pages ---

/**
 * Waits for a single element to appear in the DOM.
 * @param {string} selector - The CSS selector for the element.
 * @param {Element} parent - The parent element to search within.
 * @param {number} timeout - The maximum time to wait in milliseconds.
 * @returns {Promise<Element>} A promise that resolves with the found element.
 */
const waitForElement = (selector, parent = document, timeout = 7000) => {
    return new Promise((resolve, reject) => {
        const intervalTime = 100;
        let elapsedTime = 0;

        const timer = setInterval(() => {
            const element = parent.querySelector(selector);
            if (element) {
                clearInterval(timer);
                resolve(element);
            }

            elapsedTime += intervalTime;
            if (elapsedTime >= timeout) {
                clearInterval(timer);
                reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms.`));
            }
        }, intervalTime);
    });
};

/**
 * Waits for multiple elements to appear in the DOM.
 * @param {string} selector - The CSS selector for the elements.
 * @param {Element} parent - The parent element to search within.
 * @param {number} timeout - The maximum time to wait in milliseconds.
 * @returns {Promise<NodeListOf<Element>>} A promise that resolves with the found elements.
 */
const waitForAllElements = (selector, parent = document, timeout = 7000) => {
     return new Promise((resolve, reject) => {
        const intervalTime = 100;
        let elapsedTime = 0;

        const timer = setInterval(() => {
            const elements = parent.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                clearInterval(timer);
                resolve(elements);
            }

            elapsedTime += intervalTime;
            if (elapsedTime >= timeout) {
                clearInterval(timer);
                reject(new Error(`Elements with selector "${selector}" not found within ${timeout}ms.`));
            }
        }, intervalTime);
    });
};

// --- Helper function for getting video title robustly ---
const getVideoTitle = () => {
    // Method 1: Try the modern H1 element selector for the video title.
    const h1Element = document.querySelector('h1.style-scope.ytd-watch-metadata yt-formatted-string');
    if (h1Element && h1Element.textContent.trim()) {
        return h1Element.textContent.trim();
    }

    // Method 2: Try a slightly older but common selector structure.
    const olderH1Element = document.querySelector('#title h1.ytd-video-primary-info-renderer');
     if (olderH1Element && olderH1Element.textContent.trim()) {
        return olderH1Element.textContent.trim();
    }

    // Method 3: Fallback to the document's title tag.
    const pageTitle = document.title;
    if (pageTitle) {
        // Remove " - YouTube" from the end of the title
        return pageTitle.replace(/ - YouTube$/, '').trim();
    }
    
    // Method 4: Final fallback.
    return 'Untitled YouTube Video';
};


// --- Modal UI Management ---

const createModal = () => {
    if (document.getElementById('summarizer-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'summarizer-modal-overlay';

    const container = document.createElement('div');
    container.id = 'summarizer-modal-container';

    const header = document.createElement('div');
    header.id = 'summarizer-modal-header';
    const title = document.createElement('h2');
    title.textContent = 'Video Summary';
    const closeBtn = document.createElement('button');
    closeBtn.id = 'summarizer-modal-close-btn';
    closeBtn.innerHTML = '&times;';
    header.appendChild(title);
    header.appendChild(closeBtn);

    const content = document.createElement('div');
    content.id = 'summarizer-modal-content';
    
    const footer = document.createElement('div');
    footer.id = 'summarizer-modal-footer';

    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(footer);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    closeBtn.onclick = hideModal;
    overlay.onclick = (e) => {
        if (e.target === overlay) hideModal();
    };

    modal = { overlay, container, header, content, footer };
};

const showModal = () => modal && modal.overlay.classList.add('visible');
const hideModal = () => modal && modal.overlay.classList.remove('visible');

const setModalContent = (htmlContent, showFooter = false) => {
    if (!modal) createModal();
    modal.content.innerHTML = htmlContent;
    modal.footer.style.display = showFooter ? 'flex' : 'none';
};

const displayLoading = () => {
    setModalContent('<div class="summarizer-loader"></div>');
    if(modal.footer) modal.footer.innerHTML = ''; // Clear footer
    showModal();
};

const displayError = (message) => {
    setModalContent(`<div class="summarizer-error">${message}</div>`);
    if(modal.footer) modal.footer.innerHTML = ''; // Clear footer
    showModal();
};

const displaySummary = (data) => {
    let contentHtml = `
        <h3>Summary</h3>
        <p>${data.summary}</p>
    `;

    if (data.takeaways && data.takeaways.length > 0) {
        contentHtml += `
            <h3>Key Takeaways</h3>
            <ul>
                ${data.takeaways.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }

    if (data.actionItems && data.actionItems.length > 0) {
        contentHtml += `
            <h3>Action Items</h3>
            <ul>
                ${data.actionItems.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }

    setModalContent(contentHtml, true);
    
    const saveButton = document.createElement('button');
    saveButton.id = 'summarizer-save-btn';
    saveButton.textContent = 'Save Note';
    modal.footer.innerHTML = '';
    modal.footer.appendChild(saveButton);

    saveButton.onclick = () => {
        const videoId = new URLSearchParams(window.location.search).get('v');
        const videoTitle = getVideoTitle();
        const summaryData = { title: videoTitle, ...data };

        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';
        
        chrome.runtime.sendMessage({ type: 'SAVE_SUMMARY', videoId, summaryData }, (response) => {
            if (response && response.status === 'success') {
                saveButton.textContent = 'Saved!';
            } else {
                saveButton.textContent = 'Error Saving';
                setTimeout(() => {
                    saveButton.disabled = false;
                    saveButton.textContent = 'Save Note';
                }, 2000);
            }
        });
    };
};

// --- Core Logic for Transcript Extraction with Retries ---

const getTranscript = async () => {
    const MAX_ATTEMPTS = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        let transcriptPanel = null;
        try {
            let transcriptOpened = false;

            // Method 1 (Priority): Look for "Show transcript" button directly under the description.
            try {
                const descTranscriptButton = document.querySelector('ytd-video-description-transcript-section-renderer button');
                if (descTranscriptButton) {
                    descTranscriptButton.click();
                    transcriptOpened = true;
                    console.log("Summarizer: Found and clicked 'Show transcript' button in description box.");
                }
            } catch (e) {
                console.warn("Summarizer: Failed to click description transcript button, will try menu.", e);
            }

            // Method 2 (Fallback): If not found in description, use the "More actions" (...) menu.
            if (!transcriptOpened) {
                console.log("Summarizer: Transcript button not in description. Trying 'More actions' menu.");
                
                const actionsContainer = await waitForElement("#actions-inner, #actions.ytd-watch-metadata #menu-container");
                const moreActionsButton = actionsContainer.querySelector('button[aria-label="More actions"]');
                if (!moreActionsButton) throw new Error("Could not find the 'More actions' (...) button.");
                moreActionsButton.click();

                const menuPopup = await waitForElement("ytd-menu-popup-renderer");
                const menuItems = menuPopup.querySelectorAll("ytd-menu-service-item-renderer, tp-yt-paper-item");
                let showTranscriptButtonInMenu = null;
                for (const item of menuItems) {
                    const textElement = item.querySelector('yt-formatted-string, .yt-core-attributed-string');
                    if (textElement && textElement.textContent.trim().toLowerCase().includes("transcript")) {
                        showTranscriptButtonInMenu = item;
                        break;
                    }
                }
                if (!showTranscriptButtonInMenu) throw new Error("Could not find the 'Show transcript' option in the menu.");
                showTranscriptButtonInMenu.click();
            }
            
            // Common steps after transcript is opened by either method:
            transcriptPanel = await waitForElement('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');
            const segments = await waitForAllElements(".ytd-transcript-segment-renderer .segment-text", transcriptPanel);
            const transcriptText = Array.from(segments).map(segment => segment.textContent.trim()).join(' ');

            if (!transcriptText) throw new Error("Transcript panel appeared, but no text segments were found.");
            
            // Success! Close the transcript panel and return the text.
            const closeButton = document.querySelector("ytd-watch-flexy #panels #dismiss-button, ytd-watch-flexy #panels #close-button");
            if (closeButton) closeButton.click();
            return transcriptText;

        } catch (error) {
            lastError = error;
            console.warn(`Summarizer: Transcript extraction attempt ${attempt} failed:`, error.message);

            // Clean up UI state (close any open panels) before retrying
            if (document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]')) {
                try {
                    const closeButton = document.querySelector("ytd-watch-flexy #panels #dismiss-button, ytd-watch-flexy #panels #close-button");
                    if (closeButton) closeButton.click();
                } catch (cleanupError) {
                    console.warn("Summarizer: Could not clean up transcript panel during retry.", cleanupError);
                }
            }
            
            if (attempt < MAX_ATTEMPTS) {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Wait before next attempt
            }
        }
    }

    // If all attempts failed, throw the last recorded error.
    throw new Error(`Failed to retrieve transcript after ${MAX_ATTEMPTS} attempts. Reason: ${lastError ? lastError.message : 'Unknown error'}`);
};


// --- Main summarization logic ---
const handleSummarizeClick = async () => {
    summarizeButton.disabled = true;
    summarizeButton.textContent = 'Summarizing...';
    displayLoading();

    try {
        const transcript = await getTranscript();
        
        chrome.runtime.sendMessage({ type: 'SUMMARIZE_VIDEO', transcript }, (response) => {
            if (chrome.runtime.lastError) {
                displayError("An unexpected error occurred. Please try again.");
                console.error(chrome.runtime.lastError.message);
            } else if (response.status === 'success') {
                displaySummary(response.data);
            } else {
                displayError(response.message || 'Failed to generate summary.');
            }
            summarizeButton.disabled = false;
            summarizeButton.textContent = 'Summarize';
        });
    } catch (error) {
        console.error("Error during summarization process:", error);
        displayError(error.message);
        summarizeButton.disabled = false;
        summarizeButton.textContent = 'Summarize';
    }
};


// --- Button Injection Logic ---

const createSummarizeButton = () => {
    const button = document.createElement('button');
    button.id = 'summarize-btn';
    button.textContent = 'Summarize';
    button.onclick = handleSummarizeClick;
    return button;
};

const injectSummarizeButton = () => {
    if (document.getElementById('summarize-btn')) return;

    summarizeButton = createSummarizeButton();
    createModal();

    const potentialParents = [
        '#actions.ytd-watch-metadata',
        '#actions-inner',
        '#top-row.ytd-watch-metadata',
        '#info-contents #menu',
    ];

    const findParentAndInject = () => {
        for (const selector of potentialParents) {
            const parent = document.querySelector(selector);
            if (parent) {
                parent.appendChild(summarizeButton);
                return true;
            }
        }
        return false;
    };

    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
        if (findParentAndInject() || attempts >= maxAttempts) {
            clearInterval(interval);
            if (!document.getElementById('summarize-btn')) {
                console.error('Could not find a location to inject the summarize button.');
            }
        }
        attempts++;
    }, 1000);
};

// --- Initialization ---

let currentUrl = location.href;
const observer = new MutationObserver(() => {
    if (location.href !== currentUrl) {
        currentUrl = location.href;
        if (currentUrl.includes('/watch')) {
            injectSummarizeButton();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSummarizeButton);
} else {
    injectSummarizeButton();
}
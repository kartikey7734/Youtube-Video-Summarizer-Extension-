// Import the Google GenAI SDK from the installed package
import { GoogleGenAI, Type } from '@google/genai';
import { generateSummary } from '../services/geminiService.js';

/**
 * Sends a message to a specific tab with a timeout.
 * @param {number} tabId The ID of the tab to send the message to.
 * @param {any} message The message to send.
 * @param {number} timeout The timeout in milliseconds.
 * @returns {Promise<any>} A promise that resolves with the response or rejects on error/timeout.
 */
const sendMessageWithTimeout = (tabId, message, timeout) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Message to tab ${tabId} timed out after ${timeout}ms`));
        }, timeout);

        chrome.tabs.sendMessage(tabId, message, (response) => {
            clearTimeout(timer);
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(response);
            }
        });
    });
};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SUMMARIZE_VIDEO') {
        (async () => {
            try {
                const data = await chrome.storage.sync.get('geminiApiKey');
                if (!data.geminiApiKey) {
                    throw new Error("API key not set. Please save it in the extension popup.");
                }
                const result = await generateSummary(data.geminiApiKey, request.transcript, GoogleGenAI, Type);
                sendResponse({ status: 'success', data: result });
            } catch (error) {
                sendResponse({ status: 'error', message: error.message });
            }
        })();
        return true; // Indicate that the response will be sent asynchronously

    } else if (request.type === 'SAVE_SUMMARY') {
        const { videoId, summaryData } = request;
        chrome.storage.local.get(['savedSummaries'], (result) => {
            const summaries = result.savedSummaries || {};
            summaries[videoId] = summaryData;
            chrome.storage.local.set({ savedSummaries: summaries }, () => {
                if (chrome.runtime.lastError) {
                    sendResponse({ status: 'error', message: 'Failed to save summary.' });
                } else {
                    sendResponse({ status: 'success' });
                }
            });
        });
        return true; // Indicate async response
        
    } else if (request.type === 'FETCH_TRANSCRIPT_FROM_URL') {
        (async () => {
            let tempTabId = null;
            try {
                const url = request.url;
                if (!url || !url.startsWith("https://www.youtube.com/watch")) {
                    throw new Error("Invalid YouTube URL provided.");
                }
                
                const tab = await chrome.tabs.create({ url: url, active: false });
                tempTabId = tab.id;

                // Wait for the tab to finish loading
                await new Promise((resolve, reject) => {
                    const listener = (tabId, changeInfo) => {
                        if (tabId === tempTabId) {
                            if (changeInfo.status === 'complete') {
                                chrome.tabs.onUpdated.removeListener(listener);
                                // A small extra delay for dynamic content to load on YouTube
                                setTimeout(resolve, 1000); 
                            }
                        }
                    };
                    chrome.tabs.onUpdated.addListener(listener);
                });

                const response = await sendMessageWithTimeout(tempTabId, { type: 'GET_TRANSCRIPT' }, 30000); // 30s timeout
                
                if (response && response.status === 'success') {
                    sendResponse({ status: 'success', transcript: response.transcript });
                } else {
                    throw new Error(response.message || 'Failed to get transcript from the page.');
                }

            } catch (error) {
                sendResponse({ status: 'error', message: error.message });
            } finally {
                if (tempTabId) {
                    await chrome.tabs.remove(tempTabId);
                }
            }
        })();
        return true; // async
    }
});
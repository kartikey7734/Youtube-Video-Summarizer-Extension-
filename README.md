# YouTube Video Summarizer Chrome Extension

A powerful Chrome extension that uses Google's Gemini AI to summarize YouTube videos instantly. Get the key takeaways, a detailed summary, and actionable items without watching the entire video.

## Features

- **Instant Summarization**: Summarize any YouTube video with a single click.
- **AI-Powered**: Uses the Gemini 2.5 Flash model for fast and accurate summaries.
- **Key Takeaways**: Automatically extracts the 3-5 most important points.
- **Action Items**: Identifies tasks or recommendations mentioned in the video.
- **Save Notes**: Save your summaries directly to the extension for later reference.
- **Seamless Integration**: Adds a "Summarize" button directly to the YouTube interface.

## Installation

### 1. Clone or Download the Repository
Download the source code to your local machine.

### 2. Install Dependencies
Navigate to the project directory and install the necessary packages:
```bash
npm install
```

### 3. Build the Extension
Compile the TypeScript and JavaScript files:
```bash
npm run build
```
This will create a `dist` folder (or use the root files if configured for development).

### 4. Load into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the project folder (the one containing `manifest.json`).

## Configuration

To use the extension, you need a Gemini API Key:

1. Get an API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click the extension icon in your Chrome toolbar to open the popup.
3. Enter your API key in the settings/options field.
4. Click **Save**.

## How to Use

1. Navigate to any YouTube video.
2. Look for the **Summarize** button near the video title or actions bar.
3. Click the button. The extension will automatically:
   - Open the video transcript.
   - Extract the text.
   - Send it to Gemini AI for processing.
4. A modal will appear with your summary, takeaways, and action items.
5. Click **Save Note** to keep the summary for future reference.

## Technical Details

- **Manifest V3**: Built using the latest Chrome extension standards.
- **Vite**: Used as the build tool for fast development and optimized production code.
- **Gemini API**: Leverages `gemini-2.5-flash` for high-performance natural language processing.
- **Content Scripts**: Injects UI elements and extracts transcripts directly from the YouTube DOM.
- **Background Service Worker**: Handles API communication and data persistence.

## Development

To run the project in development mode:
```bash
npm run dev
```

## Permissions
- `storage`: To save your API key and video summaries.
- `scripting`: To interact with the YouTube page.
- `activeTab`: To access the current video page.
- `host_permissions`: Specifically for `*.youtube.com` to extract transcripts.

---
*Note: This extension requires the video to have a transcript available on YouTube.*

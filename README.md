# Google No-AI Search Extension

A lightweight, privacy-focused Chrome Extension that automatically appends `-ai` to your Google Search queries. This effectively filters out AI Overviews and AI-generated snapshots from your search results, returning the classic search experience.

## Features

- **Instant Redirect:** Uses the `webNavigation` API to modify the query before the page loads.
- **Toggle Switch:** Easily enable or disable the filter via a popup menu.
- **Privacy Focused:** Only runs on Google Search URLs. No data is collected or transmitted.
- **Open Source:** Full transparency on how the extension modifies your URL.

## Installation (Download from Releases or continue following to do this harder)

If you want to run this locally without downloading from the Web Store:

1. Clone this repository or download the code.
2. Open Chrome and navigate to `chrome://extensions`.
3. Toggle **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the folder containing these files.

## Project Structure

- `manifest.json`: Configuration and permissions (Manifest V3).
- `background.js`: Service worker that intercepts navigation events.
- `popup.html`: The user interface for the toggle switch.
- `popup.js`: Logic for saving the toggle state to local storage.

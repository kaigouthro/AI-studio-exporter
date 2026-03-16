// AI Studio Exporter - Background Service Worker
importScripts('settings.js');

chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Studio Exporter installed');
});

const ALLOWED_BACKGROUND_ACTIONS = new Set(['checkTab']);

// Handle messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const senderUrl = sender?.url;
  const isInternalMessage = sender?.id === chrome.runtime.id &&
    (!senderUrl || senderUrl.startsWith(chrome.runtime.getURL('')));
  const isValidRequest = request &&
    typeof request === 'object' &&
    !Array.isArray(request) &&
    typeof request.action === 'string' &&
    ALLOWED_BACKGROUND_ACTIONS.has(request.action);

  if (!isInternalMessage) {
    sendResponse?.({ isAIStudio: false, error: 'Invalid sender' });
    return false;
  }

  if (!isValidRequest) {
    sendResponse?.({ isAIStudio: false, error: 'Invalid request' });
    return false;
  }

  // Check if current tab is AI Studio
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const [tab] = tabs;

    if (!tab || !tab.url || !isAIStudioUrl(tab.url)) {
      sendResponse({ isAIStudio: false });
      return;
    }
    sendResponse({ isAIStudio: true, url: tab.url });
  });

  return true; // Will respond asynchronously
});

console.log('AI Studio Exporter background service worker loaded');

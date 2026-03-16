// AI Studio Exporter - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Studio Exporter installed');
});

// Handle messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const isTrustedSender = !sender || !sender.id || sender.id === chrome.runtime.id;
  if (!isTrustedSender || !request || typeof request !== 'object' || request.action !== 'checkTab') {
    sendResponse?.({ isAIStudio: false, error: 'Invalid request' });
    return false;
  }

  // Check if current tab is AI Studio
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const [tab] = tabs;

    if (!tab || !tab.url) {
      sendResponse({ isAIStudio: false });
      return;
    }

    try {
      const tabUrl = new URL(tab.url);
      const isAIStudio = tabUrl.hostname === 'aistudio.google.com';
      sendResponse({ isAIStudio, url: tab.url });
    } catch (error) {
      console.warn('Unable to parse tab URL', error);
      sendResponse({ isAIStudio: false });
    }
  });

  return true; // Will respond asynchronously
});

console.log('AI Studio Exporter background service worker loaded');

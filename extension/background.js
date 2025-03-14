function startPicker() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError || !dataUrl) {
        console.error('Error capturing screenshot:', chrome.runtime.lastError);
        return;
      }
      chrome.storage.local.set({ drasticPickerScreenshot: dataUrl }, () => {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['picker.js'],
        });
      });
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startPicker') {
    startPicker();
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'openPicker') {
    startPicker();
  }
});

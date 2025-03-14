function renderRecentColors() {
  chrome.storage.local.get('drasticPickerRecent', (result) => {
    const recent = result.drasticPickerRecent || [];
    const container = document.getElementById('recentColors');
    container.innerHTML = '';
    recent.forEach((color) => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'recentColor';
      colorDiv.style.background = color;
      colorDiv.title = color;
      colorDiv.addEventListener('click', () => {
        navigator.clipboard.writeText(color).then(() => {
          showToast(`Copied ${color}`);
        });
      });
      container.appendChild(colorDiv);
    });
  });
}

renderRecentColors();

// Toast function for popup too (if needed)
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#FFCC00';
  toast.style.color = '#000';
  toast.style.fontWeight = 'bold';
  toast.style.padding = '10px 20px';
  toast.style.border = '3px solid #000';
  toast.style.boxShadow = '4px 4px 0 #000';
  toast.style.zIndex = '11000';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// When the "Pick Color" button is clicked, send a message to start the picker overlay
document.getElementById('pickColorBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'startPicker' });
  window.close(); // Close the popup after starting the picker
});

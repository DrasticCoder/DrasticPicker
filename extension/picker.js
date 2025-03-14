chrome.storage.local.get('drasticPickerScreenshot', (result) => {
  const dataUrl = result.drasticPickerScreenshot;
  if (!dataUrl) {
    console.error('No screenshot found in storage.');
    return;
  }

  // Create full-page overlay with crosshair cursor
  const overlay = document.createElement('div');
  overlay.id = 'drastic-picker-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.3)';
  overlay.style.zIndex = '9999';
  overlay.style.cursor = 'crosshair';
  document.body.appendChild(overlay);

  // Create hidden canvas for screenshot
  const hiddenCanvas = document.createElement('canvas');
  hiddenCanvas.id = 'drastic-picker-hidden-canvas';
  hiddenCanvas.style.display = 'none';
  overlay.appendChild(hiddenCanvas);
  const hiddenCtx = hiddenCanvas.getContext('2d');

  const img = new Image();
  img.onload = () => {
    hiddenCanvas.width = img.width;
    hiddenCanvas.height = img.height;
    hiddenCtx.drawImage(img, 0, 0);
    const scaleX = img.width / window.innerWidth;
    const scaleY = img.height / window.innerHeight;
    overlay.dataset.scaleX = scaleX;
    overlay.dataset.scaleY = scaleY;
  };
  img.src = dataUrl;

  // Create zoom lens canvas
  const lens = document.createElement('canvas');
  lens.id = 'drastic-picker-lens';
  lens.width = 120;
  lens.height = 120;
  lens.style.position = 'fixed';
  lens.style.border = '2px solid #000';
  lens.style.borderRadius = '50%';
  lens.style.pointerEvents = 'none';
  lens.style.transform = 'translate(-50%, -50%)';
  lens.style.zIndex = '10000';
  overlay.appendChild(lens);
  const lensCtx = lens.getContext('2d');

  // Create preview box for hex code
  const previewBox = document.createElement('div');
  previewBox.id = 'drastic-picker-preview';
  previewBox.style.position = 'fixed';
  previewBox.style.top = '10px';
  previewBox.style.right = '10px';
  previewBox.style.width = '60px';
  previewBox.style.height = '60px';
  previewBox.style.border = '2px solid #000';
  previewBox.style.zIndex = '10000';
  previewBox.style.display = 'flex';
  previewBox.style.alignItems = 'center';
  previewBox.style.justifyContent = 'center';
  previewBox.style.background = '#fff';
  previewBox.style.fontSize = '0.8rem';
  overlay.appendChild(previewBox);

  // Toast notification function in neobrutalism style
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

  // Helper: Convert RGB to HEX
  function rgbToHex(r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  const zoomFactor = 5; // More zoom
  function onMouseMove(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    // Center the lens on the cursor
    lens.style.left = `${mouseX}px`;
    lens.style.top = `${mouseY}px`;
    const scaleX = parseFloat(overlay.dataset.scaleX) || 1;
    const scaleY = parseFloat(overlay.dataset.scaleY) || 1;
    const lensWidth = lens.width;
    const lensHeight = lens.height;
    const regionWidth = lensWidth / zoomFactor;
    const regionHeight = lensHeight / zoomFactor;
    const sx = mouseX * scaleX - regionWidth / 2;
    const sy = mouseY * scaleY - regionHeight / 2;
    lensCtx.clearRect(0, 0, lensWidth, lensHeight);
    try {
      lensCtx.drawImage(
        hiddenCanvas,
        sx,
        sy,
        regionWidth,
        regionHeight,
        0,
        0,
        lensWidth,
        lensHeight,
      );
    } catch (err) {}
    try {
      const pixel = hiddenCtx.getImageData(
        mouseX * scaleX,
        mouseY * scaleY,
        1,
        1,
      ).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      previewBox.style.background = hex;
      previewBox.textContent = hex;
    } catch (err) {}
  }

  function onClick(e) {
    const scaleX = parseFloat(overlay.dataset.scaleX) || 1;
    const scaleY = parseFloat(overlay.dataset.scaleY) || 1;
    try {
      const pixel = hiddenCtx.getImageData(
        e.clientX * scaleX,
        e.clientY * scaleY,
        1,
        1,
      ).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      navigator.clipboard.writeText(hex);
      showToast(`Copied ${hex}`);
      // Update recent colors: only store last 5
      chrome.storage.local.get('drasticPickerRecent', (result) => {
        let recent = result.drasticPickerRecent || [];
        recent = recent.filter((c) => c !== hex);
        recent.unshift(hex);
        if (recent.length > 5) recent = recent.slice(0, 4);
        chrome.storage.local.set({ drasticPickerRecent: recent });
      });
    } catch (err) {
      console.error('Error picking color:', err);
    }
    removeOverlay();
  }

  function onKeyDown(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
      const currentHex = previewBox.textContent;
      if (currentHex && currentHex.startsWith('#')) {
        navigator.clipboard.writeText(currentHex);
        showToast(`Copied ${currentHex}`);
        removeOverlay();
      }
    }
    if (e.key === 'Escape') {
      removeOverlay();
    }
  }

  function removeOverlay() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeyDown);
});

# DrasticPicker

DrasticPicker is a ~~Yet Anothor Color Picker Extension~~ neobrutalism–themed Chrome extension for picking colors from any webpage. It provides a zoom lens overlay, a crosshair cursor, and stores your last 5 picked colors for quick access.

## Features

- **Full-Page Picker Overlay:** Activate the picker via the popup button or Alt+P shortcut.
- **Zoom Lens:** Displays a magnified view of the area under the cursor.
- **Crosshair Cursor:** Ensures precise selection.
- **Recent Colors:** Stores the last 5 picked colors for quick copying.
- **Neobrutalism Theme:** Bold design with strong contrasts and drop shadows.
- **Keyboard Shortcut:** Press Alt+P to open the picker directly; Ctrl+C to copy the current color and close.

## Installation

1. Download the ZIP from the `/dist` folder or GitHub Releases.
2. In Chrome, navigate to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the `extension` folder.

## Usage

- **Open Picker:** Click the extension icon to open the popup and then click "Pick Color" or press Alt+P.
- **Select Color:** Move the mouse to see a zoomed-in preview and click to copy the hex code.
- **Recent Colors:** View your last 5 colors in the popup; click to copy any color.

## Repository Structure

```
.
├── CONTRIBUTING.md
├── dist
│   └── DrasticPicker.zip
├── extension
│   ├── background.js
│   ├── image.png
│   ├── manifest.json
│   ├── picker.js
│   ├── popup.html
│   ├── popup.js
│   └── styles.css
├── index.html
├── LICENSE
├── README.md
└── website
    ├── script.js
    └── styles.css

4 directories, 14 files

```

## CI/CD

The GitHub Actions workflow in `.github/workflows/build.yml` automatically packages the extension into a ZIP file in the `/dist` folder on every push to `main`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

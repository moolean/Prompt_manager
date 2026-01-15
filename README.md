<div align="center">

# 🎯 Prompt Manager

**A powerful, privacy-first browser extension for managing your AI prompt templates**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)](https://github.com/moolean/Prompt_manager)
[![Edge Extension](https://img.shields.io/badge/Edge-Extension-blue?logo=microsoft-edge)](https://github.com/moolean/Prompt_manager)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Screenshots](#-screenshots) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🔐 **Privacy First**
- **100% Local Storage** - No server connections, your prompts stay private
- **Full Data Control** - Export and import your prompts anytime
- **Cross-browser Sync** - Uses Chrome sync storage (optional)

### 📝 **Powerful Management**
- **Version History** - Track every change to your prompts
- **Quick Access** - Copy prompts to clipboard with one click
- **Right-click Integration** - Save selected text as prompt from any webpage
- **Smart Organization** - Manage multiple prompt templates efficiently

### 🎨 **User Friendly**
- **Clean Interface** - Modern, intuitive design
- **Fast Performance** - Lightweight and responsive
- **Easy Import/Export** - JSON-based backup system
- **Context Menu** - Inject prompts directly into any input field

---

## 🚀 Installation

### From Source (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/moolean/Prompt_manager.git
   cd Prompt_manager
   ```

2. **Load the extension**

   **For Chrome:**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `Prompt_manager` directory

   **For Edge:**
   - Navigate to `edge://extensions/`
   - Enable "Developer mode" (toggle in bottom left)
   - Click "Load unpacked"
   - Select the `Prompt_manager` directory

3. **Start using!**
   - Click the extension icon in your browser toolbar
   - Create your first prompt template

### From Web Store (Coming Soon)
We're working on publishing to Chrome Web Store and Microsoft Edge Add-ons.

---

## 📖 Usage

### Creating Your First Prompt

1. Click the **Prompt Manager** icon in your toolbar
2. Click **"Add New Prompt"**
3. Enter a name for your prompt
4. Add your prompt text
5. Optionally specify a model and add comments
6. Click **"Save"**

### Managing Prompts

- **Copy to Clipboard**: Click the copy button next to any prompt
- **Edit**: Click on a prompt name to view and edit
- **Version Control**: Save new versions or update existing ones
- **Delete**: Remove prompts you no longer need

### Quick Features

- **Right-click Menu**: Select text on any webpage → Right-click → "Save as Prompt"
- **Context Injection**: Right-click in any input field → "Inject Prompt" → Select your prompt
- **Import/Export**: Use the footer buttons to backup or restore your prompts

---

## 📸 Screenshots

<div align="center">

### Main Interface
![Homepage](showImg/homepage.png)

### Create New Prompt
![New Prompt](showImg/newprompt.png)

### Add & Manage Prompts
![Add Prompt](showImg/addprompt.png)

</div>

---

## 🛠️ Development

### Prerequisites
- Chrome or Edge browser
- Basic knowledge of JavaScript and Chrome Extension APIs

### Project Structure
```
Prompt_manager/
├── manifest.json       # Extension manifest
├── popup.html         # Main UI
├── popup.js           # UI logic
├── background.js      # Service worker
├── content.js         # Content script
├── options.html       # Settings page
├── options.js         # Settings logic
├── icons/            # Extension icons
└── showImg/          # Screenshots
```

### Making Changes
1. Make your code changes
2. Reload the extension in browser
3. Test thoroughly
4. Submit a pull request

---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Ways to Contribute
- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🌍 Add translations
- 🔧 Submit bug fixes
- ✨ Add new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

## 📬 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/moolean/Prompt_manager/issues)
- **Discussions**: [GitHub Discussions](https://github.com/moolean/Prompt_manager/discussions)
- **Author**: [@moolean](https://github.com/moolean)

---

<div align="center">

**Made with ❤️ by the community**

[⬆ Back to Top](#-prompt-manager)

</div>

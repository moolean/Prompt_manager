# Contributing to Prompt Manager

First off, thank you for considering contributing to Prompt Manager! It's people like you that make this tool better for everyone. 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

- A Chromium-based browser (Chrome, Edge, Brave, etc.)
- Git for version control
- Basic understanding of JavaScript and Chrome Extension APIs

### Setting Up Your Development Environment

1. **Fork the Repository**
   - Visit https://github.com/moolean/Prompt_manager
   - Click the "Fork" button in the top right

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Prompt_manager.git
   cd Prompt_manager
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/moolean/Prompt_manager.git
   ```

4. **Load Extension in Browser**
   - Open Chrome/Edge and navigate to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project directory

## 🤝 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Browser version** and operating system
- **Extension version**

Use the bug report template when available.

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - explain why this would be useful
- **Proposed solution** if you have one
- **Alternative solutions** you've considered
- **Mockups or examples** if applicable

### Your First Code Contribution 🎯

Unsure where to begin? Look for issues labeled:

- `good first issue` - suitable for newcomers
- `help wanted` - need community assistance
- `bug` - confirmed bugs ready to be fixed
- `enhancement` - approved new features

### Pull Requests 🔀

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clean, maintainable code
   - Follow the existing code style
   - Add comments for complex logic
   - Keep changes focused and atomic

3. **Test Your Changes**
   - Load the extension in your browser
   - Test all affected functionality
   - Verify existing features still work
   - Test in both Chrome and Edge if possible

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```
   
   Write meaningful commit messages:
   - Use present tense ("Add feature" not "Added feature")
   - Use imperative mood ("Move cursor to..." not "Moves cursor to...")
   - Limit first line to 72 characters
   - Reference issues and PRs liberally

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Link related issues

## 🔧 Development Setup

### File Structure

```
Prompt_manager/
├── manifest.json         # Extension manifest (Manifest V3)
├── popup.html           # Main popup interface
├── popup.js             # Popup functionality
├── background.js        # Background service worker
├── content.js           # Content script for page injection
├── options.html         # Settings page
├── options.js           # Settings functionality
├── icons/               # Extension icons (16px, 48px, 128px)
└── showImg/             # Screenshots for documentation
```

### Key Technologies

- **Manifest V3** - Chrome Extension Manifest format
- **Chrome Storage API** - For data persistence
- **Chrome Context Menus** - For right-click injection
- **Vanilla JavaScript** - No frameworks, lightweight implementation

### Testing Checklist

Before submitting your PR, verify:

- [ ] Extension loads without errors
- [ ] All existing features work correctly
- [ ] New features work as expected
- [ ] No console errors or warnings
- [ ] Code is properly formatted
- [ ] Comments added where needed
- [ ] No sensitive data or personal information in code

## 📝 Style Guidelines

### JavaScript Style

- Use modern JavaScript (ES6+)
- Use `const` and `let` instead of `var`
- Use arrow functions where appropriate
- Use template literals for string concatenation
- Add JSDoc comments for functions:
  ```javascript
  /**
   * Brief description of function
   * @param {string} paramName - Description
   * @returns {Object} Description of return value
   */
  function myFunction(paramName) {
    // implementation
  }
  ```

### HTML/CSS Style

- Use semantic HTML elements
- Use CSS custom properties (variables) for theming
- Follow existing naming conventions
- Keep inline styles to a minimum
- Ensure responsive design where applicable

### Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Start with a verb (Add, Fix, Update, Remove, Refactor, etc.)
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Examples:
```
Add search functionality to prompt list

Fix clipboard copy issue in Firefox
Closes #123

Update README with installation instructions

Refactor storage logic for better performance
```

## 🔄 Pull Request Process

1. **Before Submitting**
   - Ensure your code follows the style guidelines
   - Update documentation if needed
   - Add/update screenshots if UI changed
   - Test thoroughly in developer mode

2. **PR Requirements**
   - Clear description of changes
   - Link to related issue(s)
   - Screenshots/videos for UI changes
   - Confirmation that testing was performed

3. **Review Process**
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, maintainers will merge

4. **After Merge**
   - Delete your feature branch
   - Pull the latest changes from upstream
   - Celebrate your contribution! 🎉

## 💬 Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Pull Requests** - Code contributions and reviews

### Getting Help

If you need help:
1. Check existing documentation
2. Search closed issues for similar problems
3. Open a new issue with your question
4. Be patient and respectful

## 🏆 Recognition

Contributors will be:
- Listed in the project's acknowledgments
- Mentioned in release notes for significant contributions
- Given credit for their work

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## ❓ Questions?

Don't hesitate to ask questions! We're here to help and we appreciate your contribution.

Thank you for contributing to Prompt Manager! 🚀

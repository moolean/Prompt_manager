chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'INJECT_PROMPT') {
        const text = message.text;
        
        // Find the active element, which is likely the user's chat input
        const activeElement = document.activeElement;

        if (activeElement && (activeElement.tagName.toLowerCase() === 'textarea' || activeElement.tagName.toLowerCase() === 'input' || activeElement.isContentEditable)) {
            // For standard input fields and textareas
            if (typeof activeElement.value !== 'undefined') {
                 activeElement.value = text;
            } 
            // For content-editable divs (used by some modern chat sites)
            else {
                activeElement.textContent = text;
            }

            // Dispatch an 'input' event to make sure the website's framework (like React) recognizes the change.
            activeElement.dispatchEvent(new Event('input', { bubbles: true }));
            
            sendResponse({ success: true });
        } else {
            alert('Could not find a suitable text input field. Please click on a chat box first.');
            sendResponse({ success: false });
        }
    }
    return true; // Keep the message channel open for async response
});

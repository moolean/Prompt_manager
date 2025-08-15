// This script runs in the context of the web page.

// Variable to store the element that was last right-clicked
let lastRightClickedElement = null;

// Listen for the 'contextmenu' event, which fires before the context menu is displayed.
// This is more reliable than 'mousedown' for this purpose.
document.addEventListener('contextmenu', (event) => {
    lastRightClickedElement = event.target;
}, true);


// Listen for messages from the extension (background script or popup)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'INJECT_PROMPT') {
        const text = message.text;
        
        // Use the stored element from the contextmenu event
        const targetElement = lastRightClickedElement;

        if (targetElement && (targetElement.tagName.toLowerCase() === 'textarea' || targetElement.isContentEditable)) {
            // For textareas or content-editable divs
            if (targetElement.isContentEditable) {
                targetElement.textContent = text;
            } else {
                targetElement.value = text;
            }

            // Dispatch an 'input' event. This is crucial for modern web apps (React, Vue, etc.)
            // to recognize the change in the input field.
            targetElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            
            sendResponse({ success: true });

        } else {
            // Fallback for simple input fields
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea')) {
                activeElement.value = text;
                activeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                sendResponse({ success: true });
            } else {
                // If no suitable element is found, alert the user.
                alert('Could not find a suitable text input field. Please click on a chat box or text area first.');
                sendResponse({ success: false });
            }
        }
    }
    // Return true to indicate that the response will be sent asynchronously.
    return true; 
});
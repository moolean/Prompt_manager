// --- Chrome Sync Storage Logic ---

async function getPromptsFromStorage() {
    try {
        const result = await chrome.storage.sync.get('promptsData');
        const data = result.promptsData || { prompts: [] };
        return { success: true, data: data };
    } catch (error) {
        console.error('Error reading from sync storage:', error);
        return { success: false, error: error.message };
    }
}

async function savePromptsToStorage(data) {
    try {
        await chrome.storage.sync.set({ promptsData: data });
        // After saving, update the context menu
        updateContextMenu(data.prompts);
        return { success: true };
    } catch (error) {
        console.error('Error saving to sync storage:', error);
        return { success: false, error: error.message };
    }
}

// --- Context Menu Logic ---

const CONTEXT_MENU_ID = "PROMPT_MANAGER_PARENT";

function updateContextMenu(prompts) {
    chrome.contextMenus.removeAll(() => {
        if (chrome.runtime.lastError) { /* Ignore */ }
        
        // Menu for injecting prompts
        chrome.contextMenus.create({
            id: CONTEXT_MENU_ID,
            title: "Inject Prompt",
            contexts: ["editable"]
        });

        if (prompts && prompts.length > 0) {
            prompts.forEach(prompt => {
                chrome.contextMenus.create({
                    id: prompt.id,
                    parentId: CONTEXT_MENU_ID,
                    title: prompt.name,
                    contexts: ["editable"]
                });
            });
        } else {
             chrome.contextMenus.create({
                id: "no-prompts",
                parentId: CONTEXT_MENU_ID,
                title: "No prompts available",
                enabled: false,
                contexts: ["editable"]
            });
        }

        // Menu for saving selected text
        chrome.contextMenus.create({
            id: "SAVE_SELECTION_AS_PROMPT",
            title: "Save selection as new Prompt",
            contexts: ["selection"]
        });
    });
}

// Listener for when a context menu item is clicked
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    // Security check: Do not run on protected browser pages or web stores.
    if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://') || 
        tab.url.includes('chrome.google.com/webstore') || 
        tab.url.includes('microsoft.com')) {
        console.log("Prompt Manager: Action prevented on a protected page.");
        return;
    }

    // Handler for injecting a prompt
    if (info.parentMenuItemId === CONTEXT_MENU_ID && info.menuItemId !== "no-prompts") {
        const promptId = info.menuItemId;
        const { success, data } = await getPromptsFromStorage();
        if (success) {
            const prompt = data.prompts.find(p => p.id === promptId);
            if (prompt) {
                const latestVersion = prompt.versions.find(v => v.version === prompt.currentVersion);
                if (latestVersion) {
                    // Try sending a message to the content script first.
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'INJECT_PROMPT',
                        text: latestVersion.promptText
                    }, { frameId: info.frameId }, (response) => {
                        // If it fails, inject the script programmatically.
                        if (chrome.runtime.lastError) {
                            console.log("Content script not available, injecting manually.");
                            chrome.scripting.executeScript({
                                target: { tabId: tab.id, frameIds: [info.frameId] },
                                func: (textToInject) => {
                                    const activeElement = document.activeElement;
                                    if (activeElement) {
                                        if (activeElement.isContentEditable) {
                                            activeElement.textContent = textToInject;
                                        } else if (typeof activeElement.value !== 'undefined') {
                                            activeElement.value = textToInject;
                                        }
                                        activeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                                    }
                                },
                                args: [latestVersion.promptText]
                            });
                        }
                    });
                }
            }
        }
    }

    // Handler for saving the selection
    if (info.menuItemId === "SAVE_SELECTION_AS_PROMPT") {
        const selectionText = info.selectionText;
        if (selectionText) {
            const { success, data } = await getPromptsFromStorage();
            if (success) {
                const newName = `New: "${selectionText.substring(0, 25)}..."`;
                const newPrompt = {
                    id: `prompt_${Date.now()}`,
                    name: newName,
                    currentVersion: 1,
                    versions: [{
                        version: 1,
                        promptText: selectionText,
                        model: '',
                        output: ''
                    }]
                };
                data.prompts.push(newPrompt);
                await savePromptsToStorage(data);
            }
        }
    }
});

// --- Message Listener & Initial Setup ---

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let isAsync = true;
    switch (message.type) {
        case 'GET_PROMPTS':
            getPromptsFromStorage().then(sendResponse);
            break;
        case 'SAVE_PROMPTS':
            savePromptsToStorage(message.data).then(sendResponse);
            break;
        case 'UPDATE_CONTEXT_MENU':
            getPromptsFromStorage().then(result => {
                if(result.success) updateContextMenu(result.data.prompts);
            });
            // No response needed for this message
            isAsync = false;
            break;
        default:
            isAsync = false;
            break;
    }
    return isAsync;
});

// Initialize context menu on startup
chrome.runtime.onStartup.addListener(() => {
    getPromptsFromStorage().then(result => {
        if(result.success) updateContextMenu(result.data.prompts);
    });
});

// Initialize context menu on install/update
chrome.runtime.onInstalled.addListener(() => {
    getPromptsFromStorage().then(result => {
        if(result.success) updateContextMenu(result.data.prompts);
    });
});

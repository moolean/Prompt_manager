// Using IndexedDB to store the directory handle, as it's not directly storable in chrome.storage
let db;
function getDB() {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);
        const request = indexedDB.open("PromptManagerDB", 1);
        request.onerror = (event) => reject("Error opening DB");
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('handles')) {
                db.createObjectStore("handles", { keyPath: "id" });
            }
        };
    });
}

async function setHandle(handle) {
    const db = await getDB();
    const transaction = db.transaction(["handles"], "readwrite");
    const store = transaction.objectStore("handles");
    return new Promise((resolve, reject) => {
        const request = store.put({ id: "directory", handle });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function getHandle() {
    const db = await getDB();
    const transaction = db.transaction(["handles"], "readonly");
    const store = transaction.objectStore("handles");
    const request = store.get("directory");
    return new Promise(resolve => {
        request.onsuccess = () => resolve(request.result ? request.result.handle : null);
        request.onerror = () => resolve(null); // Resolve with null on error
    });
}

// --- Permission and File System Logic ---
const PROMPT_FILE = 'prompts.json';

// Crucial helper function to verify and request permissions
async function verifyPermission(handle, readWrite) {
    if (!handle) return false;
    const options = {};
    if (readWrite) {
        options.mode = 'readwrite';
    }
    // Check if permission is already granted
    if ((await handle.queryPermission(options)) === 'granted') {
        return true;
    }
    // Request permission if not granted
    if ((await handle.requestPermission(options)) === 'granted') {
        return true;
    }
    return false;
}


async function getFileHandle(dirHandle, create = false) {
    if (!dirHandle) return null;
    // Before getting the file handle, ensure we have permission for the directory.
    const hasPermission = await verifyPermission(dirHandle, true);
    if (!hasPermission) {
        console.error("Permission denied for directory.");
        return null;
    }
    return await dirHandle.getFileHandle(PROMPT_FILE, { create });
}

async function readPromptsFile() {
    const dirHandle = await getHandle();
    if (!dirHandle) return { success: false, error: 'Directory not selected. Please go to settings.' };

    try {
        const fileHandle = await getFileHandle(dirHandle);
        if (!fileHandle) { // File doesn't exist or permission was denied
             return { success: true, data: { prompts: [] } };
        }
        const file = await fileHandle.getFile();
        const contents = await file.text();
        // Handle empty file case
        if (!contents) {
            return { success: true, data: { prompts: [] } };
        }
        return { success: true, data: JSON.parse(contents) };
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return { success: true, data: { prompts: [] } };
        }
        console.error('Error reading prompts file:', error);
        return { success: false, error: error.message };
    }
}

async function savePromptsFile(data) {
    const dirHandle = await getHandle();
    if (!dirHandle) return { success: false, error: 'Directory not selected. Please go to settings.' };

    try {
        const fileHandle = await getFileHandle(dirHandle, true); // Create if it doesn't exist
        if (!fileHandle) {
            return { success: false, error: 'Could not get file handle. Permission might be denied.' };
        }
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(data, null, 2)); // Pretty print JSON
        await writable.close();
        return { success: true };
    } catch (error) {
        console.error('Error saving prompts file:', error);
        return { success: false, error: error.message };
    }
}


// --- Message Listener ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Return true to indicate you wish to send a response asynchronously
    let isAsync = true;

    switch (message.type) {
        case 'SET_DIRECTORY_HANDLE':
            setHandle(message.handle)
                .then(() => sendResponse({ success: true }))
                .catch(err => sendResponse({ success: false, error: err.message }));
            break;

        case 'GET_DIRECTORY_HANDLE':
            getHandle().then(handle => {
                if (handle) {
                    // Just before sending, verify permission silently
                    verifyPermission(handle, false).then(hasPermission => {
                         sendResponse({ success: true, handle: handle, hasPermission: hasPermission });
                    });
                } else {
                    sendResponse({ success: false, handle: null });
                }
            });
            break;

        case 'GET_PROMPTS':
            readPromptsFile().then(sendResponse);
            break;

        case 'SAVE_PROMPTS':
            savePromptsFile(message.data).then(sendResponse);
            break;
        
        default:
            isAsync = false; // No async response for unhandled messages
            break;
    }
    
    return isAsync;
});

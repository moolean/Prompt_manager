document.addEventListener('DOMContentLoaded', () => {
    const selectFolderBtn = document.getElementById('selectFolderBtn');
    const folderPathSpan = document.getElementById('folderPath');

    // Function to verify and store the directory handle
    async function getDirectory() {
        try {
            const handle = await window.showDirectoryPicker();
            // Check if we can write to the directory
            if (await verifyPermission(handle, true)) {
                // Store the handle in indexedDB via the background script for persistence
                chrome.runtime.sendMessage({
                    type: 'SET_DIRECTORY_HANDLE',
                    handle: handle
                }, (response) => {
                    if (response.success) {
                        folderPathSpan.textContent = handle.name;
                        alert('Folder selected successfully!');
                    } else {
                        alert('Failed to store folder permission.');
                    }
                });
            } else {
                alert('Permission to write to the selected folder was denied.');
            }
        } catch (error) {
            // Handle cases where the user cancels the picker
            if (error.name !== 'AbortError') {
                console.error('Error selecting directory:', error);
                alert('An error occurred while selecting the folder.');
            }
        }
    }

    // Function to check and display the currently stored directory on load
    async function loadInitialDirectory() {
        chrome.runtime.sendMessage({ type: 'GET_DIRECTORY_HANDLE' }, (response) => {
            if (response.success && response.handle) {
                folderPathSpan.textContent = response.handle.name;
            }
        });
    }
    
    // Helper function to verify permissions
    async function verifyPermission(handle, readWrite) {
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

    selectFolderBtn.addEventListener('click', getDirectory);
    
    // Load the stored directory path when the options page is opened
    loadInitialDirectory();
});

document.addEventListener('DOMContentLoaded', () => {
    const selectFolderBtn = document.getElementById('selectFolderBtn');
    const folderPathSpan = document.getElementById('folderPath');
    const statusDiv = document.getElementById('status');

    // Function to verify and store the directory handle
    async function getDirectory() {
        try {
            const handle = await window.showDirectoryPicker();
            // Request read-write permissions right away
            if (await verifyPermission(handle, true)) {
                // Store the handle in indexedDB via the background script for persistence
                chrome.runtime.sendMessage({
                    type: 'SET_DIRECTORY_HANDLE',
                    handle: handle
                }, (response) => {
                    if (response && response.success) {
                        updateStatus(handle, true);
                        alert('Folder selected successfully!');
                    } else {
                        alert('Failed to store folder permission. Error: ' + (response ? response.error : 'Unknown'));
                    }
                });
            } else {
                alert('Permission to write to the selected folder was denied.');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error selecting directory:', error);
                alert('An error occurred while selecting the folder.');
            }
        }
    }

    function updateStatus(handle, hasPermission) {
        if (handle) {
            folderPathSpan.textContent = handle.name;
            if (!hasPermission) {
                statusDiv.style.color = 'orange';
                folderPathSpan.textContent += " (Permission needed. Please re-select)";
            } else {
                statusDiv.style.color = 'green';
            }
        } else {
            folderPathSpan.textContent = "Not selected";
            statusDiv.style.color = 'black';
        }
    }

    // Function to check and display the currently stored directory on load
    async function loadInitialDirectory() {
        chrome.runtime.sendMessage({ type: 'GET_DIRECTORY_HANDLE' }, (response) => {
            if (response && response.success && response.handle) {
                updateStatus(response.handle, response.hasPermission);
            } else {
                updateStatus(null, false);
            }
        });
    }
    
    // Helper function to verify permissions
    async function verifyPermission(handle, readWrite) {
        const options = { mode: readWrite ? 'readwrite' : 'read' };
        if ((await handle.queryPermission(options)) === 'granted') {
            return true;
        }
        if ((await handle.requestPermission(options)) === 'granted') {
            return true;
        }
        return false;
    }

    selectFolderBtn.addEventListener('click', getDirectory);
    
    loadInitialDirectory();
});

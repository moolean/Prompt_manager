document.addEventListener('DOMContentLoaded', () => {
    // Global state
    let promptsData = { prompts: [] };
    let currentPromptId = null;
    let currentVersion = null;

    // Views
    const mainView = document.getElementById('promptList');
    const detailView = document.getElementById('detailView');
    const newPromptView = document.getElementById('newPromptView');

    // Buttons
    const addPromptBtn = document.getElementById('addPromptBtn');
    const saveNewPromptBtn = document.getElementById('saveNewPromptBtn');
    const cancelNewPromptBtn = document.getElementById('cancelNewPromptBtn');
    const saveVersionBtn = document.getElementById('saveVersionBtn');
    const updateCurrentVersionBtn = document.getElementById('updateCurrentVersionBtn');
    const copyPromptBtn = document.getElementById('copyPromptBtn');
    const usePromptBtn = document.getElementById('usePromptBtn');
    const deletePromptBtn = document.getElementById('deletePromptBtn');

    // Detail View Elements
    const promptIdInput = document.getElementById('promptId');
    const promptNameH2 = document.getElementById('promptName');
    const promptTextarea = document.getElementById('promptText');
    const modelInput = document.getElementById('model');
    const outputTextarea = document.getElementById('output');
    const versionHistoryDiv = document.getElementById('versionHistory');

    // New Prompt View Elements
    const newPromptNameInput = document.getElementById('newPromptName');

    // --- Main Logic ---

    function saveAllPrompts() {
        chrome.runtime.sendMessage({ type: 'SAVE_PROMPTS', data: promptsData }, (response) => {
            if (!response.success) {
                alert('Error saving prompts: ' + response.error);
            }
        });
    }

    function renderPromptList() {
        const list = document.getElementById('promptList');
        list.innerHTML = '';
        if (!promptsData.prompts || promptsData.prompts.length === 0) {
            list.innerHTML = '<li>No prompts yet. Add one!</li>';
            return;
        }

        promptsData.prompts.forEach(prompt => {
            const li = document.createElement('li');
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'prompt-name';
            nameSpan.textContent = prompt.name;
            nameSpan.addEventListener('click', () => showDetailView(prompt.id));
            
            li.appendChild(nameSpan);
            list.appendChild(li);
        });
    }

    function loadPrompts() {
        chrome.runtime.sendMessage({ type: 'GET_PROMPTS' }, (response) => {
            if (response.success) {
                promptsData = response.data;
                // Ensure data structure is sound
                if (!promptsData.prompts) {
                    promptsData.prompts = [];
                }
                renderPromptList();
            } else {
                // If directory is not selected, guide the user.
                document.body.innerHTML = `
                    <p>Storage folder not selected.</p>
                    <p>Please <a href="options.html" target="_blank">go to settings</a> to select a folder.</p>
                `;
            }
        });
    }

    // --- View Management ---

    function showMainView() {
        mainView.style.display = 'block';
        addPromptBtn.style.display = 'block';
        detailView.style.display = 'none';
        newPromptView.style.display = 'none';
        currentPromptId = null;
        currentVersion = null;
        renderPromptList();
    }

    function showDetailView(promptId) {
        currentPromptId = promptId;
        const prompt = promptsData.prompts.find(p => p.id === promptId);
        if (!prompt) return;

        mainView.style.display = 'none';
        addPromptBtn.style.display = 'none';
        newPromptView.style.display = 'none';
        detailView.style.display = 'block';

        promptIdInput.value = prompt.id;
        promptNameH2.textContent = prompt.name;

        // Load the latest version
        const latestVersion = prompt.versions.find(v => v.version === prompt.currentVersion);
        displayVersion(latestVersion);
        renderVersionHistory(prompt);
    }
    
    function showNewPromptView() {
        mainView.style.display = 'none';
        addPromptBtn.style.display = 'none';
        detailView.style.display = 'none';
        newPromptView.style.display = 'block';
        newPromptNameInput.value = '';
    }

    function displayVersion(version) {
        if (!version) {
            promptTextarea.value = '';
            modelInput.value = '';
            outputTextarea.value = '';
            currentVersion = null;
            return;
        }
        currentVersion = version.version;
        promptTextarea.value = version.promptText;
        modelInput.value = version.model || '';
        outputTextarea.value = version.output || '';
    }

    function renderVersionHistory(prompt) {
        versionHistoryDiv.innerHTML = '';
        prompt.versions.slice().reverse().forEach(v => {
            const versionDiv = document.createElement('div');
            versionDiv.className = 'version';
            versionDiv.textContent = `Version ${v.version} (${v.model || 'N/A'})`;
            if (v.version === prompt.currentVersion) {
                versionDiv.style.fontWeight = 'bold';
            }
            versionDiv.addEventListener('click', () => displayVersion(v));
            versionHistoryDiv.appendChild(versionDiv);
        });
    }


    // --- Event Handlers ---

    addPromptBtn.addEventListener('click', showNewPromptView);
    cancelNewPromptBtn.addEventListener('click', showMainView);

    saveNewPromptBtn.addEventListener('click', () => {
        const name = newPromptNameInput.value.trim();
        if (!name) {
            alert('Prompt name cannot be empty.');
            return;
        }
        const newPrompt = {
            id: `prompt_${Date.now()}`,
            name: name,
            currentVersion: 1,
            versions: [{
                version: 1,
                promptText: `This is the first version of '${name}'.`,
                model: '',
                output: ''
            }]
        };
        promptsData.prompts.push(newPrompt);
        saveAllPrompts();
        showDetailView(newPrompt.id);
    });

    deletePromptBtn.addEventListener('click', () => {
        if (!currentPromptId || !confirm('Are you sure you want to delete this entire prompt and all its versions?')) return;
        
        promptsData.prompts = promptsData.prompts.filter(p => p.id !== currentPromptId);
        saveAllPrompts();
        showMainView();
    });

    saveVersionBtn.addEventListener('click', () => {
        const prompt = promptsData.prompts.find(p => p.id === currentPromptId);
        if (!prompt) return;

        const newVersionNumber = prompt.currentVersion + 1;
        const newVersion = {
            version: newVersionNumber,
            promptText: promptTextarea.value,
            model: modelInput.value,
            output: outputTextarea.value
        };
        prompt.versions.push(newVersion);
        prompt.currentVersion = newVersionNumber;
        
        saveAllPrompts();
        showDetailView(prompt.id); // Refresh view
        alert(`Version ${newVersionNumber} saved!`);
    });
    
    updateCurrentVersionBtn.addEventListener('click', () => {
        const prompt = promptsData.prompts.find(p => p.id === currentPromptId);
        if (!prompt) return;
        
        const versionToUpdate = prompt.versions.find(v => v.version === currentVersion);
        if (!versionToUpdate) return;

        versionToUpdate.promptText = promptTextarea.value;
        versionToUpdate.model = modelInput.value;
        versionToUpdate.output = outputTextarea.value;

        saveAllPrompts();
        renderVersionHistory(prompt); // Refresh history highlights
        alert(`Version ${currentVersion} updated!`);
    });

    copyPromptBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(promptTextarea.value).then(() => {
            alert('Prompt copied to clipboard!');
        }).catch(err => {
            alert('Failed to copy prompt.');
        });
    });

    usePromptBtn.addEventListener('click', () => {
        const text = promptTextarea.value;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'INJECT_PROMPT',
                    text: text
                });
                window.close(); // Close popup after use
            }
        });
    });

    // --- Initial Load ---
    loadPrompts();
});

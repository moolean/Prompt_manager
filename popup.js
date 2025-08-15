document.addEventListener('DOMContentLoaded', () => {
    // --- Global State & Elements ---
    let promptsData = { prompts: [] };
    let currentPromptId = null;
    let currentVersion = null;
    // ... (get all elements)
    const mainView = document.getElementById('mainView'), detailView = document.getElementById('detailView'), newPromptView = document.getElementById('newPromptView');
    const addPromptBtn = document.getElementById('addPromptBtn'), saveNewPromptBtn = document.getElementById('saveNewPromptBtn'), cancelNewPromptBtn = document.getElementById('cancelNewPromptBtn');
    const saveVersionBtn = document.getElementById('saveVersionBtn'), updateCurrentVersionBtn = document.getElementById('updateCurrentVersionBtn'), copyPromptBtn = document.getElementById('copyPromptBtn'), deletePromptBtn = document.getElementById('deletePromptBtn');
    const importBtn = document.getElementById('importBtn'), exportBtn = document.getElementById('exportBtn'), importFileInput = document.getElementById('importFile');
    const promptNameH2 = document.getElementById('promptName'), promptTextarea = document.getElementById('promptText'), modelInput = document.getElementById('model'), modelDatalist = document.getElementById('model-list');
    const outputTextarea = document.getElementById('output'), versionHistoryDiv = document.getElementById('versionHistory'), newPromptNameInput = document.getElementById('newPromptName');
    const renameModal = document.getElementById('renameModal'), renameInput = document.getElementById('renameInput'), confirmRenameBtn = document.getElementById('confirmRenameBtn'), cancelRenameBtn = document.getElementById('cancelRenameBtn');
    let promptToRename = null;

    // --- Helper Functions ---
    function showTemporaryFeedback(element, message, duration = 1500) {
        const originalText = element.textContent;
        element.textContent = message;
        element.disabled = true;
        setTimeout(() => {
            element.textContent = originalText;
            element.disabled = false;
        }, duration);
    }

    // --- Data & Comms ---
    function saveAllPrompts(tellBackground = true) {
        chrome.runtime.sendMessage({ type: 'SAVE_PROMPTS', data: promptsData }, (response) => {
            if (!response || !response.success) console.error('Error saving prompts:', response ? response.error : 'Unknown');
            if (tellBackground) chrome.runtime.sendMessage({ type: 'UPDATE_CONTEXT_MENU' });
        });
    }

    function loadPrompts() {
        chrome.runtime.sendMessage({ type: 'GET_PROMPTS' }, (response) => {
            if (response && response.success) {
                promptsData = response.data || { prompts: [] };
                showMainView();
                updateModelDatalist();
            } else {
                console.error('Could not load prompts:', response ? response.error : 'Unknown');
            }
        });
    }

    // --- UI Rendering ---
    function renderPromptList() {
        const list = document.getElementById('promptList');
        list.innerHTML = !promptsData.prompts?.length ? '<li>No prompts yet. Add one or import a file!</li>' : '';
        if (!promptsData.prompts?.length) return;

        promptsData.prompts.forEach(prompt => {
            const li = document.createElement('li');
            const nameSpan = document.createElement('span');
            nameSpan.className = 'prompt-name';
            nameSpan.textContent = prompt.name;
            nameSpan.addEventListener('click', () => showDetailView(prompt.id));
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'prompt-actions';

            const renameBtn = document.createElement('button');
            renameBtn.textContent = 'Rename';
            renameBtn.className = 'secondary';
            renameBtn.addEventListener('click', (e) => { e.stopPropagation(); showRenameModal(prompt); });

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy';
            copyBtn.className = 'secondary';
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const latestVersion = prompt.versions.find(v => v.version === prompt.currentVersion);
                if (latestVersion) {
                    navigator.clipboard.writeText(latestVersion.promptText);
                    showTemporaryFeedback(copyBtn, 'Copied!');
                }
            });

            actionsDiv.appendChild(renameBtn);
            actionsDiv.appendChild(copyBtn);
            li.appendChild(nameSpan);
            li.appendChild(actionsDiv);
            list.appendChild(li);
        });
    }

    function updateModelDatalist() {
        const uniqueModels = new Set(promptsData.prompts.flatMap(p => p.versions.map(v => v.model).filter(Boolean)));
        modelDatalist.innerHTML = '';
        uniqueModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            modelDatalist.appendChild(option);
        });
    }

    // --- View Management & Display ---
    function showMainView() { mainView.style.display = 'block'; detailView.style.display = 'none'; newPromptView.style.display = 'none'; renderPromptList(); }
    function showDetailView(promptId) {
        currentPromptId = promptId;
        const prompt = promptsData.prompts.find(p => p.id === promptId);
        if (!prompt) return;
        mainView.style.display = 'none'; detailView.style.display = 'block';
        promptNameH2.textContent = prompt.name;
        const latestVersion = prompt.versions.find(v => v.version === prompt.currentVersion);
        displayVersion(latestVersion);
        renderVersionHistory(prompt);
    }
    function showNewPromptView() { mainView.style.display = 'none'; newPromptView.style.display = 'block'; newPromptNameInput.value = ''; newPromptNameInput.focus(); }
    function displayVersion(version) {
        versionHistoryDiv.querySelectorAll('.version').forEach(div => div.classList.remove('active'));
        if (!version) { promptTextarea.value = ''; modelInput.value = ''; outputTextarea.value = ''; currentVersion = null; return; }
        const activeDiv = versionHistoryDiv.querySelector(`[data-version-id="${version.version}"]`);
        if (activeDiv) activeDiv.classList.add('active');
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
            versionDiv.dataset.versionId = v.version;
            versionDiv.textContent = `Version ${v.version} (${v.model || 'N/A'})`;
            versionDiv.addEventListener('click', () => displayVersion(v));
            versionHistoryDiv.appendChild(versionDiv);
        });
    }

    // --- Event Handlers ---
    addPromptBtn.addEventListener('click', showNewPromptView);
    cancelNewPromptBtn.addEventListener('click', showMainView);
    saveNewPromptBtn.addEventListener('click', () => {
        const name = newPromptNameInput.value.trim();
        if (!name) return;
        const newPrompt = { id: `prompt_${Date.now()}`, name: name, currentVersion: 1, versions: [{ version: 1, promptText: `New prompt: '${name}'`, model: '', output: '' }] };
        promptsData.prompts.push(newPrompt);
        saveAllPrompts();
        showDetailView(newPrompt.id);
    });
    deletePromptBtn.addEventListener('click', () => {
        if (!currentPromptId || !confirm('Delete this prompt and all its versions?')) return;
        promptsData.prompts = promptsData.prompts.filter(p => p.id !== currentPromptId);
        saveAllPrompts();
        showMainView();
    });
    saveVersionBtn.addEventListener('click', (e) => {
        const prompt = promptsData.prompts.find(p => p.id === currentPromptId);
        if (!prompt) return;
        const newVersion = { version: (prompt.currentVersion || 0) + 1, promptText: promptTextarea.value, model: modelInput.value.trim(), output: outputTextarea.value };
        prompt.versions.push(newVersion);
        prompt.currentVersion = newVersion.version;
        saveAllPrompts();
        updateModelDatalist();
        showDetailView(prompt.id);
        showTemporaryFeedback(e.target, 'Saved!');
    });
    updateCurrentVersionBtn.addEventListener('click', (e) => {
        const prompt = promptsData.prompts.find(p => p.id === currentPromptId);
        if (!prompt) return;
        const versionToUpdate = prompt.versions.find(v => v.version === currentVersion);
        if (!versionToUpdate) return;
        versionToUpdate.promptText = promptTextarea.value;
        versionToUpdate.model = modelInput.value.trim();
        versionToUpdate.output = outputTextarea.value;
        saveAllPrompts();
        updateModelDatalist();
        renderVersionHistory(prompt);
        displayVersion(versionToUpdate);
        showTemporaryFeedback(e.target, 'Updated!');
    });
    copyPromptBtn.addEventListener('click', (e) => {
        navigator.clipboard.writeText(promptTextarea.value);
        showTemporaryFeedback(e.target, 'Copied!');
    });

    // --- Import / Export ---
    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(promptsData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'prompts.json'; a.click();
        URL.revokeObjectURL(url); a.remove();
    });
    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData && Array.isArray(importedData.prompts)) {
                    if (confirm('This will overwrite your current prompts. Are you sure?')) {
                        promptsData = importedData;
                        saveAllPrompts();
                        updateModelDatalist();
                        showMainView();
                    }
                } else { console.error('Invalid import file format.'); }
            } catch (error) { console.error('Error reading file:', error); }
        };
        reader.readAsText(file);
        importFileInput.value = '';
    });

    // --- Modal Logic ---
    function showRenameModal(prompt) { promptToRename = prompt; renameInput.value = prompt.name; renameModal.style.display = 'flex'; renameInput.focus(); renameInput.select(); }
    function hideRenameModal() { renameModal.style.display = 'none'; promptToRename = null; }
    confirmRenameBtn.addEventListener('click', () => {
        if (promptToRename) {
            const newName = renameInput.value.trim();
            if (newName && newName !== promptToRename.name) {
                promptToRename.name = newName;
                saveAllPrompts();
                renderPromptList();
            }
        }
        hideRenameModal();
    });
    cancelRenameBtn.addEventListener('click', hideRenameModal);

    // --- Initial Load ---
    loadPrompts();
});
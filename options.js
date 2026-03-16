// Default settings
const DEFAULT_SETTINGS = {
    scrapeImages: true,
    scrapeAttachments: true,
    scrapeAttachmentPreview: true,
    scrapeAttachmentTitle: true,
    scrapeAttachmentSize: true,
    scrapeReasoning: true,
    loadDelay: 700
};

// DOM Elements
const elements = {
    scrapeImages: document.getElementById('scrapeImages'),
    scrapeAttachments: document.getElementById('scrapeAttachments'),
    scrapeAttachmentPreview: document.getElementById('scrapeAttachmentPreview'),
    scrapeAttachmentTitle: document.getElementById('scrapeAttachmentTitle'),
    scrapeAttachmentSize: document.getElementById('scrapeAttachmentSize'),
    scrapeReasoning: document.getElementById('scrapeReasoning'),
    loadDelay: document.getElementById('loadDelay'),
    attachmentOptions: document.getElementById('attachmentOptions'),
    saveBtn: document.getElementById('saveBtn'),
    resetBtn: document.getElementById('resetBtn'),
    statusMsg: document.getElementById('statusMsg')
};

function sanitizeSettings(raw) {
    const sanitized = { ...DEFAULT_SETTINGS };

    sanitized.scrapeImages = Boolean(raw.scrapeImages);
    sanitized.scrapeAttachments = Boolean(raw.scrapeAttachments);
    sanitized.scrapeAttachmentPreview = Boolean(raw.scrapeAttachmentPreview);
    sanitized.scrapeAttachmentTitle = Boolean(raw.scrapeAttachmentTitle);
    sanitized.scrapeAttachmentSize = Boolean(raw.scrapeAttachmentSize);
    sanitized.scrapeReasoning = Boolean(raw.scrapeReasoning);

    const parsedDelay = Number(raw.loadDelay);
    if (Number.isFinite(parsedDelay) && parsedDelay >= 200 && parsedDelay <= 5000) {
        sanitized.loadDelay = Math.round(parsedDelay);
    }

    return sanitized;
}

// Load settings when page loads
document.addEventListener('DOMContentLoaded', loadSettings);

// Save settings when save button is clicked
elements.saveBtn.addEventListener('click', saveSettings);

// Reset settings when reset button is clicked
elements.resetBtn.addEventListener('click', resetSettings);

// Toggle attachment sub-options visibility
elements.scrapeAttachments.addEventListener('change', toggleAttachmentOptions);

function loadSettings() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
        const safeSettings = sanitizeSettings(settings);

        elements.scrapeImages.checked = safeSettings.scrapeImages;
        elements.scrapeAttachments.checked = safeSettings.scrapeAttachments;
        elements.scrapeAttachmentPreview.checked = safeSettings.scrapeAttachmentPreview;
        elements.scrapeAttachmentTitle.checked = safeSettings.scrapeAttachmentTitle;
        elements.scrapeAttachmentSize.checked = safeSettings.scrapeAttachmentSize;
        elements.scrapeReasoning.checked = safeSettings.scrapeReasoning;
        elements.loadDelay.value = safeSettings.loadDelay;

        toggleAttachmentOptions();
    });
}

function saveSettings() {
    const settings = sanitizeSettings({
        scrapeImages: elements.scrapeImages.checked,
        scrapeAttachments: elements.scrapeAttachments.checked,
        scrapeAttachmentPreview: elements.scrapeAttachmentPreview.checked,
        scrapeAttachmentTitle: elements.scrapeAttachmentTitle.checked,
        scrapeAttachmentSize: elements.scrapeAttachmentSize.checked,
        scrapeReasoning: elements.scrapeReasoning.checked,
        loadDelay: elements.loadDelay.value
    });

    chrome.storage.sync.set(settings, () => {
        showStatus('Settings saved successfully');
    });
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
            loadSettings();
            showStatus('Settings reset to defaults');
        });
    }
}

function toggleAttachmentOptions() {
    const isEnabled = elements.scrapeAttachments.checked;
    const inputs = elements.attachmentOptions.querySelectorAll('input');

    elements.attachmentOptions.style.opacity = isEnabled ? '1' : '0.5';
    elements.attachmentOptions.style.pointerEvents = isEnabled ? 'auto' : 'none';

    inputs.forEach(input => {
        input.disabled = !isEnabled;
    });
}

function showStatus(message) {
    elements.statusMsg.textContent = message;
    elements.statusMsg.classList.add('show');
    setTimeout(() => {
        elements.statusMsg.classList.remove('show');
    }, 3000);
}

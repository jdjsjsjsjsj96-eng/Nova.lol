// Snow animation
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const snowflakes = [];
const snowflakeCount = 100;

for (let i = 0; i < snowflakeCount; i++) {
    snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25
    });
}

function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    
    for (let flake of snowflakes) {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    }
    
    ctx.fill();
    updateSnow();
}

function updateSnow() {
    for (let flake of snowflakes) {
        flake.y += flake.speed;
        flake.x += flake.wind;
        
        if (flake.y > canvas.height) {
            flake.y = 0;
            flake.x = Math.random() * canvas.width;
        }
        
        if (flake.x > canvas.width) {
            flake.x = 0;
        } else if (flake.x < 0) {
            flake.x = canvas.width;
        }
    }
}

setInterval(drawSnow, 50);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Tab switching
const configTab = document.getElementById('configTab');
const panelTab = document.getElementById('panelTab');
const configSection = document.getElementById('configSection');
const panelSection = document.getElementById('panelSection');

configTab.addEventListener('click', () => {
    configTab.classList.add('active');
    panelTab.classList.remove('active');
    configSection.style.display = 'flex';
    panelSection.style.display = 'none';
});

panelTab.addEventListener('click', () => {
    panelTab.classList.add('active');
    configTab.classList.remove('active');
    configSection.style.display = 'none';
    panelSection.style.display = 'block';
});

// Load configs from localStorage or use defaults
let configs = {};
const savedConfigs = localStorage.getItem('novaConfigs');
if (savedConfigs) {
    try {
        configs = JSON.parse(savedConfigs);
    } catch (e) {
        configs = getDefaultConfigs();
    }
} else {
    configs = getDefaultConfigs();
}

function getDefaultConfigs() {
    return {
        rage: `shared.Nova = {
    -- Silent Aim Settings
    ['silent aim'] = {
        ['enabled'] = true,
        ['key'] = 'C',
        ['mode'] = 'Toggle',
        ['targeting_mode'] = 'Target',
        ['aim_part'] = 'Head',
        ['knocked_check'] = true,
        ['visible_check'] = false,
        ['knife_check'] = true,
        ['use_fov'] = true,
        ['fov'] = 100,
        ['sticky_aim'] = false,
    },
    
    -- Target Tracer Settings
    ['target tracer'] = {
        ['enabled'] = true,
        ['color'] = Color3.fromRGB(255, 0, 0),
    },
    
    -- ESP Settings
    ['esp'] = {
        ['enabled'] = true,
        ['color'] = Color3.fromRGB(255, 255, 255),
        ['target_color'] = Color3.fromRGB(255, 0, 0),
    },
    
    -- Walkspeed Settings
    ['walkspeed'] = {
        ['enabled'] = false,
        ['speed'] = 23,
        ['key'] = 'Z',
    },
    
    -- Rapid Fire Settings
    ['rapid fire'] = {
        ['enabled'] = false,
    },
    
    -- Spread Modifications
    ['spread modifications'] = {
        ['enabled'] = true,
        ['amount'] = 1,
        ['specific weapons'] = {
            ['enabled'] = false,
            ['weapons'] = {
                '[Double-Barrel SG]',
                '[TacticalShotgun]',
            },
        },
    },
}`,
        legit: `shared.Nova = {
    -- Silent Aim Settings
    ['silent aim'] = {
        ['enabled'] = true,
        ['key'] = 'C',
        ['mode'] = 'Hold',
        ['targeting_mode'] = 'Auto',
        ['aim_part'] = 'UpperTorso',
        ['knocked_check'] = true,
        ['visible_check'] = true,
        ['knife_check'] = true,
        ['use_fov'] = true,
        ['fov'] = 50,
        ['sticky_aim'] = true,
    },
    
    -- Target Tracer Settings
    ['target tracer'] = {
        ['enabled'] = false,
        ['color'] = Color3.fromRGB(255, 255, 255),
    },
    
    -- ESP Settings
    ['esp'] = {
        ['enabled'] = true,
        ['color'] = Color3.fromRGB(255, 255, 255),
        ['target_color'] = Color3.fromRGB(0, 255, 0),
    },
    
    -- Walkspeed Settings
    ['walkspeed'] = {
        ['enabled'] = false,
        ['speed'] = 20,
        ['key'] = 'Z',
    },
    
    -- Rapid Fire Settings
    ['rapid fire'] = {
        ['enabled'] = false,
    },
    
    -- Spread Modifications
    ['spread modifications'] = {
        ['enabled'] = false,
        ['amount'] = 50,
    },
}`
    };
}

function saveConfigsToStorage() {
    try {
        localStorage.setItem('novaConfigs', JSON.stringify(configs));
    } catch (e) {
        console.error('Failed to save configs:', e);
    }
}

let currentConfig = 'rage';
let selectedConfig = null;

const codeEditor = document.getElementById('codeEditor');
const lineNumbers = document.getElementById('lineNumbers');
const configList = document.getElementById('configList');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');
const selectBtn = document.getElementById('selectBtn');
const downloadBtn = document.getElementById('downloadBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const addConfigBtn = document.getElementById('addConfigBtn');
const newConfigName = document.getElementById('newConfigName');

function loadConfig(configName) {
    currentConfig = configName;
    codeEditor.value = configs[configName] || '';
    updateLineNumbers();
    
    document.querySelectorAll('.config-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.config === configName) {
            item.classList.add('active');
        }
    });
}

function updateLineNumbers() {
    const lines = codeEditor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('\n');
}

function rebuildConfigList() {
    configList.innerHTML = '';
    const configNames = Object.keys(configs);
    
    configNames.forEach(configName => {
        const newItem = document.createElement('div');
        newItem.className = 'config-item';
        if (configName === currentConfig) {
            newItem.classList.add('active');
        }
        newItem.dataset.config = configName;
        newItem.innerHTML = `
            <div class="config-info">
                <span>${configName}</span>
            </div>
            <button class="delete-btn" data-config="${configName}">🗑</button>
        `;
        configList.appendChild(newItem);
    });
    
    updateConfigCounter();
}

codeEditor.addEventListener('input', updateLineNumbers);
codeEditor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = codeEditor.scrollTop;
});

resetBtn.addEventListener('click', () => {
    if (confirm('Reset config to default?')) {
        const defaults = getDefaultConfigs();
        if (defaults[currentConfig]) {
            configs[currentConfig] = defaults[currentConfig];
            loadConfig(currentConfig);
            saveConfigsToStorage();
        }
    }
});

saveBtn.addEventListener('click', () => {
    configs[currentConfig] = codeEditor.value;
    saveConfigsToStorage();
    
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '✓ SAVED';
    saveBtn.style.background = '#2d5016';
    
    setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.style.background = '';
    }, 2000);
});

selectBtn.addEventListener('click', () => {
    selectedConfig = currentConfig;
    localStorage.setItem('novaSelectedConfig', currentConfig);
    
    const originalText = selectBtn.innerHTML;
    selectBtn.innerHTML = '<span class="icon">✓</span> SELECTED';
    selectBtn.style.background = '#2d5016';
    
    setTimeout(() => {
        selectBtn.innerHTML = originalText;
        selectBtn.style.background = '';
    }, 2000);
});

downloadBtn.addEventListener('click', () => {
    const configContent = codeEditor.value;
    const blob = new Blob([configContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentConfig}.lua`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            codeEditor.value = event.target.result;
            updateLineNumbers();
        };
        reader.readAsText(file);
    }
    fileInput.value = '';
});

configList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        e.stopPropagation();
        const configName = e.target.dataset.config;
        
        if (confirm(`Delete config "${configName}"?`)) {
            if (Object.keys(configs).length <= 1) {
                alert('Cannot delete the last config!');
                return;
            }
            
            if (configName === currentConfig) {
                alert('Cannot delete the currently active config! Switch to another config first.');
                return;
            }
            
            delete configs[configName];
            saveConfigsToStorage();
            rebuildConfigList();
        }
        return;
    }
    
    const configItem = e.target.closest('.config-item');
    if (configItem) {
        loadConfig(configItem.dataset.config);
    }
});

addConfigBtn.addEventListener('click', () => {
    const name = newConfigName.value.trim();
    if (name) {
        if (configs[name]) {
            alert('Config with this name already exists!');
            return;
        }
        
        configs[name] = '-- New config\nshared.Nova = {}';
        saveConfigsToStorage();
        rebuildConfigList();
        
        newConfigName.value = '';
        loadConfig(name);
    }
});

function updateConfigCounter() {
    const count = Object.keys(configs).length;
    document.querySelector('.config-count').textContent = `${count}/10`;
}

// Initialize
rebuildConfigList();
loadConfig(currentConfig);

codeEditor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        codeEditor.value = codeEditor.value.substring(0, start) + '    ' + codeEditor.value.substring(end);
        codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
        updateLineNumbers();
    }
});

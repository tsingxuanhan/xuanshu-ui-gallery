/**
 * ========================================
 * Materials Research AI Workstation
 * 公共函数库 (v2.0)
 * Ctrl+K搜索 | SVG图标 | API集成 | 拖拽布局
 * ========================================
 */

// ========== 全局变量 ==========
let CONFIG = null;
let services = [];
let pages = [];
let commands = {};
let searchIndex = [];
let refreshInterval = null;
let draggedCard = null;

// ========== SVG图标映射 ==========
const ICONS = {
    webui: `<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    openclaw: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12l2 2 4-4"/></svg>`,
    ollama: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    jupyter: `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9l3 3-3 3"/><line x1="14" y1="15" x2="18" y2="15"/></svg>`,
    portainer: `<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    comfyui: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
    drawio: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
    pdf: `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    zotero: `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    model: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
    monitor: `<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    command: `<svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    comm: `<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    knowledge: `<svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    config: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    sun: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    terminal: `<svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    link: `<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    reset: `<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
    agent: `<svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>`,
    docker: `<svg viewBox="0 0 24 24"><path d="M22 12.5c-.5-1-2-1.5-3.5-1.5h-.5v-1c0-1-.5-1.5-1-2l.5-1c.5 0 1-.5 1-1V5c-1 0-2 .5-3 .5l-1-1c-.5-1-2-1.5-3.5-1.5s-3 .5-3.5 1.5L3 4.5C2 4.5 1 5 1 6v3c0 1 .5 1.5 1 2l-.5 1c0 .5-.5 1-1 1v1c0 1 .5 2 1 2l1.5.5c.5 1 2 1.5 3.5 1.5s3-.5 3.5-1.5l1.5-1c.5 0 1-.5 1-1V10c0-1 .5-1.5 1-2l-.5-1c-.5 0-1-.5-1-1V4c1 0 2 .5 3 .5l1 1c.5 1 2 1.5 3.5 1.5s3-.5 3.5-1.5l1.5-1c.5 0 1-.5 1-1V6c-1 0-2 .5-3 .5l-1-1c-.5-1-2-1.5-3.5-1.5s-3 .5-3.5 1.5L9 7c-.5 0-1 .5-1 1v2c0 1-.5 1.5-1 2l.5 1c0 .5-.5 1-1 1v1c0 1 .5 2 1 2l1.5.5c.5 1 2 1.5 3.5 1.5h.5v.5c0 .5.5 1 1 1l2-.5v-.5c0-.5-.5-1-1-1z"/><circle cx="8" cy="17" r="1"/><circle cx="12" cy="17" r="1"/><circle cx="16" cy="17" r="1"/></svg>`
};

/**
 * 获取SVG图标
 * @param {string} iconName - 图标名称
 * @returns {string} SVG图标HTML
 */
function getIcon(iconName) {
    return ICONS[iconName] || ICONS.config;
}

// ========== 配置加载 ==========
async function loadConfig() {
    try {
        const response = await fetch('js/config.json');
        if (!response.ok) throw new Error('Failed to load config');
        CONFIG = await response.json();
        services = CONFIG.services;
        pages = CONFIG.pages;
        commands = CONFIG.commands;
        
        // 构建搜索索引
        buildSearchIndex();
        
        return CONFIG;
    } catch (error) {
        console.error('Config load error:', error);
        // 使用默认配置
        CONFIG = {
            services: [
                {name: 'Open WebUI', port: 3000, icon: 'webui', url: 'http://127.0.0.1:3000'},
                {name: 'OpenClaw GW', port: 18789, icon: 'openclaw', url: 'http://127.0.0.1:18789'},
                {name: 'Ollama API', port: 11434, icon: 'ollama', url: 'http://127.0.0.1:11434'}
            ],
            settings: { refreshInterval: 5000, vramTotal: 16384 }
        };
        return CONFIG;
    }
}

// ========== 搜索功能 ==========
function buildSearchIndex() {
    searchIndex = [];
    
    // 添加服务
    services.forEach(service => {
        searchIndex.push({
            type: 'service',
            name: service.name,
            subtext: `:${service.port}`,
            icon: service.icon,
            url: service.url,
            keywords: `${service.name} ${service.port} ${service.category}`.toLowerCase()
        });
    });
    
    // 添加页面
    pages.forEach(page => {
        searchIndex.push({
            type: 'page',
            name: page.name,
            subtext: page.file,
            icon: page.icon,
            url: page.file,
            keywords: (page.keywords || []).join(' ').toLowerCase()
        });
    });
    
    // 添加命令
    Object.entries(commands).forEach(([category, cmds]) => {
        cmds.forEach(cmd => {
            searchIndex.push({
                type: 'command',
                name: cmd.cmd,
                subtext: cmd.desc,
                icon: 'terminal',
                command: cmd.cmd,
                keywords: `${cmd.cmd} ${cmd.desc} ${category}`.toLowerCase()
            });
        });
    });
}

function search(query) {
    if (!query || query.length < 1) return [];
    
    const q = query.toLowerCase();
    return searchIndex.filter(item => {
        const matchName = item.name.toLowerCase().includes(q);
        const matchKeywords = item.keywords && item.keywords.includes(q);
        const matchSubtext = item.subtext && item.subtext.toLowerCase().includes(q);
        return matchName || matchKeywords || matchSubtext;
    }).slice(0, 10);
}

function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function executeSearchAction(item) {
    closeSearch();
    
    if (item.type === 'service' || item.type === 'page') {
        window.location.href = item.url;
    } else if (item.type === 'command') {
        navigator.clipboard.writeText(item.command).then(() => {
            showToast(`已复制: ${item.command}`);
        });
    }
}

// ========== 搜索框UI ==========
function initSearch() {
    // 创建搜索框DOM
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <div class="search-input-wrapper">
                <span class="search-icon">${ICONS.search}</span>
                <input type="text" class="search-input" id="searchInput" placeholder="搜索服务、页面、命令..." autocomplete="off">
                <span class="search-shortcut">ESC</span>
            </div>
            <div class="search-results" id="searchResults"></div>
            <div class="search-footer">
                <span><kbd>↑↓</kbd> 导航</span>
                <span><kbd>Enter</kbd> 打开</span>
                <span><kbd>ESC</kbd> 关闭</span>
            </div>
        </div>
    `;
    document.body.appendChild(searchOverlay);
    
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let selectedIndex = -1;
    let currentResults = [];
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
        // Ctrl+K 打开搜索
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
            return;
        }
        
        if (!searchOverlay.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeSearch();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1);
            updateSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection();
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            executeSearchAction(currentResults[selectedIndex]);
        }
    });
    
    // 输入事件
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        currentResults = search(query);
        selectedIndex = -1;
        renderResults(query);
    });
    
    // 点击外部关闭
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });
    
    function renderResults(query) {
        if (currentResults.length === 0) {
            searchResults.innerHTML = '<div class="search-empty">未找到结果</div>';
            return;
        }
        
        // 按类型分组
        const grouped = {
            service: currentResults.filter(r => r.type === 'service'),
            page: currentResults.filter(r => r.type === 'page'),
            command: currentResults.filter(r => r.type === 'command')
        };
        
        let html = '';
        
        if (grouped.service.length > 0) {
            html += `<div class="search-section"><div class="search-section-title">服务</div>`;
            grouped.service.forEach((item, i) => {
                html += createResultItem(item, query, currentResults.indexOf(item));
            });
            html += '</div>';
        }
        
        if (grouped.page.length > 0) {
            html += `<div class="search-section"><div class="search-section-title">页面</div>`;
            grouped.page.forEach(item => {
                html += createResultItem(item, query, currentResults.indexOf(item));
            });
            html += '</div>';
        }
        
        if (grouped.command.length > 0) {
            html += `<div class="search-section"><div class="search-section-title">命令</div>`;
            grouped.command.forEach(item => {
                html += createResultItem(item, query, currentResults.indexOf(item));
            });
            html += '</div>';
        }
        
        searchResults.innerHTML = html;
        
        // 绑定点击事件
        searchResults.querySelectorAll('.search-result-item').forEach((el, i) => {
            el.addEventListener('click', () => {
                executeSearchAction(currentResults[i]);
            });
        });
    }
    
    function createResultItem(item, query, index) {
        const icon = getIcon(item.icon);
        const typeLabel = item.type === 'service' ? '打开' : 
                          item.type === 'page' ? '导航' : '复制';
        return `
            <div class="search-result-item" data-index="${index}">
                <div class="result-icon">${icon}</div>
                <div class="result-info">
                    <div class="result-name">${highlightMatch(item.name, query)}</div>
                    <div class="result-desc">${item.subtext || ''}</div>
                </div>
                <span class="result-action">${typeLabel}</span>
            </div>
        `;
    }
    
    function updateSelection() {
        searchResults.querySelectorAll('.search-result-item').forEach((el, i) => {
            el.classList.toggle('selected', i === selectedIndex);
        });
        
        if (selectedIndex >= 0) {
            const selected = searchResults.querySelectorAll('.search-result-item')[selectedIndex];
            if (selected) selected.scrollIntoView({ block: 'nearest' });
        }
    }
}

function openSearch() {
    const overlay = document.querySelector('.search-overlay');
    const input = document.getElementById('searchInput');
    overlay.classList.add('active');
    input.value = '';
    input.focus();
    renderResults('');
}

function closeSearch() {
    const overlay = document.querySelector('.search-overlay');
    overlay.classList.remove('active');
}

function renderResults(query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (!query) {
        // 显示最近/推荐
        searchResults.innerHTML = `
            <div class="search-section">
                <div class="search-section-title">快速访问</div>
                ${searchIndex.slice(0, 5).map((item, i) => createResultItem(item, '', i)).join('')}
            </div>
        `;
        currentResults = searchIndex.slice(0, 5);
    } else {
        renderSearchResults(query);
    }
    
    // 绑定点击事件
    searchResults.querySelectorAll('.search-result-item').forEach((el, i) => {
        el.addEventListener('click', () => {
            if (currentResults[i]) {
                executeSearchAction(currentResults[i]);
            }
        });
    });
}

let currentResults = [];

function renderSearchResults(query) {
    const searchResults = document.getElementById('searchResults');
    currentResults = search(query);
    
    if (currentResults.length === 0) {
        searchResults.innerHTML = '<div class="search-empty">未找到结果，试试其他关键词</div>';
        return;
    }
    
    const grouped = {
        service: currentResults.filter(r => r.type === 'service'),
        page: currentResults.filter(r => r.type === 'page'),
        command: currentResults.filter(r => r.type === 'command')
    };
    
    let html = '';
    
    if (grouped.service.length > 0) {
        html += `<div class="search-section"><div class="search-section-title">服务</div>`;
        grouped.service.forEach((item) => {
            html += createResultItem(item, query);
        });
        html += '</div>';
    }
    
    if (grouped.page.length > 0) {
        html += `<div class="search-section"><div class="search-section-title">页面</div>`;
        grouped.page.forEach(item => {
            html += createResultItem(item, query);
        });
        html += '</div>';
    }
    
    if (grouped.command.length > 0) {
        html += `<div class="search-section"><div class="search-section-title">命令</div>`;
        grouped.command.forEach(item => {
            html += createResultItem(item, query);
        });
        html += '</div>';
    }
    
    searchResults.innerHTML = html;
}

function createResultItem(item, query) {
    const icon = getIcon(item.icon);
    const typeLabel = item.type === 'service' ? '打开' : 
                      item.type === 'page' ? '导航' : '复制';
    return `
        <div class="search-result-item">
            <div class="result-icon">${icon}</div>
            <div class="result-info">
                <div class="result-name">${highlightMatch(item.name, query)}</div>
                <div class="result-desc">${item.subtext || ''}</div>
            </div>
            <span class="result-action">${typeLabel}</span>
        </div>
    `;
}

// ========== 主题切换 ==========
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // 绑定主题切换按钮
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // 更新按钮图标
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
        btn.title = theme === 'dark' ? '切换亮色主题' : '切换暗色主题';
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// ========== 拖拽布局 ==========
function initDragAndDrop() {
    const grid = document.querySelector('.cards-grid');
    if (!grid) return;
    
    const cards = grid.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragleave', handleDragLeave);
    });
    
    // 恢复保存的布局
    restoreLayout();
    
    // 重置布局按钮
    document.querySelectorAll('.reset-layout-btn').forEach(btn => {
        btn.addEventListener('click', resetLayout);
    });
}

function handleDragStart(e) {
    draggedCard = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedCard = null;
    
    // 保存布局
    saveLayout();
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (this !== draggedCard) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedCard && this !== draggedCard) {
        const grid = document.querySelector('.cards-grid');
        const allCards = [...grid.querySelectorAll('.service-card')];
        const draggedIndex = allCards.indexOf(draggedCard);
        const targetIndex = allCards.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            grid.insertBefore(draggedCard, this.nextSibling);
        } else {
            grid.insertBefore(draggedCard, this);
        }
    }
}

function saveLayout() {
    const grid = document.querySelector('.cards-grid');
    if (!grid) return;
    
    const order = [...grid.querySelectorAll('.service-card')].map(card => {
        return card.getAttribute('data-service') || card.querySelector('.card-title')?.textContent;
    });
    
    localStorage.setItem('cardLayout', JSON.stringify(order));
}

function restoreLayout() {
    const savedOrder = localStorage.getItem('cardLayout');
    if (!savedOrder) return;
    
    try {
        const order = JSON.parse(savedOrder);
        const grid = document.querySelector('.cards-grid');
        if (!grid) return;
        
        const cards = grid.querySelectorAll('.service-card');
        const cardMap = {};
        
        cards.forEach(card => {
            const name = card.getAttribute('data-service') || card.querySelector('.card-title')?.textContent;
            cardMap[name] = card;
        });
        
        order.forEach(name => {
            if (cardMap[name]) {
                grid.appendChild(cardMap[name]);
            }
        });
    } catch (e) {
        console.error('Failed to restore layout:', e);
    }
}

function resetLayout() {
    localStorage.removeItem('cardLayout');
    
    // 按默认顺序重新排列
    if (CONFIG && CONFIG.services) {
        const grid = document.querySelector('.cards-grid');
        if (!grid) return;
        
        CONFIG.services.forEach(service => {
            const card = grid.querySelector(`[data-service="${service.name}"]`);
            if (card) {
                grid.appendChild(card);
            }
        });
    }
    
    showToast('布局已重置');
}

// ========== 服务状态检测 ==========
function checkServiceStatus(host, port, callback) {
    const startTime = performance.now();
    const url = `http://${host}:${port}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    fetch(url, {
        method: 'HEAD',
        mode: 'no-cors'
    })
    .then(() => {
        clearTimeout(timeoutId);
        const latency = Math.round(performance.now() - startTime);
        callback({ online: true, latency: latency });
    })
    .catch(() => {
        clearTimeout(timeoutId);
        callback({ online: false, latency: 0 });
    });
}

function updateServiceCard(card, status) {
    const indicator = card.querySelector('.status-indicator');
    const latency = card.querySelector('.card-latency');
    
    if (indicator) {
        indicator.classList.remove('online', 'offline', 'loading');
        indicator.classList.add(status.online ? 'online' : 'offline');
    }
    
    if (latency) {
        latency.classList.remove('online', 'offline');
        if (status.online) {
            latency.classList.add('online');
            latency.textContent = `${status.latency}ms`;
        } else {
            latency.classList.add('offline');
            latency.textContent = '离线';
        }
    }
}

function startAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    const interval = CONFIG?.settings?.refreshInterval || 5000;
    
    // 立即检测一次
    refreshAllServices();
    
    // 定时刷新
    refreshInterval = setInterval(refreshAllServices, interval);
}

function refreshAllServices() {
    if (!CONFIG || !CONFIG.services) return;
    
    CONFIG.services.forEach(service => {
        const card = document.querySelector(`[data-service="${service.name}"]`);
        if (!card) return;
        
        // 添加loading状态
        const indicator = card.querySelector('.status-indicator');
        if (indicator) {
            indicator.classList.add('loading');
        }
        
        checkServiceStatus('127.0.0.1', service.port, (status) => {
            updateServiceCard(card, status);
        });
    });
    
    // 刷新状态栏
    refreshStatusBar();
}

function refreshStatusBar() {
    // Docker
    checkServiceStatus('127.0.0.1', 9000, (result) => {
        updateStatusIndicator('docker-status', result.online);
    });
    
    // Ollama
    checkServiceStatus('127.0.0.1', 11434, (result) => {
        updateStatusIndicator('ollama-status', result.online);
    });
    
    // GPU和VRAM使用模拟值
    updateStatusIndicator('gpu-status', true);
    updateStatusIndicator('vram-status', true);
}

// ========== Ollama API集成 ==========
async function fetchOllamaModels() {
    try {
        const response = await fetch('http://127.0.0.1:11434/api/tags', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('API not available');
        
        const data = await response.json();
        return data.models || [];
    } catch (error) {
        console.warn('Ollama API unavailable:', error);
        return null;
    }
}

async function fetchOllamaRunning() {
    try {
        const response = await fetch('http://127.0.0.1:11434/api/ps', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('API not available');
        
        const data = await response.json();
        return data.models || [];
    } catch (error) {
        console.warn('Ollama running models API unavailable:', error);
        return null;
    }
}

async function updateModelsCount() {
    const models = await fetchOllamaModels();
    const running = await fetchOllamaRunning();
    
    // 更新服务卡片上的模型数量
    const ollamaCard = document.querySelector('[data-service="Ollama API"]');
    if (ollamaCard) {
        const modelsEl = ollamaCard.querySelector('.card-models');
        if (modelsEl) {
            if (models) {
                modelsEl.textContent = `${models.length} models installed`;
            } else {
                modelsEl.textContent = 'API unavailable';
            }
        }
    }
    
    return { models, running };
}

// ========== Docker API集成 ==========
async function fetchDockerContainers() {
    try {
        // 尝试通过Portainer API
        const response = await fetch('http://127.0.0.1:9000/api/endpoints/1/docker/containers/json?all=true', {
            method: 'GET'
        });
        
        if (!response.ok) throw new Error('Docker API not available');
        
        const containers = await response.json();
        return containers.map(c => ({
            name: c.Names[0]?.replace(/^\//, '') || 'unknown',
            status: c.State,
            image: c.Image,
            created: new Date(c.Created * 1000).toLocaleDateString()
        }));
    } catch (error) {
        console.warn('Docker API unavailable:', error);
        return null;
    }
}

// ========== OpenClaw Gateway API ==========
async function fetchGatewayAgents() {
    try {
        // 尝试OpenClaw Gateway API
        const response = await fetch('http://127.0.0.1:18789/api/sessions', {
            method: 'GET'
        });
        
        if (!response.ok) throw new Error('Gateway API not available');
        
        const data = await response.json();
        return data.sessions || [];
    } catch (error) {
        console.warn('Gateway API unavailable:', error);
        return null;
    }
}

// ========== 通用工具函数 ==========
function updateStatusIndicator(id, online) {
    const indicator = document.getElementById(id);
    if (indicator) {
        indicator.classList.remove('online', 'offline', 'loading');
        indicator.classList.add(online ? 'online' : 'offline');
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('已复制到剪贴板');
        } catch (err) {
            showToast('复制失败', 'error');
        }
        document.body.removeChild(textarea);
    });
}

function navigateTo(page) {
    window.location.href = page;
}

function highlightNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-card').forEach(card => {
        const href = card.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            card.style.borderColor = 'var(--accent)';
            card.style.background = 'var(--bg-secondary)';
        }
    });
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function initStatusChecks() {
    const statusBar = document.getElementById('statusBar');
    if (!statusBar) return;
    
    checkServiceStatus('127.0.0.1', 9000, (result) => {
        updateStatusIndicator('docker-status', result.online);
    });
    
    checkServiceStatus('127.0.0.1', 11434, (result) => {
        updateStatusIndicator('ollama-status', result.online);
    });
    
    setTimeout(() => {
        updateStatusIndicator('gpu-status', true);
    }, 500);
    
    setTimeout(() => {
        updateStatusIndicator('vram-status', true);
    }, 500);
}

// ========== 生成服务卡片 ==========
function generateServiceCard(service) {
    return `
        <div class="service-card" data-service="${service.name}" draggable="true">
            <div class="card-header">
                <span class="card-icon">${getIcon(service.icon)}</span>
                <div class="card-status">
                    <div class="status-indicator loading"></div>
                </div>
            </div>
            <h3 class="card-title">${service.name}</h3>
            <p class="card-port">:${service.port}</p>
            <p class="card-latency offline">检测中...</p>
            ${service.category === 'ai' ? '<p class="card-models">-</p>' : ''}
            <a href="${service.url}" target="_blank" class="card-btn">
                打开 <span>→</span>
            </a>
        </div>
    `;
}

function renderServices(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container || !CONFIG) return;
    
    container.innerHTML = services.map(service => generateServiceCard(service)).join('');
    
    // 初始化拖拽
    initDragAndDrop();
    
    // 启动自动刷新
    startAutoRefresh();
    
    // 更新模型数量
    updateModelsCount();
}

// ========== 初始化 ==========
async function init() {
    // 加载配置
    await loadConfig();
    
    // 初始化主题
    initTheme();
    
    // 初始化搜索
    initSearch();
    
    // 初始化状态检查
    initStatusChecks();
    
    // 高亮导航
    highlightNav();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

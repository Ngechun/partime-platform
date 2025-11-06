/**
 * 网站数据加载、卡片生成及搜索筛选逻辑 (script.js)
 */

// ⚠️⚠️ 步骤 1: 替换您的 Google Sheets CSV 链接 ⚠️⚠️
// 您的链接似乎是正确的，但请再次确认您粘贴到这里的链接是您最新发布的 CSV 链接。
const DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQg5XACeP4fxy0ZY6fASBb6QJeiv9MFVL3GPzryhok_roTGzo4xlZclsiVDNkoRp3TNlZK8nXEo_jbL/pub?output=csv';
// ----------------------------------------------------

// ----------------------------------------------------
// 1. 获取重要元素 (现在被移到 DOMContentLoaded 内部)
// ----------------------------------------------------
let searchInput; 
let servicesContainer; 
let servicesData = []; 

// ----------------------------------------------------
// 2. 核心函数：生成单个服务卡片的 HTML 结构
// ----------------------------------------------------
function createCardHtml(service) {
    // service.id 是我们现在需要使用的唯一标识符
    const detailUrl = `detail.html?id=${service.id}`;
    
    return `
        <div class="service-card">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <a href="${detailUrl}" class="btn">查看服务人员</a>
        </div>
    `;
}

// ----------------------------------------------------
// 3. 渲染函数：根据当前数据和搜索词，更新页面内容
// ----------------------------------------------------
function renderServices() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let htmlContent = '';
    
    servicesData.forEach(service => {
        const cardText = (service.title + ' ' + service.description).toLowerCase();
        
        if (searchTerm === '' || cardText.includes(searchTerm)) {
            htmlContent += createCardHtml(service);
        }
    });

    servicesContainer.innerHTML = htmlContent;
    
    if (htmlContent === '' && servicesData.length > 0) {
        servicesContainer.innerHTML = '<p style="grid-column: 1 / -1; font-size: 1.5em; text-align: center; color: #cc5500;">抱歉，没有找到匹配的服务。请尝试其他关键字。</p>';
    }
}

// ----------------------------------------------------
// 4. 数据加载函数：从 Google Sheets 读取 CSV 数据
// ----------------------------------------------------
async function loadServices() {
    try {
        // 在加载数据前显示加载提示
        servicesContainer.innerHTML = '<p style="grid-column: 1 / -1; font-size: 1.2em; text-align: center;">正在加载服务列表...</p>';

        const response = await fetch(DATA_URL);
        if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        
        servicesData = parseCSV(csvText); 
        
        renderServices();
        
        searchInput.addEventListener('input', renderServices);

    } catch (error) {
        console.error('Error loading service data:', error);
        // 如果加载失败，显示错误提示
        servicesContainer.innerHTML = '<p style="grid-column: 1 / -1; font-size: 1.2em; text-align: center; color: red;">抱歉，服务数据加载失败，请检查您的网络和 Google Sheets 链接。</p>';
    }
}

// ----------------------------------------------------
// 5. CSV 解析辅助函数
// ----------------------------------------------------
function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    const result = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const service = {};
        
        if (values.length === headers.length) {
            for (let j = 0; j < headers.length; j++) {
                service[headers[j]] = (values[j] || '').trim().replace(/\r/g, ''); 
            }
        }
        
        if (service.title) {
            result.push(service);
        }
    }
    return result;
}

// ----------------------------------------------------
// 6. 网站启动！(保证DOM元素加载完毕)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // 只有在 DOM 加载完毕后，我们才能安全地获取元素
    searchInput = document.getElementById('service-search'); 
    servicesContainer = document.getElementById('services-container'); 
    
    if (servicesContainer) {
        loadServices();
    } else {
        console.error("Critical Error: 'services-container' element not found in index.html");
    }
});

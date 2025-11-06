/**
 * 网站数据加载、卡片生成及搜索筛选逻辑 (script.js)
 */

// ⚠️⚠️ 步骤 1: 替换您的 Google Sheets CSV 链接 ⚠️⚠️
// 请将 'YOUR_GOOGLE_SHEETS_CSV_LINK' 替换为您在 Google Sheets 中发布的 CSV 链接！
const DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQg5XACeP4fxy0ZY6fASBb6QJeiv9MFVL3GPzryhok_roTGzo4xlZclsiVDNkoRp3TNlZK8nXEo_jbL/pub?output=csv';
// ----------------------------------------------------
// 1. 获取重要元素
// ----------------------------------------------------
const searchInput = document.getElementById('service-search'); 
// 获取我们新设置的空盒子，所有卡片都会被放入这里
const servicesContainer = document.getElementById('services-container'); 

// 用于存储从 Google Sheets 加载的服务数据 (一个全局数组)
let servicesData = []; 

// ----------------------------------------------------
// 2. 核心函数：生成单个服务卡片的 HTML 结构
// ----------------------------------------------------
function createCardHtml(service) {
    // service.title, service.description, service.link 是从 Google Sheets 列名读取的值
    return `
        <div class="service-card">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <a href="${service.link}" class="btn">查看服务人员</a>
        </div>
    `;
}

// ----------------------------------------------------
// 3. 渲染函数：根据当前数据和搜索词，更新页面内容
// ----------------------------------------------------
function renderServices() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let htmlContent = '';
    
    // 遍历存储的所有服务数据
    servicesData.forEach(service => {
        // 合并标题和描述，用于搜索匹配
        const cardText = (service.title + ' ' + service.description).toLowerCase();
        
        // 筛选逻辑：如果搜索框是空的，或者卡片的文本中包含搜索词
        if (searchTerm === '' || cardText.includes(searchTerm)) {
            // 生成 HTML 并拼接起来
            htmlContent += createCardHtml(service);
        }
    });

    // 一次性将所有生成的 HTML (包括被筛选后的) 放入 HTML 容器中
    servicesContainer.innerHTML = htmlContent;
    
    // 额外提示：如果没有找到任何卡片
    if (htmlContent === '' && servicesData.length > 0) {
        servicesContainer.innerHTML = '<p style="grid-column: 1 / -1; font-size: 1.5em; text-align: center; color: #cc5500;">抱歉，没有找到匹配的服务。请尝试其他关键字。</p>';
    }
}

// ----------------------------------------------------
// 4. 数据加载函数：从 Google Sheets 读取 CSV 数据
// ----------------------------------------------------
async function loadServices() {
    try {
        servicesContainer.innerHTML = '<p style="grid-column: 1 / -1; font-size: 1.2em; text-align: center;">正在加载服务列表...</p>';

        // 使用 fetch API 获取数据
        const response = await fetch(DATA_URL);
        const csvText = await response.text();
        
        // 调用下面的辅助函数将 CSV 文本解析为 JavaScript 对象数组
        servicesData = parseCSV(csvText); 
        
        // 数据加载成功后，渲染服务列表
        renderServices();
        
        // 监听搜索框输入，每次输入都调用渲染函数（它集成了筛选逻辑）
        searchInput.addEventListener('input', renderServices);

    } catch (error) {
        // 如果加载失败，显示错误提示
        console.error('Error loading service data:', error);
        servicesContainer.innerHTML = '<p style="grid-column: 1 / -1; font-size: 1.2em; text-align: center; color: red;">抱歉，服务数据加载失败，请检查您的网络和 Google Sheets 链接。</p>';
    }
}

// ----------------------------------------------------
// 5. CSV 解析辅助函数 (负责将 Sheets 原始数据转换为结构化 JS 格式)
// ----------------------------------------------------
function parseCSV(csv) {
    // 将整个 CSV 文本按行分割，并过滤掉空行
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    // 第一行是标题 (title, description, link)
    // toLowerCase() 确保即使 Sheets 的标题大小写不一致，也能匹配
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    const result = [];
    // 从第二行开始遍历数据行
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const service = {};
        
        // 将值映射到对应的标题上 (例如 service.title = "水喉维修")
        for (let j = 0; j < headers.length; j++) {
            // .trim() 去除可能的空格，.replace(/\r/g, '') 处理不同操作系统下的换行符
            service[headers[j]] = (values[j] || '').trim().replace(/\r/g, ''); 
        }
        
        // 仅添加包含有效标题的数据
        if (service.title) {
            result.push(service);
        }
    }
    return result;
}

// ----------------------------------------------------
// 6. 网站启动！
// ----------------------------------------------------
// 当页面加载完成后，立即执行加载数据函数
loadServices();
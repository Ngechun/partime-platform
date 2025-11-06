// script.js
// 
// ⚠️ 步骤 1：替换您的 Google Sheets CSV 链接 ⚠️
// 请将 '您的 Google Sheets CSV 链接' 替换为您在 Google Sheets 中发布的 CSV 链接！
const DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQg5XACeP4fxy0ZY6fASBb6QJeiv9MFVL3GPzryhok_roTGzo4xlZclsiVDNkoRp3TNlZK8nXEo_jbL/pub?output=csv'; 

// ---------------------- 1. 获取重要元素 ----------------------
const searchInput = document.getElementById('service-search');
const servicesContainer = document.getElementById('services-container');

// ---------------------- 2. CSV 解析函数 ----------------------
// 确保能够正确解析包含 'id' 列的新数据结构
function parseCSV(csvText) {
    // 处理 CSV 文本，分割行和列
    const lines = csvText.trim().split('\n');
    // 预期标题: id, title, description, link
    const headers = lines[0].split(',').map(header => header.trim()); 
    const services = [];

    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        // 确保数据行不为空且符合分隔符规则
        if (data.length === headers.length && data.some(item => item.trim() !== '')) { 
            const service = {};
            for (let j = 0; j < headers.length; j++) {
                service[headers[j]] = data[j].trim();
            }
            services.push(service);
        }
    }
    return services;
}

// ---------------------- 3. 卡片生成函数 ----------------------
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.setAttribute('data-keywords', `${service.title} ${service.description}`);

    const titleElement = document.createElement('h3');
    titleElement.textContent = service.title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = service.description;

    const linkElement = document.createElement('a');
    // ⭐ 关键修改：将链接指向 detail.html，并使用 service.id 作为 URL 参数 ⭐
    // 格式将是：detail.html?id=plumbing (例如)
    linkElement.href = `detail.html?id=${service.id}`; 
    linkElement.className = 'btn';
    linkElement.textContent = '查看服务人员';
    
    card.appendChild(titleElement);
    card.appendChild(descriptionElement);
    card.appendChild(linkElement);
    
    return card;
}

// ---------------------- 4. 数据加载与渲染 ----------------------
let allServices = [];

function loadAndRenderServices() {
    servicesContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">服务数据加载中...</p>';
    
    fetch(DATA_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`网络错误: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            allServices = parseCSV(csvText);
            displayServices(allServices);
        })
        .catch(error => {
            console.error('加载服务数据失败:', error);
            servicesContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: red;">抱歉，服务数据加载失败，请检查您的网络和 Google Sheets 链接。</p>';
        });
}

// ---------------------- 5. 显示和过滤服务 ----------------------
function displayServices(services) {
    servicesContainer.innerHTML = ''; // 清空容器
    
    if (services.length === 0) {
        servicesContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">没有找到匹配的服务。</p>';
        return;
    }

    services.forEach(service => {
        servicesContainer.appendChild(createServiceCard(service));
    });
}

function filterServices() {
    const query = searchInput.value.toLowerCase().trim();
    
    const filtered = allServices.filter(service => {
        // 搜索 title 和 description 
        return service.title.toLowerCase().includes(query) || 
               service.description.toLowerCase().includes(query);
    });
    
    displayServices(filtered);
}

// ---------------------- 6. 初始化 ----------------------
document.addEventListener('DOMContentLoaded', loadAndRenderServices);
searchInput.addEventListener('input', filterServices); // 实时过滤


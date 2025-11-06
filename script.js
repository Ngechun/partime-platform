// script.js
// 
// ⚠️ 步骤 1：替换您的 Google Sheets CSV 链接 ⚠️
const DATA_URL = https://docs.google.com/spreadsheets/d/e/2PACX-1vQg5XACeP4fxy0ZY6fASBb6QJeiv9MFVL3GPzryhok_roTGzo4xlZclsiVDNkoRp3TNlZK8nXEo_jbL/pub?output=csv'; 

// ---------------------- 1. 获取重要元素 ----------------------
const searchInput = document.getElementById('service-search');
const servicesContainer = document.getElementById('services-container');

// ---------------------- 2. CSV 解析函数 ----------------------
function parseCSV(csvText) {
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
    // ⭐ 链接到详情页，并携带服务的唯一 ID ⭐
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

/* ---------------------------------------------------- */
/* 7. 需求表单样式 (Request Form Styles) */
/* ---------------------------------------------------- */

.request-form {
    background-color: #f7f7f7;
    padding: 25px;
    border-radius: 8px;
    border: 1px solid #ddd;
    margin-top: 20px;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.request-form label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
    font-size: 1.1em;
}

.request-form input[type="text"],
.request-form input[type="tel"],
.request-form textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* 确保 padding 不增加总宽度 */
    font-size: 1em;
}

.request-form textarea {
    resize: vertical; /* 允许用户垂直拖动改变大小 */
}

.submit-btn {
    width: 100%;
    font-size: 1.3em;
    padding: 15px;
    margin-top: 10px;
}



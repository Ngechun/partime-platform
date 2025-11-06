// detail.js
//
// ⚠️ 步骤 1：替换您的 Google Sheets CSV 链接 ⚠️
// 必须与 script.js 中的 DATA_URL 相同！
const DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQg5XACeP4fxy0ZY6fASBb6QJeiv9MFVL3GPzryhok_roTGzo4xlZclsiVDNkoRp3TNlZK8nXEo_jbL/pub?output=csv'; 

// ⚠️ 步骤 2：替换您的 Formspree 提交链接 ⚠️
// 例如: 'https://formspree.io/f/xbjnqer'
const FORM_ACTION_URL = 'YOUR_FORMSPREE_ENDPOINT_HERE'; 

// ---------------------- CSV 解析函数 ----------------------
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim()); 
    const services = [];

    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
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

// ---------------------- 详情内容渲染函数 (包含表单) ----------------------
function displayServiceDetail(service) {
    const container = document.getElementById('detail-container');
    document.getElementById('page-title').textContent = `${service.title} | 易找服务平台`;
    
    container.innerHTML = `
        <div class="detail-content">
            <h2>${service.title}</h2>
            <p style="font-size: 1.2em; color: #555;">${service.description}</p>
            
            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
            
            <h3>⭐ 立即发布需求，快速获取服务人员 ⭐</h3>
            <p style="color: #0056b3; font-weight: bold;">
                只需填写以下三个基本信息，我们将快速为您匹配 <strong>${service.title}</strong> 的服务人员！
            </p>

            <form action="${FORM_ACTION_URL}" method="POST" class="request-form">
                
                <input type="hidden" name="Service-Title" value="${service.title}">
                <input type="hidden" name="_subject" value="【新需求】需要 ${service.title} 服务">
                
                <div class="form-group">
                    <label for="name">您的姓名:</label>
                    <input type="text" id="name" name="Name" required>
                </div>
                
                <div class="form-group">
                    <label for="phone">联络电话:</label>
                    <input type="tel" id="phone" name="Phone" required>
                </div>
                
                <div class="form-group">
                    <label for="details">需求详情 (例如：地址，时间):</label>
                    <textarea id="details" name="Details" rows="4" required></textarea>
                </div>
                
                <button type="submit" class="btn submit-btn">提交需求，平台立即联络我</button>
            </form>
            
            <a href="index.html" class="btn" style="background-color: #007bff; margin-top: 40px; width: 100%;">返回所有服务</a>
        </div>
    `;
}

// ---------------------- 详情页主要逻辑 ----------------------
document.addEventListener('DOMContentLoaded', () => {
    // 1. 从 URL 中获取服务的 ID
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    const container = document.getElementById('detail-container');

    if (!serviceId) {
        container.innerHTML = '<h2 style="color: red;">错误：未指定服务ID。</h2>';
        return;
    }

    // 2. 加载数据
    fetch(DATA_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`网络错误: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            const services = parseCSV(csvText);
            
            // 3. 查找匹配的服务
            const service = services.find(s => s.id === serviceId);

            if (service) {
                // 4. 动态显示详情 (包含表单)
                displayServiceDetail(service);
            } else {
                container.innerHTML = `<h2 style="color: red;">抱歉，找不到ID为 "${serviceId}" 的服务。</h2>`;
            }
        })
        .catch(error => {
            console.error('加载详情数据失败:', error);
            container.innerHTML = '<h2 style="color: red;">抱歉，服务详情加载失败。请检查您的 Google Sheets 链接。</h2>';
        });
});

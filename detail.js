// detail.js

// 假设您的 Google Sheets CSV 链接 (与 script.js 中的 DATA_URL 相同)
const DATA_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQg5XACeP4fxy0ZY6fASBb6QJeiv9MFVL3GPzryhok_roTGzo4xlZclsiVDNkoRp3TNlZK8nXEo_jbL/pub?output=csv'; // ⚠️ 请确保这里粘贴了完整的链接

// ---------------------- CSV 解析函数 (与 script.js 相同) ----------------------
// 我们需要再次定义 CSV 解析函数，以便 detail.js 也能处理数据
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim()); // 预期: id, title, description, link
    const services = [];

    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        if (data.length === headers.length) {
            const service = {};
            for (let j = 0; j < headers.length; j++) {
                service[headers[j]] = data[j].trim();
            }
            services.push(service);
        }
    }
    return services;
}

// ---------------------- 详情页主要逻辑 ----------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. 从 URL 中获取服务的 ID
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    if (!serviceId) {
        document.getElementById('detail-container').innerHTML = '<h2>错误：未指定服务ID。</h2>';
        return;
    }

    // 2. 加载数据
    fetch(DATA_URL)
        .then(response => response.text())
        .then(csvText => {
            const services = parseCSV(csvText);
            
            // 3. 查找匹配的服务
            const service = services.find(s => s.id === serviceId);

            if (service) {
                // 4. 动态显示详情
                displayServiceDetail(service);
            } else {
                document.getElementById('detail-container').innerHTML = `<h2>抱歉，找不到ID为 "${serviceId}" 的服务。</h2>`;
            }
        })
        .catch(error => {
            console.error('加载详情数据失败:', error);
            document.getElementById('detail-container').innerHTML = '<h2>抱歉，服务详情加载失败。</h2>';
        });
});

// ---------------------- 详情内容渲染函数 ----------------------

function displayServiceDetail(service) {
    const container = document.getElementById('detail-container');
    
    // ⭐⭐ 重点：这里可以安全地展示服务人员的联系方式 ⭐⭐
    // 请在 Google Sheets 中添加联系方式列（例如 contact_info），并在这里显示
    // 
    // 目前我们先用占位符
    container.innerHTML = `
        <div class="detail-content">
            <h2>${service.title}</h2>
            <p style="font-size: 1.2em; color: #555;">${service.description}</p>
            
            <hr>
            
            <h3>服务提供者联系方式 (联系我们)</h3>
            <p><strong>注意：</strong> 为了保护隐私，请通过下方的表单或电话联系平台客服以获取服务人员的详细信息。</p>

            <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px;">
                <p>📞 平台联络电话: <strong>(123) 456-7890</strong></p>
                <p>📧 平台联络邮箱: <strong>service@example.com</strong></p>
            </div>
            
            <a href="index.html" class="btn" style="background-color: #007bff; margin-top: 20px;">返回所有服务</a>
        </div>
    `;
}
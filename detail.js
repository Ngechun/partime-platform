// detail.js (恢复到仅显示基础详情的版本)
//
// ⚠️ 替换您的 Google Sheets CSV 链接 ⚠️
const DATA_URL = '您的 Google Sheets CSV 链接'; 

// ---------------------- CSV 解析函数 (确保独立运行) ----------------------
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

// ---------------------- 详情内容渲染函数 ----------------------
function displayServiceDetail(service) {
    const container = document.getElementById('detail-container');
    document.getElementById('page-title').textContent = `${service.title} | 易找服务平台`;
    
    container.innerHTML = `
        <div class="detail-content">
            <h2>${service.title}</h2>
            <p style="font-size: 1.2em; color: #555;">${service.description}</p>
            
            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #ccc;">
            
            <h3>服务提供者联系方式 (联系平台)</h3>
            <p style="color: #dc3545; font-weight: bold;">
                注意：请通过下方的平台客服联系方式获取服务人员的详细信息。
            </p>

            <div style="background-color: #f0f8ff; padding: 25px; border-radius: 8px; margin-top: 20px;">
                <p style="font-size: 1.1em; margin-bottom: 10px;">📞 平台联络电话: <strong>(123) 456-7890</strong></p>
                <p style="font-size: 1.1em;">📧 平台联络邮箱: <strong>service@example.com</strong></p>
            </div>
            
            <a href="index.html" class="btn" style="background-color: #007bff; margin-top: 30px;">返回所有服务</a>
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
                // 4. 动态显示详情
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

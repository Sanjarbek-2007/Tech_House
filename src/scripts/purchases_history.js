document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
});

function renderHistory() {
    const listContainer = document.getElementById('history-list');

    // 1. Check Auth
    if (!window.Auth || !window.Auth.getCurrentUser()) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="user-x" size="48" style="margin-bottom:10px;"></i>
                <p>Please log in to view your purchases.</p>
                <a href="auth_page.html" class="reorder-btn" style="display:inline-block; margin-top:10px;">Login</a>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    const user = window.Auth.getCurrentUser();
    const historyKey = `purchase_history_${user.id}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');

    // 2. Check Empty
    if (history.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="shopping-bag" size="48" style="margin-bottom:10px; color:#ddd;"></i>
                <p>No purchases yet.</p>
                <a href="appliances_page.html" class="reorder-btn" style="display:inline-block; margin-top:10px;">Start Shopping</a>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    // 3. Render Items
    let html = '';
    history.forEach(order => {
        // Safe check for date
        let dateStr = 'Unknown Date';
        if (order.date) {
            const d = new Date(order.date);
            dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        // Generate Thumbnails HTML
        let thumbsHtml = '';
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                let imgPath = item.image || '../photos/placeholder.png';
                if (imgPath.startsWith('/src/')) imgPath = '..' + imgPath.substring(4);

                thumbsHtml += `
                    <div title="${item.name} (x${item.quantity})" style="position:relative;">
                        <img src="${imgPath}" class="mini-thumb" alt="Product">
                        <span style="position:absolute; bottom:-5px; right:-5px; background:#333; color:#fff; font-size:10px; padding:2px 5px; border-radius:10px;">x${item.quantity}</span>
                    </div>
                `;
            });
        }

        // Status Colors
        let statusClass = 'status-processing';
        if (order.status === 'Delivered') statusClass = 'status-delivered';

        html += `
        <div class="order-card">
            <div class="order-header">
                <div class="order-meta">
                    <div class="meta-item">
                        <i data-lucide="calendar" size="16"></i> ${dateStr}
                    </div>
                    <div class="meta-item">
                        <i data-lucide="hash" size="16"></i> ${order.id}
                    </div>
                </div>
                <div class="order-status ${statusClass}">
                    ${order.status}
                </div>
            </div>

            <div class="order-body">
                <!-- Left: Scrollable Items -->
                <div class="order-items">
                    ${order.items.map(item => {
            let imgPath = item.image || '../photos/placeholder.png';
            if (imgPath.startsWith('/src/')) imgPath = '..' + imgPath.substring(4);
            return `
                        <div class="item-thumb-wrapper" title="${item.name}">
                            <img src="${imgPath}" class="mini-thumb" alt="Product">
                            <span class="item-badge">x${item.quantity}</span>
                        </div>
                        `;
        }).join('')}
                </div>

                <!-- Right: Summary & Action -->
                <div class="order-info-side">
                    <div class="order-summary-row">
                        <span>Items Total:</span>
                        <span>${formatPrice(order.summary.total - (order.summary.deliveryFee || 0))}</span>
                    </div>
                    <div class="order-summary-row">
                        <span>Delivery:</span>
                        <span>${order.summary.deliveryFee === 0 ? 'Free' : formatPrice(order.summary.deliveryFee)}</span>
                    </div>
                    ${order.summary.earnedPoints ? `
                    <div class="order-summary-row" style="color:var(--primary-red); font-weight:600;">
                        <span>Points Earned:</span>
                        <span>+${order.summary.earnedPoints}</span>
                    </div>
                    ` : ''}
                    
                    <div class="order-total-large">
                        ${formatPrice(order.summary.total)}
                    </div>
                    
                    <button class="reorder-btn" onclick="showToast('Tracking details sent to email!', 'success')">
                        <i data-lucide="truck" size="18"></i> Track Order
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    listContainer.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

function formatPrice(num) {
    return num.toLocaleString('ru-RU').replace(/,/g, ' ') + ' UZS';
}

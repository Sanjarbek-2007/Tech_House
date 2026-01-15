document.addEventListener('DOMContentLoaded', () => {
    // Initial Full Render
    fullRenderCart();

    // Listen for global changes (legacy or external calls)
    window.addEventListener('cartChanged', (e) => {
        // If event provides detail, try smart update, else full
        if (e.detail && e.detail.productId) {
            handleSmartCartUpdate(e.detail.productId, e.detail.quantity);
        } else {
            fullRenderCart();
        }
    });

    // Check All Checkbox Listener
    const selectAll = document.getElementById('select-all-check');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.item-checkbox');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
            updateSummary();
        });
    }

    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});

function handleSmartCartUpdate(productId, qty) {
    // If no specific product passed (e.g. init), or qty is 0 (removed), or list is empty -> Full Render
    if (!productId || qty <= 0 || document.querySelectorAll('.cart-card').length === 0) {
        fullRenderCart();
        return;
    }

    // Try to find the existing card
    const card = document.querySelector(`.cart-card[data-product-id="${productId}"]`);
    if (!card) {
        fullRenderCart(); // Should exist, but if not found, re-render all
        return;
    }

    // PARTIAL UPDATE (The "Show Off" Real-time part)
    console.log(`CartPage: Smart updating product ${productId} to qty ${qty}`);

    // 1. Update Input
    const qtyInput = card.querySelector('.qty-input-cart');
    if (qtyInput) {
        qtyInput.value = qty;
        // Animation effect
        qtyInput.style.transform = 'scale(1.2)';
        qtyInput.style.color = 'var(--primary-red)';
        setTimeout(() => {
            qtyInput.style.transform = 'scale(1)';
            qtyInput.style.color = 'inherit';
        }, 200);
    }

    // 2. Update Row Price - DISABLED (User request: show constant unit price)
    /*
    const priceDisplay = card.querySelector('.price');
    const product = window.products.find(p => p.id == productId); // loose match
    if (product && priceDisplay) {
        const totalRowPrice = product.price * qty;
        priceDisplay.textContent = formatPrice(totalRowPrice);
    }
    */

    // 3. Recalculate Totals (Summary)
    updateSummary();
}

function fullRenderCart() {
    console.log('CartPage: fullRenderCart called');
    const container = document.getElementById('cart-list-container');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const countSpan = document.getElementById('cart-total-count');
    const badge = document.getElementById('mobile-cart-badge');

    if (!container) return;

    if (!window.CartManager || !window.products) {
        container.innerHTML = '<p style="padding:20px; color:red;">Error loading cart dependencies.</p>';
        return;
    }

    const cartItems = window.CartManager.getCart(); // [{productId, quantity}]

    // Update Counts
    let totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    if (countSpan) countSpan.textContent = totalItemsCount;
    if (badge) {
        badge.textContent = totalItemsCount;
        badge.style.display = totalItemsCount > 0 ? 'flex' : 'none';
        badge.style.background = 'var(--primary-red)';
    }

    if (cartItems.length === 0) {
        container.innerHTML = '';
        container.appendChild(emptyMsg);
        emptyMsg.style.display = 'block';
        updateSummary();
        return;
    } else {
        emptyMsg.style.display = 'none';
    }

    // Preserve check states if possible, or just re-render
    // For full render, we usually reset.
    let html = '';

    cartItems.forEach(item => {
        // Relaxed equality check (==) to handle string/number id mismatch
        const product = window.products.find(p => p.id == item.productId);
        if (!product) return; // Skip invalid products

        // Fix Image Path
        let imgPath = '';
        if (product.images && product.images.length > 0) imgPath = product.images[0];
        else if (product.image) imgPath = Array.isArray(product.image) ? product.image[0] : product.image;

        // Handle relative path fix (since we are in /pages/)
        if (imgPath.startsWith('/src/')) {
            imgPath = '..' + imgPath.substring(4);
        }

        const totalPrice = product.price * item.quantity;

        html += `
            <div class="cart-card" data-product-id="${product.id}">
                <input type="checkbox" class="item-checkbox" checked onchange="updateSummary()">
                
                <div class="item-image" onclick="window.location.href='appliance_details_page.html?id=${product.id}'" style="cursor:pointer;">
                    <img src="${imgPath}" alt="${product.name}">
                </div>

                <div class="item-details">
                    <h2 class="item-title" onclick="window.location.href='appliance_details_page.html?id=${product.id}'" style="cursor:pointer;">${product.name}</h2>
                    <p class="item-spec">
                        ${product.brand ? `Brand: ${product.brand}` : ''} 
                        ${product.specs && product.specs.Color ? `| Color: ${product.specs.Color}` : ''}
                    </p>
                    
                    
                    <div class="item-price-row">
                        <span class="price" style="min-width:120px; display:inline-block; text-align:right;">${formatPrice(product.price)}</span>
                        
                        <!-- Smart Quantity Controls -->
                        <div class="quantity-control-cart">
                            <button class="qty-btn-cart minus" onclick="window.CartManager.decrementItem('${product.id}')">
                                <i data-lucide="minus" size="14"></i>
                            </button>
                            <input type="text" class="qty-input-cart" value="${item.quantity}" readonly>
                            <button class="qty-btn-cart plus" onclick="window.CartManager.incrementItem('${product.id}')">
                                <i data-lucide="plus" size="14"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <button class="delete-btn" onclick="window.CartManager.removeItem('${product.id}')" title="Remove Item">
                    <i data-lucide="trash-2" size="20"></i>
                </button>
            </div>
        `;
    });

    container.innerHTML = html;

    // Re-init Icons
    if (window.lucide) window.lucide.createIcons();

    // Trigger calculation
    updateSummary();
}

function updateSummary() {
    if (!window.CartManager || !window.products) return;

    const cards = document.querySelectorAll('.cart-card');
    let subtotal = 0;

    // Breakdown Logic
    let breakdownHtml = '<div style="margin-bottom:15px; font-size:0.9rem; color:#555; border-bottom:1px solid #eee; padding-bottom:10px;">';

    cards.forEach(card => {
        const checkbox = card.querySelector('.item-checkbox');
        if (checkbox && checkbox.checked) {
            const pid = card.dataset.productId;
            const quantityInput = card.querySelector('.qty-input-cart');
            const qty = parseInt(quantityInput.value) || 0;

            // Relaxed equality check (==) to handle string/number id mismatch
            const product = window.products.find(p => p.id == pid);
            if (product) {
                const lineTotal = product.price * qty;
                subtotal += lineTotal;

                // Add to breakdown logic
                // Format: "Oral-b electric toot... - 2x = 6200000"
                const truncatedName = product.name.length > 20 ? product.name.substring(0, 18) + '...' : product.name;
                breakdownHtml += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>${truncatedName} <span style="font-weight:600;">x${qty}</span></span>
                        <span>${lineTotal.toLocaleString('ru-RU').replace(/,/g, ' ')}</span>
                    </div>
                `;
            } else {
                console.warn('CartPage: Product not found for ID', pid);
            }
        }
    });

    breakdownHtml += '</div>';

    // Inject Breakdown
    const summaryContainer = document.querySelector('.cart-summary');
    if (summaryContainer) {
        let breakdownContainer = document.getElementById('summary-breakdown-list');
        if (!breakdownContainer) {
            breakdownContainer = document.createElement('div');
            breakdownContainer.id = 'summary-breakdown-list';
            // Insert at the VERY TOP of the summary container
            summaryContainer.insertBefore(breakdownContainer, summaryContainer.firstChild);
            // Or ideally after the title "Summary" if it exists, let's assume top is safe or we check for h2
            const title = summaryContainer.querySelector('h2');
            if (title) {
                title.parentNode.insertBefore(breakdownContainer, title.nextSibling);
            } else {
                summaryContainer.insertBefore(breakdownContainer, summaryContainer.firstChild);
            }
        }
        breakdownContainer.innerHTML = breakdownHtml;
    }

    // Subtotal
    const subText = document.getElementById('summary-subtotal');
    if (subText) subText.textContent = formatPrice(subtotal);

    // Delivery Cost
    let shippingCost = 0;
    const deliveryRadio = document.querySelector('input[name="delivery"]:checked');
    const shippingSpan = document.getElementById('summary-shipping');

    // Check Membership for Free Delivery
    let isGoldMember = false;
    let membershipTier = 'bronze';

    if (window.Auth && window.Auth.getCurrentUser()) {
        const user = window.Auth.getCurrentUser();
        if (user.membership) {
            membershipTier = user.membership.toLowerCase();
            if (membershipTier === 'gold') {
                isGoldMember = true;
            }
        }
    }

    if (deliveryRadio && deliveryRadio.value === 'delivery') {
        if (isGoldMember) {
            shippingCost = 0;
            if (shippingSpan) {
                shippingSpan.innerHTML = '<span style="color:#ffd700; font-weight:bold;">FREE (Gold)</span>';
                shippingSpan.classList.add('free-shipping');
            }
        } else {
            shippingCost = 50000;
            if (shippingSpan) {
                shippingSpan.textContent = formatPrice(shippingCost);
                shippingSpan.classList.remove('free-shipping');
                shippingSpan.style.color = 'var(--text-dark)';
            }
        }
    } else {
        // Pickup is always free
        shippingCost = 0;
        if (shippingSpan) {
            shippingSpan.textContent = 'Free';
            shippingSpan.classList.add('free-shipping');
        }
    }

    // Discount (Random logic or none for now)
    const discount = 0;
    document.getElementById('summary-discount').textContent = formatPrice(discount);

    // Total
    const total = subtotal + shippingCost - discount;
    const totalEl = document.getElementById('summary-total');
    totalEl.textContent = formatPrice(total);
    totalEl.dataset.rawValue = total; // Store raw value for checkout

    // EST. POINTS (New Feature)
    let multiplier = 1;
    if (membershipTier === 'silver') multiplier = 1.1;
    if (membershipTier === 'gold') multiplier = 1.25;

    console.log(`CartPage: Calculation - Tier: ${membershipTier}, Multiplier: ${multiplier}`);

    const estPoints = Math.floor((total / 1000) * multiplier);

    // Check if points row exists, if not create it
    let pointsRow = document.getElementById('summary-points-row');
    if (!pointsRow) {
        pointsRow = document.createElement('div');
        pointsRow.id = 'summary-points-row';
        pointsRow.className = 'summary-row';
        pointsRow.style.color = 'var(--text-sec)';
        pointsRow.style.fontSize = '0.9rem';
        pointsRow.style.marginTop = '10px';

        // Insert before the HR
        const hr = document.querySelector('.cart-summary hr');
        if (hr) hr.parentNode.insertBefore(pointsRow, hr);
    }

    pointsRow.innerHTML = `
        <span>Est. Points (${membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)})</span>
        <span style="color: var(--primary-red); font-weight:600;">+${estPoints}</span>
    `;
}

function formatPrice(num) {
    return num.toLocaleString('ru-RU').replace(/,/g, ' ') + ' UZS';
}

function handleCheckout() {
    // 1. Validate User
    if (!window.Auth || !window.Auth.getCurrentUser()) {
        window.location.href = 'auth_page.html';
        return;
    }
    const user = window.Auth.getCurrentUser();

    // 2. Identify Selected Items
    const selectedIds = [];
    document.querySelectorAll('.cart-card').forEach(card => {
        const checkbox = card.querySelector('.item-checkbox');
        if (checkbox && checkbox.checked) {
            selectedIds.push(card.dataset.productId);
        }
    });

    if (selectedIds.length === 0) {
        alert("Please select at least one item to checkout.");
        return;
    }

    // 3. Gather Order Data
    const orderId = 'TH-' + Math.floor(1000 + Math.random() * 9000); // Simple ID
    const date = new Date().toISOString();

    // Get Financials from DOM 
    // (Note: updateSummary already calculates total based on *selected* items, so using DOM is safe and accurate)
    const totalEl = document.getElementById('summary-total');
    const totalAmount = parseFloat(totalEl.dataset.rawValue || 0);

    const deliveryRadio = document.querySelector('input[name="delivery"]:checked');
    const deliveryType = deliveryRadio ? deliveryRadio.value : 'pickup';
    const deliveryText = deliveryType === 'pickup' ? 'Store Pickup' : 'Home Delivery';

    let deliveryFee = 0;
    if (deliveryType === 'delivery') {
        const isGold = (user.membership && user.membership.toLowerCase() === 'gold');
        deliveryFee = isGold ? 0 : 50000;
    }

    // Build Items Entry ONLY for Selected Items
    const cart = window.CartManager.getCart();
    const orderItems = [];

    cart.forEach(cartItem => {
        // loose match for safety
        if (selectedIds.some(id => id == cartItem.productId)) {
            const product = window.products.find(p => p.id == cartItem.productId);
            if (product) {
                orderItems.push({
                    productId: product.id,
                    name: product.name,
                    image: (product.images && product.images[0]) ? product.images[0] : (Array.isArray(product.image) ? product.image[0] : product.image),
                    quantity: cartItem.quantity,
                    pricePerUnit: product.price,
                    totalPrice: product.price * cartItem.quantity
                });
            }
        }
    });

    // 4. Points Logic 
    let earnedPoints = 0;
    let multiplier = 1;
    const mem = (user.membership || 'bronze').toLowerCase();

    if (mem === 'silver') multiplier = 1.1;
    if (mem === 'gold') multiplier = 1.25;

    earnedPoints = Math.floor((totalAmount / 1000) * multiplier);

    // 5. Construct Final Order Object
    const newOrder = {
        id: orderId,
        userId: user.id,
        date: date,
        status: 'Processing',
        items: orderItems,
        summary: {
            total: totalAmount,
            deliveryFee: deliveryFee,
            deliveryMethod: deliveryText,
            earnedPoints: earnedPoints
        }
    };

    // 6. Save to Local Storage (History)
    const historyKey = `purchase_history_${user.id}`;
    let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.unshift(newOrder);
    localStorage.setItem(historyKey, JSON.stringify(history));

    // 7. Update User Points
    user.points = (user.points || 0) + earnedPoints;
    localStorage.setItem(window.Auth.USER_KEY, JSON.stringify(user));

    // 8. Show Success Modal
    const totalStr = formatPrice(totalAmount);

    // Create overlay
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modal.style.backdropFilter = 'blur(8px)';
    modal.style.zIndex = '10000';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';

    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 40px;
            border-radius: 24px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            transform: scale(0.8);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 90%;
            width: 420px;
            border-top: 6px solid var(--primary-red);
        ">
            <div style="
                width: 80px; 
                height: 80px; 
                border-radius: 50%; 
                background: #e8f5e9; 
                color: #2e7d32; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                margin: 0 auto 24px;
            ">
                <i data-lucide="check" size="40"></i>
            </div>
            
            <h2 style="font-size: 1.8rem; margin-bottom: 12px; color: #111;">Order Placed!</h2>
            <p style="font-size: 1.1rem; color: #555; margin-bottom: 8px;">Order #${orderId}</p>
            <p style="font-size: 1.25rem; font-weight: 700; color: #111; margin-bottom: 24px;">${totalStr}</p>
            
            ${earnedPoints > 0 ? `
            <div style="
                margin-bottom: 24px; 
                padding: 12px; 
                background: #fff8e1; 
                border: 1px solid #ffe0b2; 
                border-radius: 12px; 
                color: #f57c00; 
                font-weight: 600; 
                display: inline-flex;
                align-items: center;
                gap: 8px;
            ">
                <i data-lucide="star" size="18"></i> +${earnedPoints} Points
            </div>
            ` : ''}

            <div style="font-size: 0.95rem; color: #888;">
                <div class="spinner-mini" style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid #ddd;
                    border-top-color: var(--primary-red);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                    vertical-align: middle;
                "></div>
                Redirecting to order history...
            </div>
        </div>
        <style>
            @keyframes spin { to { transform: rotate(360deg); } }
        </style>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    // Trigger Animation
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    });

    // 9. Remove ONLY Purchased (Selected) Items from Cart
    selectedIds.forEach(id => {
        window.CartManager.removeItem(id);
    });
    // Update badge one last time
    window.CartManager.updateBadge();

    // 10. Redirect
    setTimeout(() => {
        window.location.href = '../pages/purchases_history.html';
    }, 2500);
}

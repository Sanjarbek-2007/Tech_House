/**
 * Home Page Logic
 * Renders Trending and New Arrivals from window.products
 */

document.addEventListener('DOMContentLoaded', () => {
    renderTrendingProducts();
    renderNewArrivals();
    // Re-init icons for dynamic content
    if (window.lucide) window.lucide.createIcons();
});

function renderTrendingProducts() {
    const container = document.getElementById('prodScroll');
    if (!container) return;

    // Filter for Hot, Bestseller, or generic high rating
    const trending = window.products.filter(p =>
        (p.badge && ['hot', 'bestseller', 'trending', 'sale'].includes(p.badge.type)) ||
        p.rating >= 4.7
    ).slice(0, 8);

    container.innerHTML = '';
    trending.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

function renderNewArrivals() {
    const container = document.getElementById('newScroll');
    if (!container) return;

    const newArrivals = window.products.filter(p =>
        (p.badge && p.badge.type === 'new')
    ).slice(0, 8);

    container.innerHTML = '';
    newArrivals.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

function createProductCard(product) {
    const formattedPrice = product.price.toLocaleString('ru-RU').replace(/,/g, ' ');

    const cardLink = document.createElement('a');
    cardLink.href = `./src/pages/appliance_details_page.html?id=${product.id}`;
    cardLink.className = 'product-card-link';

    // Image Logic - Support multiple formats
    let imageContent = '';
    let productImages = [];

    if (product.images) {
        productImages = product.images;
    } else if (product.image) {
        productImages = Array.isArray(product.image) ? product.image : [product.image];
    }

    // Fix paths for index.html (convert /src/ to ./src/)
    productImages = productImages.map(img => {
        const path = String(img);
        return path.startsWith('/') ? '.' + path : path;
    });

    if (productImages.length > 0 && productImages[0]) {
        // Use first image as default, others will cycle on hover
        imageContent = `<img src="${productImages[0]}" alt="${product.name}" class="product-image">`;

        // Add hidden images for cycling (if multiple)
        if (productImages.length > 1) {
            for (let i = 1; i < productImages.length; i++) {
                imageContent += `<img src="${productImages[i]}" alt="${product.name}" class="product-image" style="display:none;">`;
            }
        }
    } else {
        // Placeholder Icon Logic
        let icon = 'package';
        const cat = product.category.toLowerCase();
        const name = product.name.toLowerCase();

        if (cat.includes('kitchen')) icon = 'utensils';
        else if (cat.includes('cleaning')) icon = 'sparkles';
        else if (cat.includes('heating')) icon = 'thermometer';
        else if (cat.includes('personal')) icon = 'smile';

        if (name.includes('microwave')) icon = 'microwave';
        if (name.includes('fridge') || name.includes('refrigerator')) icon = 'refrigerator';
        if (name.includes('wash')) icon = 'washing-machine';

        imageContent = `
            <div class="image-placeholder-dynamic" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:#f8f9fa; color:#adb5bd;">
                <i data-lucide="${icon}" width="48" height="48"></i>
            </div>
        `;
    }

    // Badge Logic
    let badgeHTML = '';
    if (product.badge) {
        badgeHTML = `<div class="product-badge ${product.badge.type}">${product.badge.text}</div>`;
    }

    const starColor = product.rating > 0 ? '#fbc02d' : '#ddd';
    const reviewText = product.reviews > 0 ? `(${product.reviews})` : '(0)';

    cardLink.innerHTML = `
        <div class="card-item product-card">
            <div class="prod-img-box">
                ${imageContent}
                ${badgeHTML}
            </div>
            <div class="prod-details" style="flex:1; display:flex; flex-direction:column;">
                <h3 class="prod-title">${product.name}</h3>
                <div class="prod-meta" style="margin-bottom:8px; font-size:12px; color:#777;">
                    <i data-lucide="star" size="12" fill="${starColor}" color="${starColor}"></i> 
                    ${product.rating} ${reviewText}
                </div>
                <div class="prod-price">
                    <span class="current-price" style="font-size:16px; font-weight:700;">${formattedPrice}</span>
                    <span style="font-size:12px;">UZS</span>
                </div>
                
                <!-- Action Row -->
                <div class="prod-actions-row" style="display:flex; gap:8px; margin-top:10px; align-items:center;">
                    <div class="cart-action-container" id="cart-actions-${product.id}" style="flex:1;">
                        <!-- Smart button will be rendered here -->
                    </div>
                    <button class="wishlist-btn-inline" id="wishlist-${product.id}" onclick="event.preventDefault(); event.stopPropagation();">
                        <i data-lucide="heart" size="20"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Render smart cart button
    const actionsContainer = cardLink.querySelector(`#cart-actions-${product.id}`);
    renderSmartButton(product.id, actionsContainer);

    // Setup wishlist button
    const wishlistBtn = cardLink.querySelector(`#wishlist-${product.id}`);
    if (wishlistBtn && window.WishlistManager) {
        // Set initial state based on localStorage
        const isLiked = window.WishlistManager.isLiked(product.id);
        if (isLiked) {
            wishlistBtn.classList.add('active');
        }

        // Add click handler
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const nowLiked = window.WishlistManager.toggleLike(product.id);

            if (nowLiked) {
                wishlistBtn.classList.add('active');
            } else {
                wishlistBtn.classList.remove('active');
            }
        });
    }

    // Listen for cart changes to update this specific button
    window.addEventListener('cartChanged', (e) => {
        if (e.detail.productId === product.id) {
            renderSmartButton(product.id, actionsContainer);
        }
    });

    // Image Cycling on Hover (same as appliances page)
    const imgBox = cardLink.querySelector('.prod-img-box');
    const images = cardLink.querySelectorAll('.product-image');

    if (images.length > 1) {
        let currentIndex = 0;
        let cycleInterval = null;

        imgBox.addEventListener('mouseenter', () => {
            currentIndex = 0;
            cycleInterval = setInterval(() => {
                images[currentIndex].style.display = 'none';
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].style.display = 'block';
            }, 800); // Change image every 800ms
        });

        imgBox.addEventListener('mouseleave', () => {
            clearInterval(cycleInterval);
            // Reset to first image
            images.forEach((img, idx) => {
                img.style.display = idx === 0 ? 'block' : 'none';
            });
        });
    }

    // Reinit Lucide icons for this card
    if (window.lucide) {
        window.lucide.createIcons({ nameAttr: 'data-lucide' });
    }

    return cardLink;
}

/**
 * Render smart cart button - shows "Add to Cart" or Quantity Controls
 * @param {string} productId 
 * @param {HTMLElement} container 
 */
function renderSmartButton(productId, container) {
    if (!container) return;

    const quantity = window.CartManager ? window.CartManager.getItemQuantity(productId) : 0;

    if (quantity > 0) {
        // Show quantity controls
        container.innerHTML = `
            <div class="quantity-controls">
                <button class="qty-btn qty-minus" data-product-id="${productId}">
                    <i data-lucide="minus" size="16"></i>
                </button>
                <div class="qty-display">${quantity}</div>
                <button class="qty-btn qty-plus" data-product-id="${productId}">
                    <i data-lucide="plus" size="16"></i>
                </button>
            </div>
        `;

        // Add event listeners
        const minusBtn = container.querySelector('.qty-minus');
        const plusBtn = container.querySelector('.qty-plus');

        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.CartManager) {
                window.CartManager.decrementItem(productId);
            }
        });

        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.CartManager) {
                window.CartManager.incrementItem(productId);
            }
        });
    } else {
        // Show "Add to Cart" button
        container.innerHTML = `
            <button class="btn-cart-add">
                <i data-lucide="shopping-cart" size="16"></i> 
                <span>Add to Cart</span>
            </button>
        `;

        const addBtn = container.querySelector('.btn-cart-add');
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Check if user is logged in
            if (!window.Auth) {
                showToast("Error: Authentication system not loaded", "error");
                return;
            }

            const user = window.Auth.getCurrentUser();
            if (!user) {
                showToast("Please create a profile first to start shopping!", "warning");
                const isPages = window.location.pathname.includes('/pages/');
                const authPath = isPages ? 'auth_page.html' : 'src/pages/auth_page.html';
                setTimeout(() => window.location.href = authPath, 1500);
                return;
            }

            if (window.CartManager) {
                window.CartManager.incrementItem(productId);
            }
        });
    }

    // Reinit Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// --- Tab Logic ---
window.switchHomeTab = function (tabName) {
    // Buttons
    document.querySelectorAll('.home-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = '#666';
        btn.style.borderColor = 'transparent';
    });
    // Active Button Style
    const activeBtn = event.currentTarget; // Assuming event is global or passed
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.color = 'var(--primary-red)';
        activeBtn.style.borderColor = 'var(--primary-red)';
    }

    // Content
    document.querySelectorAll('.home-tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });

    const target = document.getElementById('home-tab-' + tabName);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
    }
};

// --- Subscription Logic ---
window.subscribeToPlan = function (plan) {
    // 1. Check Auth
    if (!window.Auth || !window.Auth.getCurrentUser()) {
        showToast("Please log in or sign up to subscribe.", "warning");
        window.location.href = './src/pages/auth_page.html';
        return;
    }

    const user = window.Auth.getCurrentUser();

    // 2. Confirm (Mock Payment)
    // Using confirm is still okay for "Are you sure?", but alert for success/error
    if (confirm(`Subscribe to ${plan.toUpperCase()} plan? This will be charged to your account.`)) {
        // 3. Update User
        user.membership = plan;
        localStorage.setItem(window.Auth.USER_KEY, JSON.stringify(user));

        // 4. Success Alert
        showToast(`Congratulations! You are now a ${plan.toUpperCase()} member.`, "success");
        // Optional: Refresh page or update UI
    }
};


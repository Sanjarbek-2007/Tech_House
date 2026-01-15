document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();

    // Listen for changes
    window.addEventListener('wishlistChanged', () => {
        renderWishlist();
    });

    // Listen for cart changes to update buttons
    window.addEventListener('cartChanged', () => {
        // Re-render buttons only? Or full list? Full list is safer to keep states synced
        // But might reset image cycle. For now full render is robust.
        renderWishlist(false); // false = don't reset sort/filter if we had them?
        // Actually renderWishlist reads the select value.
    });
});

function renderWishlist() {
    const grid = document.getElementById('wishlist-grid');
    const countSpan = document.getElementById('wishlist-count');
    const sortValue = document.getElementById('sort-select') ? document.getElementById('sort-select').value : 'default';

    if (!grid) return;

    if (!window.WishlistManager || !window.products) {
        console.error('Dependencies missing');
        return;
    }

    const likedIds = window.WishlistManager.getLikedProducts();
    if (countSpan) countSpan.textContent = likedIds.length;

    if (likedIds.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i data-lucide="heart-off" size="64"></i>
                <h3>Your wishlist is empty</h3>
                <p>Save items you love to find them easily later.</p>
                <a href="appliances_page.html" class="btn-primary">Start Shopping</a>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    // 1. Filter products
    let items = window.products.filter(p => likedIds.includes(p.id));

    // 2. Sort products
    switch (sortValue) {
        case 'price-asc':
            items.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            items.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            items.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'category':
            items.sort((a, b) => a.category.localeCompare(b.category));
            break;
        default:
            // Default usually catalog order
            break;
    }

    // 3. Render Cards (Using Homepage/Catalog Logic)
    grid.innerHTML = '';
    items.forEach(product => {
        grid.appendChild(createWishlistCard(product));
    });

    // 4. Init Icons
    if (window.lucide) window.lucide.createIcons();
}

/**
 * Create a full-featured product card
 */
function createWishlistCard(product) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-item product-card';

    // --- Image Logic (Same as Home.js but adjusted for relative path) ---
    let imageContent = '';
    let productImages = [];
    if (product.images) productImages = product.images;
    else if (product.image) productImages = Array.isArray(product.image) ? product.image : [product.image];

    // Fix paths: We are in /src/pages/, images are in /src/assets/
    // So /src/assets/x.jpg needs to become ../assets/x.jpg
    productImages = productImages.map(img => {
        let path = String(img);
        if (path.startsWith('/src/')) {
            // Replace '/src' with '..'
            return '..' + path.substring(4);
        }
        return path;
    });

    if (productImages.length > 0) {
        // Main Image (Display Block)
        imageContent = `<img src="${productImages[0]}" alt="${product.name}" class="product-image" onclick="window.location.href='appliance_details_page.html?id=${product.id}'">`;

        // Hidden images for cycling
        if (productImages.length > 1) {
            for (let i = 1; i < productImages.length; i++) {
                imageContent += `<img src="${productImages[i]}" alt="${product.name}" class="product-image" style="display:none;" onclick="window.location.href='appliance_details_page.html?id=${product.id}'">`;
            }
        }
    } else {
        imageContent = `<div class="image-placeholder"><i data-lucide="package"></i></div>`;
    }

    // Badge
    let badgeHTML = '';
    if (product.badge) {
        badgeHTML = `<div class="product-badge ${product.badge.type}">${product.badge.text}</div>`;
    }

    // Rating
    const starColor = product.rating > 0 ? '#fbc02d' : '#ddd';

    cardWrapper.innerHTML = `
        <div class="prod-img-box">
             ${imageContent}
             ${badgeHTML}
        </div>
        <div class="prod-details">
            <h3 class="prod-title" onclick="window.location.href='appliance_details_page.html?id=${product.id}'">${product.name}</h3>
            <div class="prod-meta" style="margin-bottom:8px; font-size:12px; color:#777;">
                 <i data-lucide="star" size="12" fill="${starColor}" color="${starColor}"></i>
                 ${product.rating || 0} (${product.reviews || 0})
            </div>
            <div class="prod-price">
                <span class="current-price">${formatPrice(product.price)}</span>
                <span style="font-size:12px;">UZS</span>
            </div>
            
            <div class="prod-actions-row" style="display:flex; gap:8px; margin-top:10px; align-items:center;">
                <div class="cart-action-container" id="card-action-${product.id}" style="flex:1;"></div>
                <button class="wishlist-btn-inline active" id="btn-wish-${product.id}">
                    <i data-lucide="heart" fill="white"></i>
                </button>
            </div>
        </div>
    `;

    // Render Smart Button
    const actionContainer = cardWrapper.querySelector(`#card-action-${product.id}`);
    renderSmartButton(product.id, actionContainer);

    // Wishlist Logic (Remove)
    const wishBtn = cardWrapper.querySelector(`#btn-wish-${product.id}`);
    if (wishBtn) {
        wishBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.WishlistManager) {
                window.WishlistManager.toggleLike(product.id);
                // The event listener 'wishlistChanged' will trigger re-render
            }
        };
    }

    // Image Cycling Logic
    const imgBox = cardWrapper.querySelector('.prod-img-box');
    const images = cardWrapper.querySelectorAll('.product-image');
    if (images.length > 1) {
        let currentIndex = 0;
        let cycleInterval = null;

        imgBox.addEventListener('mouseenter', () => {
            currentIndex = 0;
            cycleInterval = setInterval(() => {
                images[currentIndex].style.display = 'none';
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].style.display = 'block';
            }, 800);
        });

        imgBox.addEventListener('mouseleave', () => {
            clearInterval(cycleInterval);
            images.forEach((img, idx) => {
                img.style.display = idx === 0 ? 'block' : 'none';
            });
        });
    }

    return cardWrapper;
}

function renderSmartButton(productId, container) {
    if (!window.CartManager) return;
    const qty = window.CartManager.getItemQuantity(productId);

    if (qty > 0) {
        container.innerHTML = `
            <div class="quantity-controls" style="width:100%; height:40px; border-radius:8px;">
                <button class="qty-btn qty-minus"><i data-lucide="minus" size="16"></i></button>
                <div class="qty-display">${qty}</div>
                <button class="qty-btn qty-plus"><i data-lucide="plus" size="16"></i></button>
            </div>
        `;
        container.querySelector('.qty-minus').onclick = (e) => {
            e.preventDefault(); window.CartManager.decrementItem(productId);
        };
        container.querySelector('.qty-plus').onclick = (e) => {
            e.preventDefault(); window.CartManager.incrementItem(productId);
        };
    } else {
        container.innerHTML = `
            <button class="btn-cart-add" style="width:100%; height:40px;">
                <i data-lucide="shopping-cart" size="16"></i> Add to Cart
            </button>
        `;
        container.querySelector('.btn-cart-add').onclick = (e) => {
            e.preventDefault(); window.CartManager.addItem(productId, 1);
        };
    }
}

function formatPrice(price) {
    return price.toLocaleString('ru-RU').replace(/,/g, ' ');
}


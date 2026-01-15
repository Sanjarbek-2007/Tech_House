/**
 * product_details.js
 * Clean rewrite handling product display, galleries, and smart cart interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 2. Load Product Data
    if (!productId || !window.products) {
        document.querySelector('.product-container').innerHTML = '<h2>Product not found</h2>';
        return;
    }

    const currentProduct = window.products.find(p => p.id == productId) || window.products[0]; // Fallback purely for dev safety

    if (currentProduct) {
        renderProductDetails(currentProduct);
        setupImageGallery(currentProduct);
        renderRelatedProducts(currentProduct);
        setupStickyBar(currentProduct);
        setupTabs();
    }
});

/**
 * Initialize Smart Buttons on main card and related
 */
function initializeSmartCartButtons(productId) {
    // 1. Initial State for Main "Add to Cart" button
    updateMainCartButton(productId);

    // 2. Wiring up the "Main" Wishlist Button
    const mainWishlistBtn = document.querySelector('.action-section .wishlist-btn');
    if (mainWishlistBtn && window.WishlistManager) {
        // Initial state
        if (window.WishlistManager.isLiked(productId)) {
            mainWishlistBtn.classList.add('active');
            // Ensure icons are filled/white if needed by CSS
            // If CSS sets color:white on active, we might not need to mess with SVG fill explicitly
            // But if Lucide icons need fill, we do it here.
            // Based on CSS: .wishlist-btn.active { color: white; background: red; } 
            // This usually handles the icon stroke. If we want fill, we modify the SVG.
            const icon = mainWishlistBtn.querySelector('svg');
            if (icon) icon.setAttribute('fill', 'white');
        }

        // Click handler
        mainWishlistBtn.onclick = (e) => {
            e.preventDefault();
            const nowLiked = window.WishlistManager.toggleLike(productId);
            if (nowLiked) {
                mainWishlistBtn.classList.add('active');
                const icon = mainWishlistBtn.querySelector('svg');
                if (icon) icon.setAttribute('fill', 'white');
            } else {
                mainWishlistBtn.classList.remove('active');
                const icon = mainWishlistBtn.querySelector('svg');
                if (icon) icon.setAttribute('fill', 'none');
            }
        };
    }

    // 3. Listen for global cart changes to update UI
    window.addEventListener('cartChanged', (e) => {
        if (e.detail.productId === productId) {
            updateMainCartButton(productId);
        }
    });
}

function updateMainCartButton(productId) {
    if (!window.CartManager) return;
    const qty = window.CartManager.getItemQuantity(productId);

    // We toggle between "Add to Cart" button and "Quantity Selector"
    const addBtn = document.querySelector('.add-to-cart-btn');
    const qtySelector = document.querySelector('.quantity-selector');
    const qtyInput = document.getElementById('quantity');

    if (qty > 0) {
        // Item is in cart -> Show Quantity Selector
        if (addBtn) addBtn.style.display = 'none';

        if (qtySelector) {
            qtySelector.style.display = 'flex';
            // Update the input value to match cart
            if (qtyInput) qtyInput.value = qty;
        }

        // Setup manual buttons to call CartManager
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');

        if (decreaseBtn) {
            decreaseBtn.onclick = () => window.CartManager.decrementItem(productId);
        }
        if (increaseBtn) {
            increaseBtn.onclick = () => window.CartManager.incrementItem(productId);
        }

    } else {
        // Item NOT in cart -> Show Add Button
        if (qtySelector) qtySelector.style.display = 'none';

        if (addBtn) {
            addBtn.style.display = 'flex';
            // Ensure click adds to cart
            addBtn.onclick = () => {
                window.CartManager.addItem(productId, 1);
            };
        }
    }
}

/**
 * Render basic product info
 */
function renderProductDetails(product) {
    const title = product.name || product.title || "Product Details";
    document.title = `${title} - Premium Appliances`;
    document.getElementById('product-title').textContent = title;
    document.getElementById('product-sku').textContent = `SKU: ${product.id.toString().padStart(6, '0')}`;

    // Price formatting
    const priceEl = document.getElementById('product-price');
    priceEl.textContent = formatPrice(product.price);

    // Description
    const descEl = document.getElementById('product-description');
    descEl.textContent = product.description || "Experience premium quality with this state-of-the-art appliance. Designed for efficiency and durability.";

    // Populate Tab Description
    const tabDesc = document.getElementById('tab-description-text');
    if (tabDesc) {
        tabDesc.textContent = product.description || "This premium appliance combines cutting-edge technology with elegant design. Built to last and engineered for exceptional performance, it's the perfect addition to any modern home. Energy-efficient operation ensures lower utility costs while delivering outstanding results every time.";
    }

    // Populate Specifications
    const brandEl = document.getElementById('spec-brand');
    const categoryEl = document.getElementById('spec-category');
    const modelEl = document.getElementById('spec-model');

    if (brandEl) brandEl.textContent = product.brand || 'Premium Brand';
    if (categoryEl) categoryEl.textContent = product.category || 'Appliance';
    if (modelEl) modelEl.textContent = product.name || product.title;

    // Manual Quantity Selector Logic
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const qtyInput = document.getElementById('quantity');

    if (decreaseBtn && increaseBtn && qtyInput) {
        decreaseBtn.onclick = () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
        };
        increaseBtn.onclick = () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val < 10) qtyInput.value = val + 1;
        };
    }

    // Initialize smart cart and wishlist buttons
    initializeSmartCartButtons(product.id);
}

/**
 * Image Gallery Setup
 */
function setupImageGallery(product) {
    const mainImg = document.getElementById('main-product-image');
    const thumbContainer = document.querySelector('.thumbnail-gallery');

    // Normalize images
    let images = [];
    if (Array.isArray(product.images) && product.images.length > 0) images = product.images;
    else if (product.image) images = Array.isArray(product.image) ? product.image : [product.image];
    else images = ['../photos/placeholder.png']; // Fallback

    // Set Main
    if (mainImg) mainImg.src = images[0];

    // Render Thumbs
    if (thumbContainer) {
        thumbContainer.innerHTML = '';
        images.forEach((imgSrc, idx) => {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${idx === 0 ? 'active' : ''}`;
            const img = document.createElement('img');
            img.src = imgSrc;
            thumb.appendChild(img);

            thumb.onclick = () => {
                // Update Main
                if (mainImg) {
                    mainImg.style.opacity = '0.5';
                    setTimeout(() => {
                        mainImg.src = imgSrc;
                        mainImg.style.opacity = '1';
                    }, 200);
                }
                // Update Active State
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            };
            thumbContainer.appendChild(thumb);
        });
    }

    // Sticky Img Sync
    const stickyImg = document.getElementById('sticky-img');
    if (stickyImg) stickyImg.src = images[0];
}

/**
 * Smart Cart Buttons (Main & Sticky)
 */
function initializeSmartCartButtons(productId) {
    // Initial Render
    renderSmartControls(productId);

    // Wishlist Button - Re-select safely
    const mainWishlistBtn = document.querySelector('.action-section .wishlist-btn');
    if (mainWishlistBtn) {
        // Explicitly remove clone to clear listeners if needed, or just re-assign onclick
        // Using onclick is safer against multiple bindings here
        mainWishlistBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation(); // Stop bubbling

            if (window.WishlistManager) {
                const nowLiked = window.WishlistManager.toggleLike(productId);
                if (nowLiked) {
                    mainWishlistBtn.classList.add('active');
                } else {
                    mainWishlistBtn.classList.remove('active');
                }
            } else {
                console.error("WishlistManager not found");
            }
        };

        // Set Initial State
        if (window.WishlistManager && window.WishlistManager.isLiked(productId)) {
            mainWishlistBtn.classList.add('active');
        }
    }

    // Listen for global cart changes to update UI
    window.addEventListener('cartChanged', (e) => {
        // Only update if relevant (optional optimization)
        renderSmartControls(productId);
    });
}

/**
 * Render smart buttons for main product
 * Uses the new ".btn-cart-add-main" style (Red)
 */
function renderSmartControls(productId) {
    if (!window.CartManager) return;
    const quantity = window.CartManager.getItemQuantity(productId);

    // --- MAIN ACTION SECTION ---
    const actionSection = document.querySelector('.action-section');
    if (actionSection) {
        // We need 2 containers: 1 for Cart Actions, 1 for Wishlist
        // If they don't exist, structure them.
        let cartContainer = document.getElementById('main-cart-actions-container');
        let wishlistContainer = document.querySelector('.wishlist-wrapper');

        // Initial Setup if not structure
        if (!cartContainer) {
            // Save existing wishlist button if needed, but easier to just rebuild layout
            const existingWishlist = actionSection.querySelector('.wishlist-btn');
            actionSection.innerHTML = ''; // Clear all

            cartContainer = document.createElement('div');
            cartContainer.id = 'main-cart-actions-container';
            cartContainer.style.flex = '1';
            actionSection.appendChild(cartContainer);

            // Re-append Wishlist
            if (existingWishlist) {
                actionSection.appendChild(existingWishlist);
            } else {
                const newWishlist = document.createElement('button');
                newWishlist.className = 'wishlist-btn';
                newWishlist.innerHTML = '<i data-lucide="heart"></i>';
                actionSection.appendChild(newWishlist);
            }
        }

        // Render Cart Button logic
        if (quantity > 0) {
            cartContainer.innerHTML = `
                <div class="quantity-controls-main">
                    <button class="qty-btn-main qty-minus"><i data-lucide="minus"></i></button>
                    <div class="qty-display-main">${quantity}</div>
                    <button class="qty-btn-main qty-plus"><i data-lucide="plus"></i></button>
                </div>
            `;
            // Events
            cartContainer.querySelector('.qty-minus').onclick = () => window.CartManager.decrementItem(productId);
            cartContainer.querySelector('.qty-plus').onclick = () => window.CartManager.incrementItem(productId);

        } else {
            cartContainer.innerHTML = `
                <button class="btn-cart-add-main">
                    <i data-lucide="shopping-cart"></i> Add to Cart
                </button>
            `;
            cartContainer.querySelector('.btn-cart-add-main').onclick = () => window.CartManager.addItem(productId, 1);
        }

        // Re-bind Wishlist logic if lost (safer to do in initialize, but check here)
        const wishlistBtn = actionSection.querySelector('.wishlist-btn');
        if (wishlistBtn) wishlistBtn.style.display = 'flex';
    }


    // --- STICKY BAR ---
    // Make sticky bar show: Photo | Name | Price | [Add to Cart]
    const stickyRight = document.querySelector('.sticky-right');
    if (stickyRight) {
        // Clear old sticky button if present directly
        const oldStickyBtn = stickyRight.querySelector('.sticky-cart-btn');
        if (oldStickyBtn) oldStickyBtn.remove();

        let stickySmart = document.getElementById('sticky-smart-wrapper');
        if (!stickySmart) {
            stickySmart = document.createElement('div');
            stickySmart.id = 'sticky-smart-wrapper';
            stickyRight.appendChild(stickySmart);
        }

        if (quantity > 0) {
            stickySmart.innerHTML = `
                <div class="quantity-controls-main" style="height:40px; border-radius:30px; min-width:120px; padding:2px;">
                    <button class="qty-btn-main" style="width:32px; height:32px;"><i data-lucide="minus" size="16"></i></button>
                    <div class="qty-display-main" style="font-size:1rem;">${quantity}</div>
                    <button class="qty-btn-main" style="width:32px; height:32px;"><i data-lucide="plus" size="16"></i></button>
                </div>
            `;
            stickySmart.querySelector('.qty-btn-main:first-child').onclick = () => window.CartManager.decrementItem(productId);
            stickySmart.querySelector('.qty-btn-main:last-child').onclick = () => window.CartManager.incrementItem(productId);
        } else {
            stickySmart.innerHTML = `
                <button class="btn-cart-add-main" style="height:40px; font-size:0.9rem; min-width:140px;">
                    Add to Cart
                </button>
            `;
            stickySmart.querySelector('.btn-cart-add-main').onclick = () => window.CartManager.addItem(productId, 1);
        }
    }

    if (window.lucide) window.lucide.createIcons();
}

/**
 * Related Products Scroller - Homepage Style
 */
function renderRelatedProducts(currentProduct) {
    const container = document.getElementById('related-products-scroller');
    if (!container) return;

    // Filter by Category, Exclude current
    const related = window.products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id);
    // Limit to 8
    const toShow = related.slice(0, 8);

    if (toShow.length === 0) {
        document.querySelector('.related-section').style.display = 'none';
        return;
    }

    // Generate HTML
    const track = document.createElement('div');
    track.className = 'snap-track';

    toShow.forEach(p => {
        const card = createRelatedProductCard(p);
        track.appendChild(card);
    });

    // Nav Buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn btn-prev';
    prevBtn.innerHTML = '<i data-lucide="chevron-left"></i>';
    prevBtn.onclick = () => track.scrollBy({ left: -300, behavior: 'smooth' });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn btn-next';
    nextBtn.innerHTML = '<i data-lucide="chevron-right"></i>';
    nextBtn.onclick = () => track.scrollBy({ left: 300, behavior: 'smooth' });

    container.innerHTML = '';
    container.appendChild(prevBtn);
    container.appendChild(track);
    container.appendChild(nextBtn);

    // Init icons
    if (window.lucide) window.lucide.createIcons();
}

/**
 * Create Related Product Card (Homepage Style)
 */
function createRelatedProductCard(product) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-item';

    // Get all images
    let productImages = [];
    if (product.images) {
        productImages = product.images;
    } else if (product.image) {
        productImages = Array.isArray(product.image) ? product.image : [product.image];
    }

    // Image content with cycling support
    let imageContent = '';
    if (productImages.length > 0 && productImages[0]) {
        imageContent = `<img src="${productImages[0]}" alt="${product.name || product.title}" class="product-image">`;

        // Add hidden images for cycling
        if (productImages.length > 1) {
            for (let i = 1; i < productImages.length; i++) {
                imageContent += `<img src="${productImages[i]}" alt="${product.name || product.title}" class="product-image" style="display:none;">`;
            }
        }
    } else {
        imageContent = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:#aaa;"><i data-lucide="package" size="48"></i></div>`;
    }

    // Badge HTML
    let badgeHTML = '';
    if (product.badge) {
        badgeHTML = `<div class="product-badge ${product.badge.type}">${product.badge.text}</div>`;
    }

    // Star color
    const starColor = product.rating > 0 ? '#fbc02d' : '#ddd';
    const reviewText = product.reviews > 0 ? `(${product.reviews})` : '(0)';

    cardWrapper.innerHTML = `
        <div class="product-card" style="cursor:pointer;" data-product-id="${product.id}">
            <div class="prod-img-box">
                ${imageContent}
                ${badgeHTML}
            </div>
            <div class="prod-details" style="flex:1; display:flex; flex-direction:column;">
                <h3 class="prod-title">${product.name || product.title}</h3>
                <div class="prod-meta" style="margin-bottom:8px; font-size:12px; color:#777;">
                    <i data-lucide="star" size="12" fill="${starColor}" color="${starColor}"></i>
                    ${product.rating || 0} ${reviewText}
                </div>
                <div class="prod-price">
                    <span class="current-price" style="font-size:16px; font-weight:700;">${formatPrice(product.price)}</span>
                    <span style="font-size:12px;">UZS</span>
                </div>
                
                <!-- Action Row -->
                <div class="prod-actions-row" style="display:flex; gap:8px; margin-top:10px; align-items:center;">
                    <div class="cart-action-container" id="related-actions-${product.id}" style="flex:1;">
                        <!-- Smart button rendered here -->
                    </div>
                    <button class="wishlist-btn-inline" id="wishlist-rel-${product.id}" onclick="event.preventDefault(); event.stopPropagation();">
                        <i data-lucide="heart" size="20"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Render smart button
    const actionsContainer = cardWrapper.querySelector(`#related-actions-${product.id}`);
    renderRelatedCardButton(product.id, actionsContainer);

    // Setup wishlist button
    const wishlistBtn = cardWrapper.querySelector(`#wishlist-rel-${product.id}`);
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

    // Image cycling on hover
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

    // Card click to navigate
    const productCard = cardWrapper.querySelector('.product-card');
    productCard.onclick = (e) => {
        // Don't navigate if clicking on buttons
        if (e.target.closest('button')) return;
        window.location.href = `appliance_details_page.html?id=${product.id}`;
    };

    return cardWrapper;
}

/**
 * Render smart cart button for related product cards
 */
function renderRelatedCardButton(productId, container) {
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

// Listen for cart changes to update related product buttons
window.addEventListener('cartChanged', () => {
    // Re-render related products to update all button states
    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('id');
    const p = window.products.find(x => x.id == pid);
    if (p) renderRelatedProducts(p);
});


/**
 * Sticky Bar Scroll Logic
 */
function setupStickyBar(product) {
    const bar = document.getElementById('stickyBar');

    // 1. Populate Content
    const stickyImg = document.getElementById('sticky-img');
    const stickyTitle = document.getElementById('sticky-title');
    const stickyPrice = document.getElementById('sticky-price');

    if (stickyTitle) stickyTitle.textContent = product.title || product.name;
    if (stickyPrice) stickyPrice.textContent = formatPrice(product.price);

    if (stickyImg) {
        let imgSrc = product.image;
        if (Array.isArray(product.images) && product.images.length > 0) imgSrc = product.images[0];
        else if (Array.isArray(product.image) && product.image.length > 0) imgSrc = product.image[0];
        // Handle relative paths if needed, though usually data has full or relative correct paths
        stickyImg.src = imgSrc;
    }

    // 2. Scroll Logic
    // Trigger when the main action section scrolls out of view
    const trigger = document.querySelector('.action-section') || document.querySelector('.product-container');

    window.addEventListener('scroll', () => {
        if (!trigger || !bar) return;
        const rect = trigger.getBoundingClientRect();

        // Show sticky bar when the action section hits the top of viewport or is scrolled past
        if (rect.bottom < 80) {
            bar.classList.add('visible');
        } else {
            bar.classList.remove('visible');
        }
    });
}

function setupTabs() {
    const triggers = document.querySelectorAll('.tab-btn');
    triggers.forEach(t => {
        t.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            const target = document.getElementById(t.dataset.tab);
            if (target) target.classList.add('active');
        };
    });
}

function formatPrice(price) {
    return price.toLocaleString() + ' UZS';
}

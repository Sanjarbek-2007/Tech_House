/**
 * Appliances Catalog Logic with Advanced Filtering, Sorting & Pagination
 * 
 * Features:
 * - Dynamic Metadata Extraction (Brands, Categories, Badges)
 * - Multi-select Filtering
 * - Dual Price Slider
 * - Star Rating Filter
 * - State Management
 * - URL Parameter Sync
 */

// Expose toggleMenu globally
window.toggleMenu = function () {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const productGrid = document.querySelector('.product-grid');
    const paginationContainer = document.querySelector('.pagination');
    const pageTitle = document.getElementById('pageTitle');
    const breadcrumbs = document.getElementById('breadcrumbs');

    // Sidebar Filter Containers
    const categoryContainer = document.getElementById('categoryFilters');
    const badgeContainer = document.getElementById('badgeFilters');
    const brandContainer = document.getElementById('brandFilters');
    const ratingContainer = document.getElementById('ratingFilters');
    const featureContainer = document.getElementById('featureFilters');

    // Inputs
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    const sortSelect = document.getElementById('sortSelect');
    const searchForm = document.querySelector('.search-form');
    const clearAllBtn = document.getElementById('clearAllFilters');

    // Slider Elements
    const rangeMin = document.querySelector('.range-min');
    const rangeMax = document.querySelector('.range-max');
    const sliderTrack = document.querySelector('.slider-track');


    // State
    const state = {
        allProducts: [],
        currentProducts: [],
        metadata: {
            categories: {},
            brands: {},
            badges: {},
            features: {}
        },
        filters: {
            categories: [], // Multi-select
            search: '',
            price: { min: 0, max: 10000000 }, // Default max
            brands: [],
            badges: [],
            rating: 0, // 0 = any, 3 = 3+, etc.
            features: []
        },
        sort: 'popular',
        pagination: {
            page: 1,
            limit: 20
        }
    };

    // Initialize
    init();

    function init() {
        if (!window.products) {
            console.error("Products data not loaded!");
            return;
        }

        state.allProducts = [...window.products];

        // 1. Extract Metadata (Categories, Brands, etc.) for dynamic counts
        extractMetadata();

        // 2. Parse URL Params (moved before render so checkboxes can be checked)
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        const searchParam = urlParams.get('search');

        if (categoryParam) {
            state.filters.categories = [categoryParam];
            pageTitle.innerText = categoryParam;
            breadcrumbs.innerText = `Home / Appliances / ${categoryParam}`;
        }

        if (searchParam) {
            state.filters.search = searchParam;
            pageTitle.innerText = `Search results for "${searchParam}"`;
            breadcrumbs.innerText = `Home / Search / ${searchParam}`;
        }

        // 3. Build Dynamic UI
        renderFilters();

        // 4. Setup Event Listeners
        setupEventListeners();

        // 5. Initial Application
        applyFilters();
    }

    function extractMetadata() {
        // Reset counts
        const meta = { categories: {}, brands: {}, badges: {}, features: {} };

        // Pre-defined known features to look for
        const knownFeatures = ['Smart Control', 'Energy Saving', 'Silent Mode', 'Extended Warranty', 'Inverter'];

        state.allProducts.forEach(p => {
            // Category
            meta.categories[p.category] = (meta.categories[p.category] || 0) + 1;

            // Brand
            meta.brands[p.brand] = (meta.brands[p.brand] || 0) + 1;

            // Badge
            if (p.badge) {
                const badgeType = p.badge.type; // Use type for better grouping (e.g. "discount" covers all % offs)
                // Capitalize for display
                const label = badgeType.charAt(0).toUpperCase() + badgeType.slice(1);

                // We store ID as type, but need a map for labels if we want to be fancy. 
                // For simplicity, let's just use the type as the key in metadata, but maybe store label?
                // Actually, metadata keys are the displayed options usually in this simple implementation.
                // Let's store by Label to make the UI list pretty.

                meta.badges[label] = (meta.badges[label] || 0) + 1;
            }

            // Features (Simple scan of description/specs)
            const text = (p.description + JSON.stringify(p.specs || {})).toLowerCase();
            knownFeatures.forEach(feat => {
                if (text.includes(feat.toLowerCase())) {
                    meta.features[feat] = (meta.features[feat] || 0) + 1;
                }
            });
        });

        state.metadata = meta;
    }

    function renderFilters() {
        // Helper to create checkbox
        const createCheckbox = (label, value, count, group) => {
            // Check if this value is currently active in state
            let isActive = false;

            if (group === 'categories') isActive = state.filters.categories.includes(value);
            else if (group === 'brands') isActive = state.filters.brands.includes(value);
            else if (group === 'features') isActive = state.filters.features.includes(value);
            else if (group === 'badges') isActive = state.filters.badges.includes(value);

            return `
            <label class="checkbox-label">
                <input type="checkbox" value="${value}" data-group="${group}" ${isActive ? 'checked' : ''}>
                ${label}
                <span class="filter-count">(${count})</span>
            </label>
        `};

        // 1. Categories
        if (categoryContainer) {
            const cats = Object.keys(state.metadata.categories).sort();
            categoryContainer.innerHTML = cats.map(c =>
                createCheckbox(c, c, state.metadata.categories[c], 'categories')
            ).join('');
        }

        // 2. Badges
        if (badgeContainer) {
            const badges = Object.keys(state.metadata.badges).sort();
            if (badges.length > 0) {
                badgeContainer.innerHTML = badges.map(b =>
                    createCheckbox(b, b, state.metadata.badges[b], 'badges')
                ).join('');
                badgeContainer.closest('.filter-group').style.display = 'block';
            } else {
                badgeContainer.closest('.filter-group').style.display = 'none';
            }
        }

        // 3. Brands
        if (brandContainer) {
            const brands = Object.keys(state.metadata.brands).sort();
            brandContainer.innerHTML = brands.map(b =>
                createCheckbox(b, b, state.metadata.brands[b], 'brands')
            ).join('');
        }

        // 4. Features
        if (featureContainer) {
            const feats = Object.keys(state.metadata.features).sort();
            featureContainer.innerHTML = feats.map(f =>
                createCheckbox(f, f, state.metadata.features[f], 'features')
            ).join('');
        }

        // 5. Ratings
        if (ratingContainer) {
            ratingContainer.innerHTML = [4, 3, 2, 1].map(r => `
                <label class="checkbox-label radio-label">
                    <input type="radio" name="rating" value="${r}">
                    <div style="display:flex; gap:2px;">
                        ${Array(5).fill(0).map((_, i) =>
                `<i data-lucide="star" size="14" fill="${i < r ? '#fbc02d' : '#eee'}" color="${i < r ? '#fbc02d' : '#ddd'}"></i>`
            ).join('')}
                    </div>
                    <span style="font-size:12px; color:#777; margin-left:4px;">& Up</span>
                </label>
            `).join('');

            // Re-init stars
            if (window.lucide) {
                // Lucide createIcons runs on document usually, we might need to run it specifically here if not auto-caught
                setTimeout(() => lucide.createIcons(), 0);
            }
        }
    }

    function setupEventListeners() {
        // Sort
        sortSelect.addEventListener('change', (e) => {
            state.sort = e.target.value;
            applySort();
        });

        // Price SLIDER Logic
        const minGap = 100000;
        const sliderMax = 10000000; // 10M UZS default max for slider

        function updateSliderTrack() {
            const minVal = parseInt(rangeMin.value);
            const maxVal = parseInt(rangeMax.value);
            const percent1 = (minVal / sliderMax) * 100;
            const percent2 = (maxVal / sliderMax) * 100;
            sliderTrack.style.background = `linear-gradient(to right, #ddd ${percent1}%, #0823c8 ${percent1}%, #0823c8 ${percent2}%, #ddd ${percent2}%)`;
        }

        rangeMin.addEventListener('input', (e) => {
            let minVal = parseInt(rangeMin.value);
            let maxVal = parseInt(rangeMax.value);
            if (maxVal - minVal < minGap) {
                rangeMin.value = maxVal - minGap;
            }
            priceMinInput.value = rangeMin.value;
            updateSliderTrack();
            triggerPriceUpdate();
        });

        rangeMax.addEventListener('input', (e) => {
            let minVal = parseInt(rangeMin.value);
            let maxVal = parseInt(rangeMax.value);
            if (maxVal - minVal < minGap) {
                rangeMax.value = minVal + minGap;
            }
            priceMaxInput.value = rangeMax.value;
            updateSliderTrack();
            triggerPriceUpdate();
        });

        // Price Inputs
        priceMinInput.addEventListener('change', () => {
            let val = parseInt(priceMinInput.value) || 0;
            if (val > parseInt(rangeMax.value) - minGap) val = parseInt(rangeMax.value) - minGap;
            rangeMin.value = val;
            updateSliderTrack();
            triggerPriceUpdate();
        });

        priceMaxInput.addEventListener('change', () => {
            let val = parseInt(priceMaxInput.value) || sliderMax;
            if (val < parseInt(rangeMin.value) + minGap) val = parseInt(rangeMin.value) + minGap;
            rangeMax.value = val;
            updateSliderTrack();
            triggerPriceUpdate();
        });

        function triggerPriceUpdate() {
            state.filters.price.min = parseInt(rangeMin.value);
            state.filters.price.max = parseInt(rangeMax.value);
            state.pagination.page = 1;
            updateClearAllVisibility();
            applyFilters();
        }

        // Initialize Slider
        updateSliderTrack();


        // Generic Checkbox Handlers (Categories, Brands, Features, Badges)
        [categoryContainer, brandContainer, featureContainer, badgeContainer].forEach(container => {
            if (!container) return;
            container.addEventListener('change', (e) => {
                const group = e.target.getAttribute('data-group'); // categories, brands, etc.
                if (!group) return;

                const checked = Array.from(container.querySelectorAll('input:checked')).map(cb => cb.value);
                state.filters[group] = checked;
                state.pagination.page = 1;

                updateClearAllVisibility();
                applyFilters();
            });
        });

        // Rating Handler
        if (ratingContainer) {
            ratingContainer.addEventListener('change', (e) => {
                state.filters.rating = parseInt(e.target.value);
                state.pagination.page = 1;
                updateClearAllVisibility();
                applyFilters();
            });
        }

        // Clear All
        if (clearAllBtn) {
            clearAllBtn.onclick = () => {
                // Reset State
                state.filters.categories = [];
                state.filters.brands = [];
                state.filters.badges = [];
                state.filters.features = [];
                state.filters.rating = 0;
                state.filters.price = { min: 0, max: 10000000 };
                state.filters.search = '';

                // Reset UI Inputs
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
                rangeMin.value = 0;
                rangeMax.value = 10000000;
                priceMinInput.value = 0;
                priceMaxInput.value = 10000000;
                updateSliderTrack();

                // Clear URL
                window.history.pushState({}, '', 'appliances_page.html');
                pageTitle.innerText = "All Products";
                breadcrumbs.innerText = "Home / Appliances / All";

                updateClearAllVisibility();
                applyFilters();
            };
        }

        // Search Form Override
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = searchForm.querySelector('input');
                const query = input.value.trim();

                const newUrl = new URL(window.location);
                newUrl.searchParams.set('search', query);
                newUrl.searchParams.delete('category');
                window.history.pushState({}, '', newUrl);

                state.filters.categories = []; // Search overrides category usually, or keep them? Resetting creates clarity.
                state.filters.search = query;
                state.pagination.page = 1;

                pageTitle.innerText = `Search results for "${query}"`;
                breadcrumbs.innerText = `Home / Search / ${query}`;

                // Uncheck category boxes
                if (categoryContainer) {
                    categoryContainer.querySelectorAll('input').forEach(cb => cb.checked = false);
                }

                updateClearAllVisibility();
                applyFilters();
            });
        }
    }

    function updateClearAllVisibility() {
        const hasFilters =
            state.filters.categories.length > 0 ||
            state.filters.brands.length > 0 ||
            state.filters.badges.length > 0 ||
            state.filters.features.length > 0 ||
            state.filters.rating > 0 ||
            state.filters.price.min > 0 ||
            state.filters.price.max < 10000000 ||
            state.filters.search.length > 0;

        if (clearAllBtn) clearAllBtn.style.display = hasFilters ? 'block' : 'none';
    }

    // Toggle Filter Groups
    window.toggleFilterGroup = function (header) {
        header.closest('.filter-group').classList.toggle('collapsed');
    };

    function applyFilters() {
        let filtered = state.allProducts;

        // 1. Category Filter (Multi-select)
        if (state.filters.categories.length > 0) {
            filtered = filtered.filter(p => state.filters.categories.includes(p.category));
        }

        // 2. Search Filter
        if (state.filters.search) {
            const q = state.filters.search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q)
            );
        }

        // 3. Price Filter
        filtered = filtered.filter(p => p.price >= state.filters.price.min && p.price <= state.filters.price.max);

        // 4. Brand Filter
        if (state.filters.brands.length > 0) {
            filtered = filtered.filter(p => state.filters.brands.includes(p.brand));
        }

        // 5. Badge Filter
        if (state.filters.badges.length > 0) {
            filtered = filtered.filter(p => {
                if (!p.badge) return false;
                // We are filtering by Label (e.g., "New"), so we check if type matches
                // Our inputs values are the Capitalized Labels (New, Sale, etc.)
                // p.badge.type is lowercase (new, sale).
                return state.filters.badges.some(b => b.toLowerCase() === p.badge.type.toLowerCase());
            });
        }

        // 6. Rating Filter
        if (state.filters.rating > 0) {
            filtered = filtered.filter(p => p.rating >= state.filters.rating);
        }

        // 7. Feature Filter
        if (state.filters.features.length > 0) {
            filtered = filtered.filter(p => {
                const text = (p.description + JSON.stringify(p.specs)).toLowerCase();
                return state.filters.features.some(f => text.includes(f.toLowerCase()));
            });
        }

        state.currentProducts = filtered;
        applySort();
    }

    function applySort() {
        const products = [...state.currentProducts];
        const sortType = state.sort;

        if (sortType === 'price-asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sortType === 'price-desc') {
            products.sort((a, b) => b.price - a.price);
        } else if (sortType === 'new') {
            products.sort((a, b) => {
                const aNew = a.badge && a.badge.type === 'new' ? 1 : 0;
                const bNew = b.badge && b.badge.type === 'new' ? 1 : 0;
                return bNew - aNew;
            });
        } else {
            // Popular (default)
            products.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
        }

        state.currentProducts = products;
        render();
    }

    function render() {
        productGrid.innerHTML = '';

        if (state.currentProducts.length === 0) {
            productGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align:center; padding: 40px;">
                    <i data-lucide="search-x" style="width:48px; height:48px; color:#ccc; margin-bottom:10px;"></i>
                    <h3>No products found</h3>
                    <p style="color:#666">Try adjusting your filters.</p>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            paginationContainer.innerHTML = '';
            return;
        }

        const totalItems = state.currentProducts.length;
        const totalPages = Math.ceil(totalItems / state.pagination.limit);
        if (state.pagination.page > totalPages) state.pagination.page = 1;

        const startIndex = (state.pagination.page - 1) * state.pagination.limit;
        const endIndex = startIndex + state.pagination.limit;
        const productsToShow = state.currentProducts.slice(startIndex, endIndex);

        productsToShow.forEach(product => {
            productGrid.appendChild(createProductCard(product));
        });

        renderPagination(totalPages);
        if (window.lucide) lucide.createIcons();
    }

    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const createBtn = (text, onClick, isActive = false) => {
            const btn = document.createElement('button');
            btn.className = `page-btn ${isActive ? 'active' : ''}`;
            btn.innerText = text;
            btn.onclick = () => { onClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
            return btn;
        };

        if (state.pagination.page > 1) {
            paginationContainer.appendChild(createBtn('<', () => { state.pagination.page--; render(); }));
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.appendChild(createBtn(i, () => { state.pagination.page = i; render(); }, i === state.pagination.page));
        }

        if (state.pagination.page < totalPages) {
            paginationContainer.appendChild(createBtn('>', () => { state.pagination.page++; render(); }));
        }
    }

    function createProductCard(product) {
        const formattedPrice = product.price.toLocaleString('ru-RU').replace(/,/g, ' ');
        const cardLink = document.createElement('a');
        cardLink.href = `appliance_details_page.html?id=${product.id}`;
        cardLink.className = 'product-card-link';

        // Image Handling
        let imageContent = '';
        let productImages = product.images || (Array.isArray(product.image) ? product.image : [product.image]);

        // Clean paths if they start with /src/ in pages directory context (../)
        // Actually product data usually has full relative path. Assuming data is consistent for now or fixed by legacy logic.
        // Let's apply path fix just in case? 
        // No, let's stick to simple render unless broken.

        if (productImages.length > 0 && productImages[0]) {
            imageContent = `<img src="${productImages[0]}" alt="${product.name}" class="product-image">`;
            if (productImages.length > 1) {
                for (let i = 1; i < productImages.length; i++) {
                    imageContent += `<img src="${productImages[i]}" alt="${product.name}" class="product-image" style="display:none;">`;
                }
            }
        } else {
            imageContent = `<div class="image-placeholder-dynamic" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:#f8f9fa; color:#adb5bd;"><i data-lucide="package" width="48" height="48"></i></div>`;
        }

        const badgeHTML = product.badge ? `<div class="product-badge ${product.badge.type}">${product.badge.text}</div>` : '';
        const starColor = product.rating > 0 ? '#fbc02d' : '#ddd';
        const reviewText = product.reviews > 0 ? `(${product.reviews})` : '(0)';

        cardLink.innerHTML = `
            <div class="card-item product-card">
                <!-- Compare Button -->
                <button class="btn-compare" data-id="${product.id}" onclick="event.preventDefault(); event.stopPropagation(); CompareManager.toggle('${product.id}')" title="Compare">
                    <i data-lucide="scale" size="16"></i>
                </button>

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
                    <div class="prod-actions-row" style="display:flex; gap:8px; margin-top:10px; align-items:center;">
                        <div class="cart-action-container" id="cart-actions-${product.id}" style="flex:1;"></div>
                        <button class="wishlist-btn-inline" id="wishlist-${product.id}" onclick="event.preventDefault(); event.stopPropagation();">
                            <i data-lucide="heart" size="20"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Render Action Buttons
        const actionsContainer = cardLink.querySelector(`#cart-actions-${product.id}`);
        renderSmartButton(product.id, actionsContainer);

        // Wishlist Logic
        const wishlistBtn = cardLink.querySelector(`#wishlist-${product.id}`);
        if (wishlistBtn && window.WishlistManager) {
            if (window.WishlistManager.isLiked(product.id)) wishlistBtn.classList.add('active');
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                window.WishlistManager.toggleLike(product.id) ? wishlistBtn.classList.add('active') : wishlistBtn.classList.remove('active');
            });
        }

        // Image Cycling
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
                }, 800);
            });
            imgBox.addEventListener('mouseleave', () => {
                clearInterval(cycleInterval);
                images.forEach((img, idx) => img.style.display = idx === 0 ? 'block' : 'none');
            });
        }

        if (window.lucide) window.lucide.createIcons({ root: cardLink });
        return cardLink;
    }
});

function renderSmartButton(productId, container) {
    if (!container) return;
    const quantity = window.CartManager ? window.CartManager.getItemQuantity(productId) : 0;

    if (quantity > 0) {
        container.innerHTML = `
            <div class="quantity-controls">
                <button class="qty-btn qty-minus"><i data-lucide="minus" size="16"></i></button>
                <div class="qty-display">${quantity}</div>
                <button class="qty-btn qty-plus"><i data-lucide="plus" size="16"></i></button>
            </div>`;
        container.querySelector('.qty-minus').onclick = (e) => { e.preventDefault(); window.CartManager.decrementItem(productId); };
        container.querySelector('.qty-plus').onclick = (e) => { e.preventDefault(); window.CartManager.incrementItem(productId); };
    } else {
        container.innerHTML = `
            <button class="btn-cart-add">
                <i data-lucide="shopping-cart" size="16"></i> <span>Add to Cart</span>
            </button>`;
        container.querySelector('.btn-cart-add').onclick = (e) => {
            e.preventDefault();
            if (!window.Auth) { showToast("Auth system missing", "error"); return; }
            if (!window.Auth.getCurrentUser()) {
                showToast("Please login first", "warning");
                setTimeout(() => window.location.href = 'auth_page.html', 1000);
                return;
            }
            if (window.CartManager) window.CartManager.addItem(productId, 1);
        };
    }
    if (window.lucide) window.lucide.createIcons({ root: container });
}

// --- COMPARISON FEATURE LOGIC ---

const CompareManager = {
    STORAGE_KEY: 'shop_compare_list',

    // State
    items: [], // Array of product IDs

    init() {
        this.load();
        this.renderSidebar();
        this.updateButtons();
        // Render Sticky
        this.renderStickyTrigger();

        // Event Listeners
        const btn = document.getElementById('btnCompareNow');
        if (btn) btn.onclick = () => this.openModal();
    },

    load() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            this.items = JSON.parse(stored);
        }
    },

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
        this.renderSidebar();
        this.updateButtons();
        this.renderStickyTrigger();
    },

    updateButtons() {
        // Reset all first
        document.querySelectorAll('.btn-compare').forEach(btn => {
            btn.classList.remove('active');
            const icon = btn.querySelector('i');
            if (icon) {
                // Reset icon color
                // Actually CSS handles color for .active, but if Lucide set inline styles we might need to clear them or re-render
                // For simplified approach, we rely on CSS .btn-compare.active i { color: white }
            }
        });

        // Set Active
        this.items.forEach(id => {
            const btn = document.querySelector(`.btn-compare[data-id="${id}"]`);
            if (btn) btn.classList.add('active');
        });
    },

    // Sticky Trigger Logic
    renderStickyTrigger() {
        let trigger = document.getElementById('compareStickyTrigger');

        if (this.items.length === 0) {
            if (trigger) trigger.remove(); // Hide if empty
            return;
        }

        if (!trigger) {
            trigger = document.createElement('div');
            trigger.id = 'compareStickyTrigger';
            trigger.className = 'compare-sticky-trigger';
            trigger.onclick = () => window.toggleCompareSidebar();
            trigger.innerHTML = `
                <i data-lucide="scale" size="20"></i>
                <span class="compare-sticky-count" id="stickyCount">0</span>
            `;
            document.body.appendChild(trigger);
            if (window.lucide) window.lucide.createIcons();
        }

        const countSpan = document.getElementById('stickyCount');
        if (countSpan) countSpan.textContent = this.items.length;
    },

    toggle(productId) {
        const index = this.items.indexOf(productId);
        if (index > -1) {
            // Remove
            this.items.splice(index, 1);
            showToast("Removed from comparison", "info");
        } else {
            // Add (Limit 6)
            if (this.items.length >= 6) {
                showToast("Limit reached (Max 6). Remove an item first.", "warning");
                return;
            }
            this.items.push(productId);
            showToast("Added to comparison", "success");

            // Auto-open sidebar
            const sidebar = document.getElementById('compareSidebar');
            if (this.items.length > 0 && sidebar) {
                sidebar.classList.add('active');
            }
        }
        this.save();
    },

    remove(productId) {
        const index = this.items.indexOf(productId);
        if (index > -1) {
            this.items.splice(index, 1);
            this.save();
        }
    },

    getProducts() {
        return this.items.map(id => window.products.find(p => p.id === id)).filter(Boolean);
    },

    renderSidebar() {
        const container = document.getElementById('compareList');
        const countSpan = document.getElementById('compareCount');
        const products = this.getProducts();

        if (countSpan) countSpan.textContent = products.length;
        if (!container) return;

        container.innerHTML = '';

        const compareBtn = document.getElementById('btnCompareNow');
        if (products.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px; color:#999; display:flex; flex-direction:column; align-items:center; gap:10px;"><i data-lucide="scale" size="48" style="opacity:0.2"></i><p>Select products to compare</p></div>';
            if (compareBtn) compareBtn.disabled = true;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        if (compareBtn) compareBtn.disabled = false;

        products.forEach(p => {
            const div = document.createElement('div');
            div.className = 'compare-item';

            let img = p.image;
            if (Array.isArray(p.images) && p.images.length) img = p.images[0];
            else if (Array.isArray(p.image)) img = p.image[0];

            div.innerHTML = `
                <img src="${img}" alt="${p.name}">
                <div class="compare-item-info">
                    <div class="compare-item-name">${p.name}</div>
                    <div class="compare-item-cat">${p.category}</div>
                </div>
                <button class="compare-remove" onclick="CompareManager.remove('${p.id}')">
                    <i data-lucide="trash-2" size="16"></i>
                </button>
            `;
            container.appendChild(div);
        });

        if (window.lucide) window.lucide.createIcons();
    },

    updateButtons() {
        document.querySelectorAll('.btn-compare').forEach(btn => {
            const id = btn.dataset.id;
            if (this.items.includes(id)) {
                btn.classList.add('active');
                btn.style.background = 'var(--primary-color)';
                btn.style.color = 'white';
            } else {
                btn.classList.remove('active');
                btn.style.background = ''; // Reset
                btn.style.color = '';
            }
        });
    },

    openModal() {
        const modal = document.getElementById('compareModal');
        const tabsContainer = document.getElementById('compareTabs');
        const tableContainer = document.getElementById('compareTableContainer');

        const products = this.getProducts();
        if (products.length === 0) return;

        // Group by Category
        const groups = {};
        products.forEach(p => {
            if (!groups[p.category]) groups[p.category] = [];
            groups[p.category].push(p);
        });

        const categories = Object.keys(groups);

        // Render Tabs
        tabsContainer.innerHTML = '';
        categories.forEach((cat, idx) => {
            const tab = document.createElement('div');
            tab.className = `modal-tab ${idx === 0 ? 'active' : ''}`;
            tab.textContent = `${cat} (${groups[cat].length})`;
            tab.onclick = () => {
                document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderTable(groups[cat], tableContainer);
            };
            tabsContainer.appendChild(tab);
        });

        // Initial Table
        this.renderTable(groups[categories[0]], tableContainer);

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    renderTable(products, container) {
        if (!products || products.length === 0) return;

        const fields = [
            { label: 'Brand', key: 'brand' },
            { label: 'Price', key: 'price', format: (v) => v.toLocaleString() + ' UZS' },
            { label: 'Rating', key: 'rating', format: (v) => `${v} ★` },
        ];

        let html = '<table class="compare-table"><thead><tr><th>Feature</th>';

        products.forEach(p => {
            let img = Array.isArray(p.images) && p.images[0] ? p.images[0] : (Array.isArray(p.image) ? p.image[0] : p.image);
            html += `
                <th>
                    <img src="${img}" class="compare-prod-thumb" alt="">
                    <span class="compare-prod-title">${p.name}</span>
                    <div class="compare-prod-price">${p.price.toLocaleString()} UZS</div>
                    <button class="btn-cart-sm" style="margin-top:5px; width:100%; border:1px solid #ddd;" onclick="window.CartManager.addItem('${p.id}', 1); showToast('Added to Cart', 'success')">
                        Add to Cart
                    </button>
                </th>
            `;
        });
        html += '</tr></thead><tbody>';

        fields.forEach(field => {
            html += `<tr><td>${field.label}</td>`;
            products.forEach(p => {
                let val = p[field.key] || '-';
                if (field.format) val = field.format(val);
                html += `<td>${val}</td>`;
            });
            html += '</tr>';
        });

        html += `<tr><td>Description</td>`;
        products.forEach(p => {
            html += `<td style="font-size:0.85rem; color:#666;">${p.description || 'No description'}</td>`;
        });
        html += `</tr>`;

        html += '</tbody></table>';
        container.innerHTML = html;
    }
};

// Global Exposure
window.toggleCompareSidebar = () => {
    document.getElementById('compareSidebar').classList.toggle('active');
};

window.closeComparisonModal = () => {
    document.getElementById('compareModal').classList.remove('active');
    document.body.style.overflow = 'auto';
};

// Initialize CompareManager
document.addEventListener('DOMContentLoaded', () => {
    // Delay slightly to ensure product grid is rendered first
    setTimeout(() => CompareManager.init(), 100);
});

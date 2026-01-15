/**
 * Shopping Cart Manager
 * Handles Add/Remove items and updating UI
 * Depends on Auth.js and Products.js (window.products)
 */

const CartManager = {
    /**
     * Get unique key for current user's cart
     */
    getCartKey: () => {
        // Safety check: Make sure Auth is loaded
        if (!window.Auth) {
            console.warn('CartManager: Auth script not loaded yet, using guest cart');
            return 'shop_cart_guest';
        }

        const user = window.Auth.getCurrentUser();
        if (user) {
            console.log('CartManager: Using cart for user:', user.id);
            return `shop_cart_${user.id}`;
        }

        console.log('CartManager: No user logged in, using guest cart');
        return 'shop_cart_guest';
    },

    /**
     * Get all items in cart
     * @returns {Array} [{ productId, quantity }]
     */
    getCart: () => {
        const key = CartManager.getCartKey();
        return JSON.parse(localStorage.getItem(key) || '[]');
    },

    /**
     * Add item to cart
     * @param {string} productId 
     * @param {number} quantity 
     */
    addItem: (productId, quantity = 1) => {
        // Check if Auth is available and user is logged in
        if (!window.Auth) {
            showToast("Error: Authentication system not loaded", "error");
            return;
        }

        const user = window.Auth.getCurrentUser();
        if (!user) {
            showToast("Please create a profile first to start shopping!", "warning");
            // Determine correct path to auth page
            const isPages = window.location.pathname.includes('/pages/');
            const authPath = isPages ? 'auth_page.html' : 'src/pages/auth_page.html';
            setTimeout(() => window.location.href = authPath, 1500);
            return;
        }

        console.log('CartManager: Adding item for user:', user.name);
        const cart = CartManager.getCart();
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }

        CartManager.saveCart(cart);
        CartManager.updateBadge();
        CartManager.notifyCartChange(productId);

        // Show feedback
        CartManager.showToast('Item added to cart!');
    },

    /**
     * Remove item from cart
     * @param {string} productId 
     */
    removeItem: (productId) => {
        let cart = CartManager.getCart();
        cart = cart.filter(item => item.productId !== productId);
        CartManager.saveCart(cart);
        CartManager.updateBadge();
        CartManager.notifyCartChange(productId);
    },

    /**
     * Get quantity of a specific item in cart
     * @param {string} productId
     * @returns {number} quantity (0 if not in cart)
     */
    getItemQuantity: (productId) => {
        const cart = CartManager.getCart();
        const item = cart.find(i => i.productId === productId);
        return item ? item.quantity : 0;
    },

    /**
     * Increment item quantity by 1
     * @param {string} productId 
     */
    incrementItem: (productId) => {
        const cart = CartManager.getCart();
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ productId, quantity: 1 });
        }

        CartManager.saveCart(cart);
        CartManager.updateBadge();
        CartManager.notifyCartChange(productId);
    },

    /**
     * Decrement item quantity by 1 (removes if reaches 0)
     * @param {string} productId 
     */
    decrementItem: (productId) => {
        const cart = CartManager.getCart();
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity -= 1;
            if (existingItem.quantity <= 0) {
                CartManager.removeItem(productId);
            } else {
                CartManager.saveCart(cart);
                CartManager.updateBadge();
            }
            CartManager.notifyCartChange(productId);
        }
    },

    /**
     * Update item quantity
     */
    updateQuantity: (productId, newQty) => {
        let cart = CartManager.getCart();
        const item = cart.find(i => i.productId === productId);
        if (item) {
            item.quantity = parseInt(newQty);
            if (item.quantity <= 0) {
                CartManager.removeItem(productId);
                return;
            }
            CartManager.saveCart(cart);
            CartManager.updateBadge();
            CartManager.notifyCartChange(productId);
        }
    },

    /**
     * Notify all cart buttons of a change
     * @param {string} productId
     */
    notifyCartChange: (productId) => {
        console.log('CartManager: Notification for', productId);

        // 1. Dispatch Event (Standard)
        const event = new CustomEvent('cartChanged', {
            detail: {
                productId,
                quantity: CartManager.getItemQuantity(productId)
            }
        });
        window.dispatchEvent(event);

        // 2. Direct UI Update (Fallback/Reliable for same-page)
        if (typeof window.updateCartUI === 'function') {
            window.updateCartUI(productId, CartManager.getItemQuantity(productId));
        }
    },

    /**
     * Save cart to storage
     */
    saveCart: (cart) => {
        const key = CartManager.getCartKey();
        localStorage.setItem(key, JSON.stringify(cart));
    },

    /**
     * Update the Cart Badge in the header
     */
    updateBadge: () => {
        const cart = CartManager.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            if (totalItems > 0) {
                // Show badge
                badge.style.display = 'flex'; // Changed to flex to center text
                badge.textContent = totalItems;

                // Remove legacy inline styles if present (cleanup)
                badge.style.background = '';
                badge.style.color = '';
                badge.style.borderRadius = '';
                badge.style.padding = '';
                badge.style.fontSize = '';
                badge.style.position = '';
                badge.style.top = '';
                badge.style.right = '';
            } else {
                badge.style.display = 'none';
            }
        });

        // Update legacy ID if it exists and isn't caught by class selector (though it should be)
        const legacyBadge = document.getElementById('cart-count');
        if (legacyBadge && !legacyBadge.classList.contains('cart-badge')) {
            if (totalItems > 0) {
                legacyBadge.style.display = 'inline-flex';
                legacyBadge.textContent = totalItems;
            } else {
                legacyBadge.style.display = 'none';
            }
        }
    },

    /**
     * Calculate Total Price
     */
    getTotalPrice: () => {
        const cart = CartManager.getCart();
        // Needs access to window.products
        if (!window.products) return 0;

        return cart.reduce((total, item) => {
            const product = window.products.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    },

    /**
     * Simple Toast Notification
     */
    showToast: (message) => {
        // Create toast element on fly if not exists
        let toast = document.getElementById('cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cart-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s;
                transform: translateY(20px);
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
        }, 3000);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    CartManager.updateBadge(); // Update badge on page load
});

window.CartManager = CartManager;

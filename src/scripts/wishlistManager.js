/**
 * Wishlist Manager - Handles liked/favorited products
 * Stores product IDs in localStorage
 */

class WishlistManager {
    constructor() {
        this.storageKey = 'likedAppliances';
        this.likedProducts = this.loadLikedProducts();
    }

    /**
     * Load liked products from localStorage
     */
    loadLikedProducts() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading wishlist:', error);
            return [];
        }
    }

    /**
     * Save liked products to localStorage
     */
    saveLikedProducts() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.likedProducts));
            // Dispatch event for listeners
            window.dispatchEvent(new CustomEvent('wishlistChanged', {
                detail: { likedProducts: this.likedProducts }
            }));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }

    /**
     * Check if product is liked
     */
    isLiked(productId) {
        return this.likedProducts.includes(productId);
    }

    /**
     * Toggle like status for a product
     */
    toggleLike(productId) {
        const index = this.likedProducts.indexOf(productId);

        if (index > -1) {
            // Unlike - remove from array
            this.likedProducts.splice(index, 1);
        } else {
            // Like - add to array
            this.likedProducts.push(productId);
        }

        this.saveLikedProducts();
        return this.isLiked(productId);
    }

    /**
     * Get all liked products
     */
    getLikedProducts() {
        return [...this.likedProducts];
    }

    /**
     * Get count of liked products
     */
    getCount() {
        return this.likedProducts.length;
    }

    /**
     * Clear all liked products
     */
    clearAll() {
        this.likedProducts = [];
        this.saveLikedProducts();
    }
}

// Initialize global WishlistManager
window.WishlistManager = new WishlistManager();

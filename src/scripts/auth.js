/**
 * SIMPLIFIED AUTHENTICATION (Single User Mode)
 * - No Login Form needed
 * - Just "Register" -> Saves User -> Logged In
 * - "Logout" -> Clears User
 */

const Auth = {
    USER_KEY: 'shop_user_v2', // Changed key to ensure fresh start

    /**
     * Register / Update User
     * Just saves the user details directly.
     */
    register: (name, email) => {
        const user = {
            id: 'user_' + Date.now(),
            name: name,
            email: email,
            joined: new Date().toLocaleDateString(),
            membership: 'bronze',  // Default membership
            points: 0              // Default loyalty points
        };

        try {
            localStorage.setItem(Auth.USER_KEY, JSON.stringify(user));
            return { success: true, message: 'Profile created!' };
        } catch (e) {
            console.error(e);
            return { success: false, message: 'Could not save profile' };
        }
    },

    /**
     * Get Current User
     */
    getCurrentUser: () => {
        try {
            const json = localStorage.getItem(Auth.USER_KEY);
            return json ? JSON.parse(json) : null;
        } catch (e) {
            return null;
        }
    },

    /**
     * Logout
     */
    logout: () => {
        // Clear EVERYTHING on logout as requested
        localStorage.clear();

        // Use Toast if available, otherwise alert fallback
        if (window.showToast) {
            showToast("Logged out successfully", "success");
        } else {
            alert("Logged out successfully");
        }

        // Small delay to let toast be seen
        setTimeout(() => {
            window.location.href = 'auth_page.html';
        }, 500);
    },

    /**
     * Update Navbar UI (Shared across pages)
     */
    updateNavbarUI: () => {
        const user = Auth.getCurrentUser();

        // 1. Desktop / Standard Nav Link
        const authLink = document.getElementById('nav-auth-link');
        const isPages = window.location.pathname.includes('/pages/');
        const profilePath = isPages ? 'profile_page.html' : 'src/pages/profile_page.html';
        const authPath = isPages ? 'auth_page.html' : 'src/pages/auth_page.html';

        if (authLink) {
            if (user) {
                authLink.href = profilePath;
                authLink.innerHTML = `<i data-lucide="user"></i> <span>Profile</span>`;
                authLink.classList.add('logged-in');
            } else {
                authLink.href = authPath;
                authLink.innerHTML = `<i data-lucide="user"></i> <span>Sign Up</span>`;
                authLink.classList.remove('logged-in');
            }
        }

        // 2. Mobile Bottom Bar Link
        // Find links that point to auth_page.html
        const mobileLinks = document.querySelectorAll('.mobile-nav-item');
        mobileLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('auth_page.html')) {
                if (user) {
                    link.href = profilePath;
                    link.innerHTML = `<i data-lucide="user"></i> <span>Profile</span>`;
                    // If we are currently ON the profile page, mark active
                    if (window.location.pathname.includes('profile_page.html')) {
                        link.classList.add('active');
                    }
                } else {
                    // Ensure it points to auth
                    // (It already does, but just in case)
                }
            }
        });

        if (window.lucide) window.lucide.createIcons();
    }
};

window.Auth = Auth; // Expose global

// Auto-run UI update
document.addEventListener('DOMContentLoaded', () => {
    Auth.updateNavbarUI();
});

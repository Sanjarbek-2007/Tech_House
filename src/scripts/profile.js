document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth
    if (!window.Auth || !window.Auth.getCurrentUser()) {
        window.location.href = 'auth_page.html';
        return;
    }

    const user = window.Auth.getCurrentUser();

    // 2. Populate Header
    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const joinedEl = document.getElementById('user-joined');
    const badgeEl = document.getElementById('user-tier-badge');
    const planNameEl = document.getElementById('current-plan-name');
    const pointsEl = document.getElementById('user-points');
    const avatarEl = document.getElementById('user-avatar');

    if (nameEl) nameEl.textContent = user.name || 'User';
    if (emailEl) emailEl.textContent = user.email || '';
    if (joinedEl) joinedEl.textContent = user.joined || 'Recently';

    // 3. Populate Membership & Points
    const plan = (user.membership || 'bronze').toUpperCase();
    const points = user.points || 0;

    if (badgeEl) badgeEl.textContent = plan;
    if (planNameEl) planNameEl.textContent = plan + ' MEMBER';
    if (pointsEl) pointsEl.textContent = points.toLocaleString();

    // 4. Highlight Upgrade Path
    // Bronze -> Silver (1,000 pts)
    // Silver -> Gold (5,000 pts)
    const progressBar = document.querySelector('.progress-fill');
    const nextTierText = document.querySelector('.next-tier-text');

    if (progressBar && nextTierText) {
        if (plan === 'BRONZE') {
            const goal = 1000;
            const pct = Math.min((points / goal) * 100, 100);
            progressBar.style.width = pct + '%';

            const remaining = Math.max(0, goal - points);
            nextTierText.textContent = `${remaining.toLocaleString()} points to Silver`;
            progressBar.style.background = '#cd7f32';
        } else if (plan === 'SILVER') {
            const goal = 5000;
            const pct = Math.min((points / goal) * 100, 100);
            progressBar.style.width = pct + '%';

            const remaining = Math.max(0, goal - points);
            nextTierText.textContent = `${remaining.toLocaleString()} points to Gold`;
            progressBar.style.background = '#C0C0C0';
        } else {
            progressBar.style.width = '100%';
            nextTierText.textContent = 'Maximum Tier Reached';
            progressBar.style.background = '#FFD700';
            badgeEl.style.background = 'var(--primary-red)';
        }
    }

    // 5. Init Icons
    if (window.lucide) window.lucide.createIcons();
});

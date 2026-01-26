# Project Analysis: Tech House Website

## 1. Architecture Overview
The project is a **Multi-Page Application (MPA)** built with vanilla HTML, CSS, and JavaScript.

*   **Structure**: Each view is a separate HTML file (`index.html`, `pages/*.html`).
*   **Routing**: Standard browser navigation via anchor tags. URL parameters are used for state transfer (e.g., `?id=123` for details, `?search=xyz` for catalog).
*   **State Management**: `localStorage` is used as the primary persistence layer for:
    *   **Cart**: `shop_cart_{userId}`
    *   **Wishlist**: `tech_house_wishlist_{userId}`
    *   **User Session**: `tech_house_user` (Active session), `users_db` (Simulated user database).
    *   **Purchase History**: `purchase_history_{userId}`

## 2. Core Components Logic

### A. Data Layer (`src/data/products.js`)
*   **Source of Truth**: A global `window.products` array contains all product data.
*   **Schema**:
    ```javascript
    {
      id: Number,
      name: String,
      category: String,
      price: Number,
      images: Array[String], // or image: String/Array
      specs: Object,
      ...
    }
    ```
*   **Availability**: Included via `<script>` tag in every HTML page, making data globally available.

### B. Authentication (`src/scripts/auth.js`)
*   **Logic**: Simulates a backend by storing user objects in `localStorage`.
*   **Flow**:
    *   **Sign Up**: Creates new user record in both `users_db` and sets active session.
    *   **Login**: Validates credentials against `users_db` and sets active session.
    *   **Membership**: Users have tiers (Bronze, Silver, Gold) and Points, updated upon "Checkout".

### C. Shopping Cart (`src/scripts/cartManager.js` & `cart_page.js`)
*   **Data Structure**: Array of `{ productId, quantity }`.
*   **Storage Key**: Dynamic based on logged-in user (`shop_cart_{userId}`) or guest (`shop_cart_guest`).
*   **Smart Updates**:
    *   Dispatches custom `cartChanged` event when modified.
    *   `cartManager.updateBadge()` syncs the header badge count immediately.
    *   `cart_page.js` listens to `cartChanged` for specific item updates (partial DOM updates) or full re-renders.
*   **Workflow**:
    1.  User clicks "Add to Cart" or "+"/"-".
    2.  `CartManager.addItem()` / `incrementItem()` modifies `localStorage`.
    3.  Event dispatched -> Header Badge updates -> Page UI updates.

### D. Workflow Logic

#### 1. Discovery Flow
*   **Home (`index.html`)**: Features categories and featured products.
*   **Catalog (`appliances_page.html`)**:
    *   Reads `window.products`.
    *   Filters based on URL params (`?category=...`, `?search=...`) or Sidebar selection.
    *   Renders grid of Product Cards.
*   **Details (`appliance_details_page.html`)**:
    *   Parses `?id=...` from URL.
    *   Finds product in `window.products`.
    *   Renders full details, gallery, and "Smart Actions" (Add vs Qty controls).

#### 2. Transaction Flow
*   **Cart Page**:
    *   Iterates `localStorage` items.
    *   Matches IDs to `window.products` to get fresh prices/images.
    *   Calculates totals, delivery fees (Auth-aware: Gold members get free shipping).
*   **Checkout**:
    *   **Validation**: User must be logged in.
    *   **Process**:
        1.  Create Order Object (simulated ID, timestamp, items).
        2.  Save to `purchase_history_{userId}`.
        3.  Update User Points (simulated loyalty logic).
        4.  Clear purchased items from Cart.
        5.  Show Success Modal -> Redirect to History.

#### 3. User Engagement
*   **Wishlist**: Simple array of IDs. Boolean toggle logic. Renders grid similar to Catalog.
*   **Profile**: Reads User Object. Displays Points, Tier progress (gamification visualization).

## 3. Key Script Interactions
*   **`product_details.js`**: Connects UI -> `CartManager` / `WishlistManager`. Handles sticky header sync.
*   **`cart_page.js`**: Handles "Select All", realtime subtotal calculation, and the Checkout simulation.
*   **`toast.js`**: Global helper for showing ephemeral success/error messages.

## 4. Observations
*   **Consistency**: Shared styles and scripts are effectively reused across pages.
*   **Robustness**: Fallbacks exist for missing images (`placeholder.jpg`) and guest usage.
*   **Aesthetics**: High component reuse (Product Cards, Headers) ensures visual consistency.
*   **Simulation**: The entire backend is effectively mocked in `auth.js` and `cartManager.js`, which is suitable for a frontend-focused project.

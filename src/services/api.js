/**
 * ============================================================
 * API SERVICE — Telegram Mini App
 * ============================================================
 *
 * What this file does:
 *  1. Creates an Axios instance pointed at your backend
 *  2. Attaches X-Telegram-Init-Data to EVERY request automatically
 *  3. Attaches ngrok-skip-browser-warning so ngrok proxies don't
 *     intercept the response with their HTML warning page
 *  4. Handles common HTTP error codes centrally (no duplicated
 *     error handling scattered across components)
 *  5. Works both inside Telegram WebApp and on localhost/browser
 */

import axios from 'axios';
import telegram from './telegram';

// ----------------------------------------------------------------
// BASE URL
// ----------------------------------------------------------------
// Priority:
//   1. VITE_API_URL env variable (set in .env or Vercel dashboard)
//   2. Falls back to localhost for development without an env file
// ----------------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ----------------------------------------------------------------
// AXIOS INSTANCE
// ----------------------------------------------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,                         // 15 s — generous for mobile networks
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================================================================
// REQUEST INTERCEPTOR
// Runs before EVERY outgoing request.
// ================================================================
api.interceptors.request.use(
  (config) => {
    // ------------------------------------------------------------
    // 1. ngrok header
    // ngrok shows an HTML "browser warning" page for the first
    // request unless you pass this header.  Safe to send always —
    // real servers silently ignore unknown headers.
    // ------------------------------------------------------------
    config.headers['ngrok-skip-browser-warning'] = 'true';

    // ------------------------------------------------------------
    // 2. Telegram initData header
    //
    // telegram.getInitData() returns:
    //   • The raw initData string when running inside Telegram
    //   • null when running in a normal browser
    //
    // The backend's TelegramAuth class reads this header.
    // If the header is absent the backend falls back to the dev
    // user (when DEBUG=True) or treats the request as anonymous.
    // ------------------------------------------------------------
    const initData = telegram.getInitData();
    if (initData) {
      config.headers['X-Telegram-Init-Data'] = initData;
    }

    // Optional: log outgoing requests during development
    if (import.meta.env.DEV) {
      console.debug(
        `📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        initData ? '(initData attached ✅)' : '(no initData — dev mode)',
      );
    }

    return config;
  },
  (error) => {
    // A request config error (extremely rare — usually a programmer mistake)
    console.error('Request setup error:', error);
    return Promise.reject(error);
  },
);

// ================================================================
// RESPONSE INTERCEPTOR
// Runs after EVERY response (success or error).
// ================================================================
api.interceptors.response.use(
  // ── Success path ──────────────────────────────────────────────
  (response) => {
    if (import.meta.env.DEV) {
      console.debug(
        `📥 ${response.status} ${response.config.url}`,
        response.data,
      );
    }
    return response;
  },

  // ── Error path ────────────────────────────────────────────────
  (error) => {
    if (error.response) {
      // Server replied with a non-2xx status code
      const { status, data, config } = error.response;

      console.error(`❌ API ${status} on ${config?.url}:`, data);

      switch (status) {
        case 400:
          // Bad request — usually a validation error from Django.
          // We don't show an alert here; individual callers can
          // inspect error.response.data and display field errors.
          break;

        case 401:
          // Should not normally happen if TelegramAuth is set up
          // correctly, but guard against it anyway.
          telegram.showAlert('Session expired. Please reopen the app.');
          break;

        case 403:
          // Hash mismatch or permission denied.
          // In production this means the initData is bad or missing.
          console.error('403 Forbidden — check initData / bot token.');
          // Don't show a user-facing alert for 403 during development
          // so it's easier to debug.  Uncomment for production:
          // telegram.showAlert('Access denied. Please reopen the app.');
          break;

        case 404:
          // Resource not found — let the caller decide how to handle.
          console.warn('404 Not found:', config?.url);
          break;

        case 500:
        case 502:
        case 503:
          telegram.showAlert('Server error. Please try again later.');
          break;

        default:
          console.warn(`Unhandled status ${status}`);
      }
    } else if (error.request) {
      // Request was sent but no response received (offline, timeout, CORS)
      console.error('Network error — no response received:', error.message);
      telegram.showAlert('Network error. Please check your connection.');
    } else {
      // Something went wrong while setting up the request
      console.error('Unexpected error:', error.message);
    }

    // Always re-reject so individual callers can still catch the error
    return Promise.reject(error);
  },
);




// API Service
const apiService = {

  //User
  async getCurrentUser() {
    const response = await api.get('/user/me/');
    return response.data;  // TelegramUserSerializer
  },

  // Favorites api=========================================================================>

    async getMyLikes() {
      const response = await api.get('/likes/my_likes/');
      return response.data;
    },

    async toggleLike(productId) {
      const response = await api.post('/likes/toggle/', {
        product_id: productId
      });
      return response.data;
    },

    // Products api=========================================================================>
    async getProducts(params = {}) {
      const response = await api.get('/products/', { params });
      return response.data;
    },

  async getProductById(id) {
    
    const response = await api.get(`/products/${id}`);
    return response.data;
  
  },


  // async searchProducts(query) {
  //   try {
  //     const response = await api.get('/products/search', { 
  //       params: { q: query } 
  //     });
  //     return response.data;
  //   } catch (error) {
  //     const products = this.getMockProducts();
  //     return products.filter(p => 
  //       p.name.toLowerCase().includes(query.toLowerCase())
  //     );
  //   }
  // },

  // Categories api=========================================================================>
  async getCategories() {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error) {
      return this.getMockCategories();
    }
  },


  // Orders api=========================================================================>

// POST /orders/checkout/
  async checkout(orderData) {
    const response = await api.post('/orders/checkout/', orderData);
    return response.data; // {id, customer, items, total_price, status, ...}
  },

  // GET /orders/
  async getOrders() {
    const response = await api.get('/orders/');
    return response.data;
  },

  // GET /orders/{id}/
  async getOrderById(id) {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  // PATCH /orders/{id}/update_status/ (agar admin panel bo'lsa)
  async updateOrderStatus(id, status) {
    const response = await api.patch(`/orders/${id}/update_status/`, { status });
    return response.data;
  },

  // Cart api=========================================================================>

  async getCart() {
      const response = await api.get('/cart/');
      return response.data;
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/add_item/', {
      product_id: productId,
      quantity: quantity
    });
    return response.data;
  },

  async updateCartItem(itemId, quantity) {
    const response = await api.patch('/cart/update_item/', {
      item_id: itemId,
      quantity: quantity
    });
    return response.data;
  },

  async removeCartItem(itemId){
    const response = await api.delete(`/cart/remove_item/?item_id=${itemId}`)

    return response.data;

  }, 

  async clearCart() {
    const response = await api.post('/cart/clear/');
    return response.data;
  },

  async checkout(orderData) {
    const response = await api.post('/orders/checkout/', orderData);
    return response.data;
  },

};

export default apiService;

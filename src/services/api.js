import axios from 'axios';
import telegram from './telegram';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {

    config.headers['ngrok-skip-browser-warning'] = 'true';

    const initData = telegram.getInitData();
    if (initData) {
      config.headers['X-Telegram-Init-Data'] = initData;
    }

    if (import.meta.env.DEV) {
      console.debug(
        `📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        initData ? '(initData attached ✅)' : '(no initData — dev mode)',
      );
    }

    return config;
  },
  (error) => {
    console.error('Request setup error:', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.debug(
        `📥 ${response.status} ${response.config.url}`,
        response.data,
      );
    }
    return response;
  },

  (error) => {
    if (error.response) {
      const { status, data, config } = error.response;

      console.error(`❌ API ${status} on ${config?.url}:`, data);

      switch (status) {
        case 400:
          break;

        case 401:
          telegram.showAlert('Session expired. Please reopen the app.');
          break;

        case 403:
          console.error('403 Forbidden — check initData / bot token.');
          break;

        case 404:
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
      console.error('Network error — no response received:', error.message);
      telegram.showAlert('Network error. Please check your connection.');
    } else {
      console.error('Unexpected error:', error.message);
    }

    return Promise.reject(error);
  },
);




const apiService = {

  async getCurrentUser(userId) {
    const response = await api.get('/auth/users/me/');
    return response.data;
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

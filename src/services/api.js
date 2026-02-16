import axios from 'axios';
import telegram from './telegram';

// Configure your API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add Telegram init data
api.interceptors.request.use(
  (config) => {
    const initData = telegram.getInitData();
    if (initData) {
      config.headers['X-Telegram-Init-Data'] = initData;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          telegram.showAlert('Authentication failed. Please restart the app.');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          telegram.showAlert('Server error. Please try again later.');
          break;
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
      telegram.showAlert('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
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

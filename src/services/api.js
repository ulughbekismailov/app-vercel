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
  // Products
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      // Return mock data for development
      return this.getMockProducts();
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      // Return mock data
      const products = this.getMockProducts();
      return products.find(p => p.id === id) || null;
    }
  },

  async searchProducts(query) {
    try {
      const response = await api.get('/products/search', { 
        params: { q: query } 
      });
      return response.data;
    } catch (error) {
      const products = this.getMockProducts();
      return products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Categories
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      return this.getMockCategories();
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      // Simulate success for development
      console.log('Order created (mock):', orderData);
      return { 
        success: true, 
        orderId: Date.now(),
        message: 'Order placed successfully!'
      };
    }
  },

  async getOrders(userId) {
    try {
      const response = await api.get(`/orders/${userId}`);
      return response.data;
    } catch (error) {
      return this.getMockOrders();
    }
  },

  // Favorites
  async getFavorites(userId) {
    try {
      const response = await api.get(`/users/${userId}/favorites`);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async addFavorite(userId, productId) {
    try {
      const response = await api.post(`/users/${userId}/favorites`, { productId });
      return response.data;
    } catch (error) {
      return { success: true };
    }
  },

  async removeFavorite(userId, productId) {
    try {
      const response = await api.delete(`/users/${userId}/favorites/${productId}`);
      return response.data;
    } catch (error) {
      return { success: true };
    }
  },

  // Mock Data Methods
  getMockProducts() {
    return [
      {
        id: 1,
        name: 'Wireless Headphones Pro',
        price: 129.99,
        oldPrice: 179.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=800&fit=crop'
        ],
        description: 'Premium wireless headphones with active noise cancellation',
        details: 'Experience studio-quality sound with up to 30 hours of battery life. Features include adaptive ANC, transparency mode, spatial audio, and comfortable over-ear design perfect for all-day listening.',
        discount: 28,
        rating: 4.8,
        inStock: true
      },
      {
        id: 2,
        name: 'Smart Watch Series 8',
        price: 399.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&h=800&fit=crop'
        ],
        description: 'Advanced fitness tracking with heart rate monitoring',
        details: 'Stay connected and motivated with comprehensive health tracking, GPS, water resistance up to 50m, always-on display, and seamless integration with your phone.',
        rating: 4.9,
        inStock: true
      },
      {
        id: 3,
        name: 'Minimalist Leather Wallet',
        price: 49.99,
        oldPrice: 69.99,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop'
        ],
        description: 'Handcrafted genuine leather slim wallet',
        details: 'Italian full-grain leather wallet with RFID protection. Holds 8-10 cards and folded bills. Develops beautiful patina over time. Compact design fits comfortably in front pocket.',
        discount: 29,
        rating: 4.7,
        inStock: true
      },
      {
        id: 4,
        name: 'Portable Bluetooth Speaker',
        price: 89.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&h=800&fit=crop'
        ],
        description: 'Waterproof speaker with 360° sound',
        details: '20-hour battery life, IPX7 waterproof rating, USB-C charging, and True Wireless Stereo pairing. Perfect for outdoor adventures, beach trips, and pool parties.',
        rating: 4.6,
        inStock: true
      },
      {
        id: 5,
        name: 'Premium Coffee Maker',
        price: 199.99,
        oldPrice: 249.99,
        category: 'home',
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=800&fit=crop'
        ],
        description: 'Programmable drip coffee maker with thermal carafe',
        details: 'Brew-strength control, 24-hour programming, self-clean function, and gold-tone permanent filter. Makes up to 12 cups of perfectly brewed coffee every time.',
        discount: 20,
        rating: 4.5,
        inStock: true
      },
      {
        id: 6,
        name: 'Running Shoes Ultra',
        price: 159.99,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop'
        ],
        description: 'Lightweight performance running shoes',
        details: 'Responsive cushioning, breathable mesh upper, durable rubber outsole with exceptional grip. Designed for neutral runners seeking comfort and speed.',
        rating: 4.8,
        inStock: true
      },
      {
        id: 7,
        name: 'Yoga Mat Premium',
        price: 69.99,
        category: 'sports',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop'
        ],
        description: 'Eco-friendly non-slip yoga mat',
        details: 'Made from natural rubber with excellent grip even during sweaty practices. Extra thick 6mm cushioning for joint protection. Includes carrying strap.',
        rating: 4.9,
        inStock: true
      },
      {
        id: 8,
        name: 'Desk Lamp LED',
        price: 79.99,
        oldPrice: 99.99,
        category: 'home',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop'
        ],
        description: 'Adjustable LED desk lamp with USB charging',
        details: 'Touch control, 5 color temperatures, 10 brightness levels, eye-caring technology, and built-in USB port for device charging. Modern design fits any workspace.',
        discount: 20,
        rating: 4.7,
        inStock: true
      },
      {
        id: 9,
        name: 'Backpack Travel Pro',
        price: 119.99,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop'
        ],
        description: 'Durable travel backpack with laptop compartment',
        details: 'Water-resistant material, TSA-friendly laptop compartment up to 17", multiple organizing pockets, comfortable padded straps, and luggage strap for easy carrying.',
        rating: 4.6,
        inStock: true
      },
      {
        id: 10,
        name: 'Wireless Charger Pad',
        price: 39.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1591290619762-c588f7413f7b?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1591290619762-c588f7413f7b?w=800&h=800&fit=crop'
        ],
        description: 'Fast wireless charging for all Qi devices',
        details: 'Up to 15W fast charging, case-friendly design works through most phone cases, LED indicator, over-temperature protection, and non-slip surface.',
        rating: 4.5,
        inStock: true
      },
      {
        id: 11,
        name: 'Stainless Steel Water Bottle',
        price: 34.99,
        category: 'sports',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop'
        ],
        description: 'Insulated water bottle keeps drinks cold 24hrs',
        details: 'Double-wall vacuum insulation, BPA-free, leak-proof lid, wide mouth for easy cleaning and ice cubes. Perfect for gym, hiking, or daily hydration.',
        rating: 4.8,
        inStock: true
      },
      {
        id: 12,
        name: 'Smart Home Hub',
        price: 149.99,
        oldPrice: 199.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1558089687-e27530d502ff?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1558089687-e27530d502ff?w=800&h=800&fit=crop'
        ],
        description: 'Voice-controlled smart home controller',
        details: 'Compatible with all major smart home devices, built-in voice assistant, HD video calling, 10-inch touchscreen display, and premium speakers.',
        discount: 25,
        rating: 4.7,
        inStock: true
      }
    ];
  },

  getMockCategories() {
    return [
      { id: 'all', name: 'All', icon: '🏪' },
      { id: 'electronics', name: 'Electronics', icon: '📱' },
      { id: 'fashion', name: 'Fashion', icon: '👕' },
      { id: 'home', name: 'Home', icon: '🏠' },
      { id: 'sports', name: 'Sports', icon: '⚽' }
    ];
  },

  getMockOrders() {
    return [
      {
        id: 1001,
        date: '2024-02-01',
        status: 'delivered',
        total: 349.98,
        items: 2
      },
      {
        id: 1002,
        date: '2024-01-28',
        status: 'processing',
        total: 129.99,
        items: 1
      },
      {
        id: 1003,
        date: '2024-01-15',
        status: 'delivered',
        total: 249.97,
        items: 3
      }
    ];
  }
};

export default apiService;

import { defineStore } from 'pinia';
import telegram from '@/services/telegram';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false
  }),

  getters: {
    itemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },

    cartItems: (state) => state.items,

    isInCart: (state) => (productId) => {
      return state.items.some(item => item.id === productId);
    },

    getItemQuantity: (state) => (productId) => {
      const item = state.items.find(item => item.id === productId);
      return item ? item.quantity : 0;
    }
  },

  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          inStock: product.inStock
        });
      }

      telegram.hapticFeedback('success');
      this.saveToLocalStorage();
    },

    removeItem(productId) {
      const index = this.items.findIndex(item => item.id === productId);
      
      if (index !== -1) {
        this.items.splice(index, 1);
        telegram.hapticFeedback('light');
        this.saveToLocalStorage();
      }
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
          telegram.hapticFeedback('selection');
          this.saveToLocalStorage();
        }
      }
    },

    incrementQuantity(productId) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity++;
        telegram.hapticFeedback('selection');
        this.saveToLocalStorage();
      }
    },

    decrementQuantity(productId) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
          telegram.hapticFeedback('selection');
        } else {
          this.removeItem(productId);
        }
        this.saveToLocalStorage();
      }
    },

    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
      telegram.hapticFeedback('success');
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem('cart', JSON.stringify(this.items));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    },

    loadFromLocalStorage() {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          this.items = JSON.parse(savedCart);
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        this.items = [];
      }
    },

    getOrderData() {
      return {
        items: this.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: this.totalPrice,
        itemCount: this.itemCount
      };
    }
  }
});

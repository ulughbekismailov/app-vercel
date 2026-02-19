import { defineStore } from 'pinia';
import apiService from '@/services/api';
import telegram from '@/services/telegram';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total_items: 0,
    subtotal: 0,
    loading: false,
    error: null
  }),

  getters: {
    itemCount: (state) => state.total_items,
    totalPrice: (state) => state.subtotal,
    cartItems: (state) => state.items,

    isInCart: (state) => (productId) => {
      return state.items.some(item => item.product_id === productId);
    },

    getItemQuantity: (state) => (productId) => {
      const item = state.items.find(item => item.product_id === productId);
      return item ? item.quantity : 0;
    }
  },

  actions: {
    async fetchCart() {
      this.loading = true;
      this.error = null;
      try {
        const data = await apiService.getCart();
        this.items = data.items || [];
        this.total_items = data.total_items || 0;
        this.subtotal = data.subtotal || 0;

      } catch (error) {
        this.error = 'Savatni yuklashda xatolik';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async addItem(productId, quantity = 1) {
      this.loading = true;
      try {
        const data = await apiService.addToCart(productId, quantity);
        this.items = data.items;
        this.total_items = data.total_items;
        this.subtotal = data.subtotal;
      } catch (error) {
        this.error = 'Mahsulot qo\'shilmadi';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async removeItem(itemId) {
        const itemIndex = this.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        const removedItem = this.items[itemIndex];
        const oldTotal = this.subtotal;
        const oldItemCount = this.total_items;
        
        this.items.splice(itemIndex, 1);
        this.total_items -= removedItem.quantity;
        this.subtotal -= removedItem.product_price * removedItem.quantity;
        
        try {
          const data = await apiService.removeCartItem(itemId);
          this.items = data.items;
          this.total_items = data.total_items;
          this.subtotal = data.subtotal;
        } catch (error) {
          // Rollback
          this.items.splice(itemIndex, 0, removedItem);
          this.total_items = oldItemCount;
          this.subtotal = oldTotal;
          console.error(error);
        }
    },

    async clearCart() {
      const oldItems = [...this.items]; 
      const oldTotal = this.subtotal;
      const oldCount = this.total_items;
      
      this.items = [];
      this.total_items = 0;
      this.subtotal = 0;
      
      try {
        const data = await apiService.clearCart();
        
        this.items = data.items || [];
        this.total_items = data.total_items || 0;
        this.subtotal = data.subtotal || 0;
        
        telegram.hapticFeedback('success');
        
      } catch (error) {
        this.items = oldItems;
        this.total_items = oldCount;
        this.subtotal = oldTotal;
        
        console.error('Savatni tozalashda xatolik:', error);
        telegram.hapticFeedback('error');
      }
    },

    async removeByProductId(productId) {
      const item = this.items.find(item => item.product_id === productId);
      if (item) {
        await this.removeItem(item.id);
      }
    },


    async updateQuantity(itemId, quantity) {
      const item = this.items.find(i => i.id === itemId);
      if (!item) return;
      
      const oldQty = item.quantity;
      const oldTotal = this.subtotal;
      const oldItemCount = this.total_items;

      this.subtotal += item.product_price * (quantity - oldQty);
      item.quantity = quantity;
      this.total_items += (quantity - oldQty);
      
      try {
        const data = await apiService.updateCartItem(itemId, quantity);
        this.items = data.items;
        this.total_items = data.total_items;
        this.subtotal = data.subtotal;
      } catch (error) {
        const originalItem = this.items.find(i => i.id === itemId);
        if (originalItem) {
          originalItem.quantity = oldQty;
        }
        this.subtotal = oldTotal;
        this.total_items = oldItemCount;
        console.error(error);
      }
    },

    async incrementQuantity(productId) {
      const item = this.items.find(item => item.product_id === productId);
      if (!item) return;
      
      const newQuantity = item.quantity + 1;
      
      await this.updateQuantity(item.id, newQuantity);
    },

    async decrementQuantity(productId) {
      const item = this.items.find(item => item.product_id === productId);
      if (!item) return;
      
      if (item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        await this.updateQuantity(item.id, newQuantity);
      } else {
        await this.removeItem(item.id);
      }
    },

    getOrderData() {
      return {
        items: this.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product_price
        })),
        total: this.subtotal,
        item_count: this.total_items
      };
    },
  }
});
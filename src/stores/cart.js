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
    // ✅ Frontend hisob (backend bilan bir xil)
    itemCount: (state) => state.total_items,
    totalPrice: (state) => state.subtotal,
    cartItems: (state) => state.items,

    // ✅ Mahsulot savatdami?
    isInCart: (state) => (productId) => {
      return state.items.some(item => item.product_id === productId);
    },

    // ✅ Mahsulot miqdori
    getItemQuantity: (state) => (productId) => {
      const item = state.items.find(item => item.product_id === productId);
      return item ? item.quantity : 0;
    }
  },

  actions: {
    // ✅ GET /cart/
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

    // ✅ POST /cart/add_item/
    async addItem(productId, quantity = 1) {
      this.loading = true;
      try {
        const data = await apiService.addToCart(productId, quantity);
        this.items = data.items;
        this.total_items = data.total_items;
        this.subtotal = data.subtotal;
        // telegram.hapticFeedback('success');
      } catch (error) {
        this.error = 'Mahsulot qo\'shilmadi';
        console.error(error);
        // telegram.hapticFeedback('error');
      } finally {
        this.loading = false;
      }
    },

    // ✅ PATCH /cart/update_item/
    async updateQuantity(itemId, quantity) {
      try {
        const data = await apiService.updateCartItem(itemId, quantity);
        this.items = data.items;
        this.total_items = data.total_items;
        this.subtotal = data.subtotal;
        telegram.hapticFeedback('selection');
      } catch (error) {
        console.error(error);
        telegram.hapticFeedback('error');
      }
    },

    // ✅ DELETE /cart/remove_item/?item_id=
    async removeItem(itemId) {
      try {
        const data = await apiService.removeCartItem(itemId);
        this.items = data.items;
        this.total_items = data.total_items;
        this.subtotal = data.subtotal;
        
        telegram.hapticFeedback('light');
      } catch (error) {
        console.error(error);
        telegram.hapticFeedback('error');
      }
    },

    // ✅ POST /cart/clear/
    async clearCart() {
      try {
        const data = await apiService.clearCart();
        this.items = data.items;
        this.total_items = data.total_items;
        this.subtotal = data.subtotal;
        telegram.hapticFeedback('success');
      } catch (error) {
        console.error(error);
        telegram.hapticFeedback('error');
      }
    },

    // ✅ Helper: ID bo'yicha o'chirish (item_id kerak)
    async removeByProductId(productId) {
      const item = this.items.find(item => item.product_id === productId);
      if (item) {
        await this.removeItem(item.id);
      }
    },

    // ✅ Helper: ID bo'yicha yangilash
    // async updateByProductId(productId, quantity) {
    //   const item = this.items.find(item => item.product_id === productId);
    //   if (item) {
    //     if (quantity <= 0) {
    //       await this.removeItem(item.id);
    //     } else {
    //       await this.updateQuantity(item.id, quantity);
    //     }
    //   }
    // },

    // ✅ Increment/Decrement
    async incrementQuantity(productId) {
      const item = this.items.find(item => item.product_id === productId);
      if (item) {
        await this.updateQuantity(item.id, item.quantity + 1);
      }
    },

    async decrementQuantity(productId) {
      const item = this.items.find(item => item.product_id === productId);
      if (item) {
        if (item.quantity > 1) {
          await this.updateQuantity(item.id, item.quantity - 1);
        } else {
          await this.removeItem(item.id);
        }
      }
    },

    // ✅ Order uchun ma'lumot
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
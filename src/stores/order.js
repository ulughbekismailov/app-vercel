// stores/orderStore.js
import { defineStore } from 'pinia';
import apiService from '@/services/api';
import telegram from '@/services/telegram';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  }),

  getters: {
    // Barcha orderlar
    allOrders: (state) => state.orders,
    
    // Pending orderlar
    pendingOrders: (state) => state.orders.filter(o => o.status === 'Pending'),
    
    // Yetkazilgan orderlar
    deliveredOrders: (state) => state.orders.filter(o => o.status === 'Delivered'),
    
    // Order statusini o'qish uchun
    getOrderStatus: (state) => (orderId) => {
      const order = state.orders.find(o => o.id === orderId);
      return order?.status || 'Unknown';
    }
  },

  actions: {
    // ✅ 1. CHECKOUT (Yangi order yaratish)
    async checkout(orderData) {
      this.loading = true;
      this.error = null;
      
      try {
        // orderData = {
        //   shipping_address: "Toshkent, Chilonzor",
        //   phone_number: "+998901234567",
        //   notes: "Tezroq keltiring"
        // }
        
        const order = await apiService.checkout(orderData);
        this.currentOrder = order;
        
        // Orderlar ro'yxatiga qo'shish
        this.orders.unshift(order);
        
        telegram.hapticFeedback('success');
        return order;
        
      } catch (error) {
        this.error = 'Buyurtma yaratishda xatolik';
        telegram.hapticFeedback('error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ✅ 2. ORDER LARNI YUKLASH
    async fetchOrders() {
      this.loading = true;
      try {
        this.orders = await apiService.getOrders();
      } catch (error) {
        console.error('Orderlarni yuklashda xatolik:', error);
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },

    // ✅ 3. BITTA ORDER NI YUKLASH
    async fetchOrderById(id) {
      this.loading = true;
      try {
        this.currentOrder = await apiService.getOrderById(id);
      } catch (error) {
        console.error('Order yuklashda xatolik:', error);
      } finally {
        this.loading = false;
      }
    },

    // ✅ 4. ORDER STATUSINI YANGILASH (admin panel uchun)
    async updateStatus(orderId, newStatus) {
      try {
        const updated = await apiService.updateOrderStatus(orderId, newStatus);
        
        // Ro'yxatda yangilash
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updated;
        }
        
        if (this.currentOrder?.id === orderId) {
          this.currentOrder = updated;
        }
        
        return updated;
      } catch (error) {
        console.error('Status yangilashda xatolik:', error);
        throw error;
      }
    },

    // ✅ 5. TOZALASH
    clearCurrentOrder() {
      this.currentOrder = null;
    }
  }
});
// ============================================================
// FAVORITES STORE - FIXED VERSION
// ============================================================
import { defineStore } from 'pinia';
import apiService from '@/services/api';
import telegram from '@/services/telegram';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    // Like qilingan product ID lari (oddiy array)
    likedIds: [],
    // Like qilingan productlarning to'liq ma'lumotlari
    likedProducts: [],
    // Yuklanayotgan holat
    loading: false,
    error: null
  }),

  getters: {
    // 👉 Berilgan product like qilinganmi?
    isLiked: (state) => (productId) => {
      return state.likedIds.includes(Number(productId));
    },
    
    // 👉 Like lar soni
    count: (state) => state.likedIds.length,

    // 👉 Like qilingan productlar
    favorites: (state) => state.likedProducts
  },

  actions: {
    // ============================================================
    // 1️⃣ LIKE LARNI YUKLASH (App.vue yoki Home.vue da chaqiriladi)
    // ============================================================
    async loadLikes() {
      this.loading = true;
      this.error = null;
      
      try {
        // Backenddan like larni olish
        const likes = await apiService.getMyLikes();
        
        // ID larni saqlash
        this.likedIds = likes.map(item => Number(item.product));
        
        // To'liq ma'lumotlarni saqlash
        this.likedProducts = likes.map(item => ({
          id: Number(item.product),
          product_id: Number(item.product),
          product_name: item.product_name,
          product_price: item.product_price,
          // Qo'shimcha ma'lumotlar (agar backend qaytarsa)
          product_image: item.product_image || null,
          discount_percent: item.discount_percent || null,
          new_price: item.new_price || null
        }));

        console.log('✅ Likes loaded:', this.likedIds.length, 'items');
        return this.likedProducts;
      } catch (error) {
        console.error('❌ Failed to load likes:', error);
        this.error = 'Failed to load favorites';
        this.likedIds = [];
        this.likedProducts = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ============================================================
    // 2️⃣ LIKE BOSISH (toggle) - OPTIMISTIC UPDATE
    // ============================================================
    async toggleFavorite(productId, productData = null) {
      // ID ni number ga aylantirish
      const id = Number(productId);
      
      // Hozirgi holatni eslab qolish
      const wasLiked = this.likedIds.includes(id);
      
      // ============================================================
      // OPTIMISTIC UPDATE (UI ni darhol yangilash)
      // ============================================================
      if (wasLiked) {
        // Remove from arrays immediately
        this.likedIds = this.likedIds.filter(item => item !== id);
        this.likedProducts = this.likedProducts.filter(item => item.product_id !== id);
      } else {
        // Add to arrays immediately
        this.likedIds.push(id);
        
        // Add to likedProducts if we have product data
        if (productData) {
          this.likedProducts.push({
            id: id,
            product_id: id,
            product_name: productData.name || productData.product_name || 'Product',
            product_price: productData.price || productData.product_price || 0,
            product_image: productData.image || productData.product_image || null,
            discount_percent: productData.discount_percent || null,
            new_price: productData.new_price || null
          });
        }
      }

      // Haptic feedback for immediate response
      telegram.hapticFeedback('selection');
      
      try {
        // ============================================================
        // BACKEND REQUEST
        // ============================================================
        const response = await apiService.toggleLike(id);
        
        // ============================================================
        // VERIFY BACKEND RESPONSE
        // ============================================================
        if (response.liked === true && !wasLiked) {
          // Successfully liked
          console.log(`✅ Product ${id} liked`);
        } else if (response.liked === false && wasLiked) {
          // Successfully unliked
          console.log(`✅ Product ${id} unliked`);
        } else {
          // Response doesn't match expected state - reload to sync
          console.warn('⚠️ Like state mismatch, reloading...');
          await this.loadLikes();
        }
        
      } catch (error) {
        // ============================================================
        // ERROR - ROLLBACK OPTIMISTIC UPDATE
        // ============================================================
        console.error(`❌ Toggle favorite error (product ${id}):`, error);
        
        // Rollback to previous state
        if (wasLiked) {
          // Was liked, should restore like
          if (!this.likedIds.includes(id)) {
            this.likedIds.push(id);
          }
          if (productData && !this.likedProducts.find(p => p.product_id === id)) {
            this.likedProducts.push({
              id: id,
              product_id: id,
              product_name: productData.name || productData.product_name || 'Product',
              product_price: productData.price || productData.product_price || 0
            });
          }
        } else {
          // Was not liked, should remove like
          this.likedIds = this.likedIds.filter(item => item !== id);
          this.likedProducts = this.likedProducts.filter(item => item.product_id !== id);
        }
        
        // Show error feedback
        telegram.hapticFeedback('error');
        telegram.showAlert('Failed to update favorite. Please try again.');
        
        throw error;
      }
    },

    // ============================================================
    // 3️⃣ REMOVE FROM FAVORITES (called from FavoritesPage)
    // ============================================================
    async removeFavorite(productId) {
      await this.toggleFavorite(productId);
    },

    // ============================================================
    // 4️⃣ TOZALASH (logout yoki kerak bo'lganda)
    // ============================================================
    clearFavorites() {
      this.likedIds = [];
      this.likedProducts = [];
      this.error = null;
      console.log('🧹 Favorites cleared');
    },

    // ============================================================
    // 5️⃣ GET FAVORITE PRODUCT BY ID
    // ============================================================
    getFavoriteProduct(productId) {
      return this.likedProducts.find(p => p.product_id === Number(productId));
    }
  }
});
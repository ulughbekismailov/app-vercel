// stores/favorites.js
import { defineStore } from 'pinia';
import apiService from '@/services/api';
import { data } from 'autoprefixer';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    // Like qilingan product ID lari (oddiy array)
    likedIds: [],
    likedProducts: [],
    // Yuklanayotgan holat
    loading: false
  }),

  getters: {
    // 👉 Berilgan product like qilinganmi?
    isLiked: (state) => (productId) => {
      return state.likedIds.includes(Number(productId));
    },
    
    // 👉 Like lar soniuseFavoriteStore
    count: (state) => state.likedIds.length
  },

  actions: {
    // ============================================================
    // 1️⃣ LIKE LARNI YUKLASH (App.vue yoki Home.vue da chaqiriladi)
    // ============================================================
    async loadLikes() {
      this.loading = true;
      
      try {
        // Backenddan like larni olish
        const likes = await apiService.getMyLikes(); 
        this.likedIds = likes.map(item => Number(item.product));
        
        this.likedProducts = likes.map(item => ({
          id: item.product,
          product_id: item.product,
          product_name: item.product_name,
          product_price: item.product_price,
        }));

        console.log('✅ Like lar yuklandi:', this.likedIds);
      } catch (error) {
        console.error('❌ Like larni yuklashda xatolik:', error);
        this.likedIds = [];
      } finally {
        this.loading = false;
      }
    },

    // ============================================================
    // 2️⃣ LIKE BOSISH (toggle) - SODDA VA TUSHUNARLI
    // ============================================================
    async toggleFavorite(productId) {
      // ID ni number ga aylantirish
      const id = Number(productId);
      
      // Hozirgi holatni eslab qolish
      const wasLiked = this.likedIds.includes(id);
      
      try {
        // 1️⃣ BACKENDGA SO'ROV YUBORISH
        const response = await apiService.toggleLike(id);
        
        // 2️⃣ BACKEND JAVOBIGA QARAB STATE NI O'ZGARTIRISH
        if (response.liked === true) {
          // Like qo'shildi
          if (!this.likedIds.includes(id)) {
            this.likedIds.push(id);
          }
          console.log(`✅ Product ${id} like qilindi`);
        } 
        else if (response.liked === false) {
          // Like o'chirildi
          this.likedIds = this.likedIds.filter(item => item !== id);
          console.log(`✅ Product ${id} like dan chiqarildi`);
        }
        
      } catch (error) {
        // 3️⃣ XATOLIK - avvalgi holat qoladi
        console.error(`❌ Like xatosi (product ${id}):`, error);
        
        // Xatolik haqida habar (ixtiyoriy)
        // telegram.showAlert?.(`Like ishlamadi`);
      }
    },

    // ============================================================
    // 3️⃣ TOZALASH (logout yoki kerak bo'lganda)
    // ============================================================
    clearFavorites() {
      this.likedIds = [];
      console.log('🧹 Like lar tozalandi');
    }
  }
});
import { defineStore } from 'pinia';
import apiService from '@/services/api';
import telegram from '../services/telegram';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    likedIds: [],
    loading: false,
    error:null
  }),

  getters: {
    isLiked: (state) => (productId) => {
      return state.likedIds.includes(Number(productId));
    },
    
    // 👉 Like lar soniuseFavoriteStore
    count: (state) => state.likedIds.length
  },

  actions: {
    async loadLikes() {
      this.loading = true;
      this.error = false;
      
      try {
        const likes = await apiService.getMyLikes(); 
        this.likedIds = likes.map(item => Number(item.product));
        
        console.log('Like bosilgan productlar yuklandi:', this.likedIds);
      } catch (error) {
        console.error(' Like bosilgan productlarni yuklashda xatolik:', error);
        this.likedIds = [];
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite(productId) {
      const id = Number(productId);
      telegram.hapticFeedback('selection')
      
      try {
        const response = await apiService.toggleLike(id);
        
        if (response.liked === true) {
          if (!this.likedIds.includes(id)) {
            this.likedIds.push(id);
          }
          console.log(`✅ Product ${id} yoqtirilganlarga qo'shildi`);
        } 
        else if (response.liked === false) {
          this.likedIds = this.likedIds.filter(item => item !== id);
          console.log(`✅ Product ${id} like dan chiqarildi`);
        }
        
      } catch (error) {
        console.error(`Like xatosi (product ${id}):`, error);
        telegram.hapticFeedback('error')
      }

    },

    clearFavorites() {
      this.likedIds = [];
      console.log('🧹 Like lar tozalandi');
    }
  }
});
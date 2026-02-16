// stores/favorites.js
import { defineStore } from 'pinia';
import apiService from '@/services/api';
import { data } from 'autoprefixer';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    likedIds: [],
    loading: false,
    error:false
  }),

  getters: {
    isLiked: (state) => (productId) => {
      return state.likedIds.includes(Number(productId));
    },
    
    count: (state) => state.likedIds.length
  },

  actions: {
    async loadLikes() {
      this.loading = true;
      
      try {
        const likes = await apiService.getMyLikes(); 
        this.likedIds = likes.map(item => Number(item.product));
        
        console.log('✅ Like lar yuklandi:', this.likedIds);
      } catch (error) {
        console.error(' Like larni yuklashda xatolik:', error);
        this.likedIds = [];
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite(productId) {
      const id = Number(productId);
      
      try {
        const response = await apiService.toggleLike(id);
        
        if (response.liked === true) {
          if (!this.likedIds.includes(id)) {
            this.likedIds.push(id);
          }
          console.log(`✅ Product ${id} like qilindi`);
        } 
        else if (response.liked === false) {
          this.likedIds = this.likedIds.filter(item => item !== id);
          console.log(`✅ Product ${id} like dan chiqarildi`);
        }
        
      } catch (error) {
        console.error(`Like xatosi (product ${id}):`, error);
      }
    },

    clearFavorites() {
      this.likedIds = [];
      console.log(' Like lar tozalandi');
    }
  }
});
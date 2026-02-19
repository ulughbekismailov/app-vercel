import { defineStore } from 'pinia';
import apiService from '@/services/api';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    likedIds: new Set(), 
    loading: false,
    error:false
  }),

  getters: {
    isLiked: (state) => (productId) => {
      return state.likedIds.has(Number(productId));
    },
    count: (state) => state.likedIds.size,
    likedArray: (state) => Array.from(state.likedIds)
  },

  actions: {
    async loadLikes() {
      this.loading = true;
      try {
        const likes = await apiService.getMyLikes();
        this.likedIds = new Set(likes.map(item => Number(item.product)));
      } catch (error) {
        this.likedIds = new Set();
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite(productId) {
      const id = Number(productId);
      const wasLiked = this.likedIds.has(id);
      
      if (wasLiked) {
        this.likedIds.delete(id);
      } else {
        this.likedIds.add(id);
      }
      
      try {
        const response = await apiService.toggleLike(id);
        
        
      } catch (error) {
        if (wasLiked) {
          this.likedIds.add(id);
        } else {
          this.likedIds.delete(id);
        }
      }
    },

    clearFavorites() {
      this.likedIds = [];
      console.log(' Like lar tozalandi');
    }
  }
});
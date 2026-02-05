import { defineStore } from 'pinia';
import telegram from '@/services/telegram';
import apiService from '@/services/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    language: 'en',
    theme: 'light',
    favorites: [],
    orders: [],
    loading: false
  }),

  getters: {
    userName: (state) => {
      if (!state.user) return 'Guest';
      return state.user.first_name + (state.user.last_name ? ` ${state.user.last_name}` : '');
    },

    userInitials: (state) => {
      if (!state.user) return 'G';
      const first = state.user.first_name?.[0] || '';
      const last = state.user.last_name?.[0] || '';
      return (first + last).toUpperCase() || 'U';
    },

    isFavorite: (state) => (productId) => {
      return state.favorites.includes(productId);
    },

    isDarkMode: (state) => state.theme === 'dark'
  },

  actions: {
    initUser() {
      // Get user from Telegram
      const telegramUser = telegram.getUser();
      this.user = telegramUser;

      // Get theme
      this.theme = telegram.getColorScheme();

      // Load language preference
      const savedLanguage = localStorage.getItem('language');
      this.language = savedLanguage || telegramUser.language_code || 'en';

      // Load favorites
      this.loadFavorites();
    },

    setLanguage(lang) {
      this.language = lang;
      localStorage.setItem('language', lang);
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.applyTheme();
      telegram.hapticFeedback('selection');
    },

    setTheme(theme) {
      this.theme = theme;
      this.applyTheme();
    },

    applyTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    async toggleFavorite(productId) {
      const index = this.favorites.indexOf(productId);
      
      if (index > -1) {
        this.favorites.splice(index, 1);
        telegram.hapticFeedback('light');
        
        if (this.user) {
          await apiService.removeFavorite(this.user.id, productId);
        }
      } else {
        this.favorites.push(productId);
        telegram.hapticFeedback('success');
        
        if (this.user) {
          await apiService.addFavorite(this.user.id, productId);
        }
      }
      
      this.saveFavorites();
    },

    saveFavorites() {
      try {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    },

    loadFavorites() {
      try {
        const saved = localStorage.getItem('favorites');
        if (saved) {
          this.favorites = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
        this.favorites = [];
      }
    },

    async fetchOrders() {
      if (!this.user) return;
      
      this.loading = true;
      try {
        this.orders = await apiService.getOrders(this.user.id);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchFavorites() {
      if (!this.user) return;
      
      try {
        const favoriteIds = await apiService.getFavorites(this.user.id);
        this.favorites = favoriteIds;
        this.saveFavorites();
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      }
    }
  }
});

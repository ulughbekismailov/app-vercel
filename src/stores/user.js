import { defineStore } from 'pinia';
import apiService from '@/services/api';
import telegram from '@/services/telegram';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    theme: localStorage.getItem('theme') || 'light'  // ✅ THEME STATE
  }),

  getters: {
    userId: (state) => state.user?.telegram_id,
    userName: (state) => state.user?.first_name || state.user?.username || 'User',
    isDarkMode: (state) => state.theme === 'dark'  // ✅ GETTER
  },

  actions: {
    // ✅ GET /users/me/
    async fetchCurrentUser() {
      this.loading = true;
      try {
        const data = await apiService.getCurrentUser();
        this.user = data
      } catch (error) {
        console.error('User yuklanmadi:', error);
      } finally {
        this.loading = false;
      }
    },

    // ✅ THEME TOGGLE
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      
      // localStorage ga saqlash
      localStorage.setItem('theme', this.theme);
      
      // HTML ga qo'llash
      this.applyTheme();
    },

    // ✅ THEME QO'LLASH
    applyTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    // ✅ BOSHLANG'ICH THEME YUKLASH
    initTheme() {
      this.applyTheme();  // localStorage dan kelgan theme ni qo'llash
    }
  }
});
import { defineStore } from 'pinia';
import apiService from '@/services/api';
import telegram from '@/services/telegram';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    theme: localStorage.getItem('theme') || 'light'
  }),

  getters: {
    userId: (state) => state.user?.telegram_id || state.user?.id,
    userName: (state) => state.user?.first_name || state.user?.username || 'User',
    userFullName: (state) => {
      if (!state.user) return 'Guest';
      const first = state.user.first_name || '';
      const last = state.user.last_name || '';
      return `${first} ${last}`.trim() || state.user.username || 'User';
    },
    userUsername: (state) => state.user?.username || null,
    
    isDarkMode: (state) => state.theme === 'dark',
    currentTheme: (state) => state.theme
  },

  actions: {
    async fetchCurrentUser() {
      this.loading = true;
      this.error = null;
      
      try {
        const data = await apiService.getCurrentUser();
        this.user = data;
        console.log('✅ User data fetched:', this.userName);
        return data;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.error = 'Failed to load user data';
        
        if (telegram.isInTelegram()) {
          const tgUser = telegram.getUser();
          this.user = {
            telegram_id: tgUser.id,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name,
            username: tgUser.username,
            language_code: tgUser.language_code
          };
          console.log('⚠️ Using Telegram user data as fallback');
        }
        
        throw error;
      } finally {
        this.loading = false;
      }
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      
      localStorage.setItem('theme', this.theme);
      
      localStorage.setItem('userManuallySetTheme', 'true');
      
      this.applyTheme();
      
      telegram.hapticFeedback('light');
      
      console.log('🎨 Theme toggled to:', this.theme);
    },

    setTheme(newTheme) {
      if (this.theme === newTheme) return;
      
      this.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      this.applyTheme();
      
      console.log('🎨 Theme set to:', newTheme);
    },

    applyTheme() {
      const html = document.documentElement;
      
      if (this.theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      
      if (telegram.isInTelegram()) {
        const themeParams = telegram.getThemeParams();
        if (themeParams.bg_color) {
          document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
        }
        if (themeParams.text_color) {
          document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
        }
      }
    },


    initTheme() {
      this.applyTheme();
      console.log('🎨 Theme initialized:', this.theme);
    },


    resetThemeToTelegram() {
      localStorage.removeItem('userManuallySetTheme');
      
      if (telegram.isInTelegram()) {
        const telegramTheme = telegram.isDarkMode() ? 'dark' : 'light';
        this.setTheme(telegramTheme);
        console.log('🎨 Theme reset to Telegram:', telegramTheme);
      }
      
      telegram.hapticFeedback('light');
    },

    clearUser() {
      this.user = null;
      this.error = null;
      console.log(' User data cleared');
    }
  }
});
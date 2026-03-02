import { defineStore } from 'pinia';
import apiService from '@/services/api';
import telegram from '@/services/telegram';
import { translations } from '@/services/i18n';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'ru'
  }),

  getters: {

    t: (state) => (key) => {
      return translations[state.language]?.[key] || key;
    },


    currentLanguage: (state) => state.language,
    userTelegramLanguage: (state) => state.user?.language_code || 'ru',

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

        if (telegram.isInTelegram()) {
          const tgUser = telegram.getUser();
          console.log("Tg User aniqlandi",tgUser);
          this.user = {
            telegram_id: tgUser?.id || null,
            first_name: tgUser?.first_name || 'Unknown',
            last_name: tgUser?.last_name || '',
            username: tgUser?.username || null,
            language_code: tgUser?.language_code || 'en',
        };
        // const data = await apiService.getCurrentUser();
        // this.user = data;
        }
        if(data?.language_code){
          if(!localStorage.getItem('userLanguageSet')){
            this.setLanguage(data.language_code);
          }
        }
        this.initLanguage();
        return data;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.error = 'Failed to load user data';

        throw error;
      } finally {
        this.loading = false;
      }
    },


    setLanguage(lang) {
      this.language = lang;
      localStorage.setItem('language', lang);
      localStorage.setItem('userLanguageSet', 'true');
      
      document.documentElement.lang = lang;
      
      console.log('Language set to:', lang);
    },

    resetToTelegramLanguage() {
      localStorage.removeItem('userLanguageSet');
      if (this.user?.language_code) {
        this.setLanguage(this.user.language_code);
      }
    },


    initLanguage() {
      const userSet = localStorage.getItem('userLanguageSet'); 
      const savedLang = localStorage.getItem('language');
      
      if (userSet && savedLang) {
        this.setLanguage(savedLang);
      } else if (this.user?.language_code) {
        this.setLanguage(this.user.language_code);
        localStorage.removeItem('userLanguageSet');
      }
    },

    setTheme(newTheme) {
        this.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        this.applyTheme();
    },

    toggleTheme() {
      const newTheme = this.theme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
      localStorage.setItem('userManuallySetTheme', 'true');
      telegram.hapticFeedback('light');
    },

    applyTheme() {
      const html = document.documentElement;
      if (this.theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    },


    initTheme() {
      this.applyTheme();
    },


    resetThemeToTelegram() {
      localStorage.removeItem('userManuallySetTheme');
      
      if (telegram.isInTelegram()) {
        const telegramTheme = telegram.isDarkMode() ? 'dark' : 'light';
        this.setTheme(telegramTheme);
        console.log('Theme reset to Telegram:', telegramTheme);
      }
      
      telegram.hapticFeedback('light');
    },

    clearUser() {
      this.user = null;
      this.error = null;
      console.log('User data cleared');
    }
  }
});
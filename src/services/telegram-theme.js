import telegram from './telegram';

class TelegramThemeService {
  constructor(userStore) {
    this.userStore = userStore;
    this.init();
  }

  init() {
    // App boshlanganda user override bormi?
    const userOverride = localStorage.getItem('userManuallySetTheme') === 'true';
    
    if (!userOverride && telegram.isInTelegram()) {
      this.syncWithTelegram();
    }

    // Telegram o'zgarishlarini kuzatish
    if (telegram.isInTelegram()) {
      telegram.onThemeChanged(() => {
        const userOverride = localStorage.getItem('userManuallySetTheme') === 'true';
        if (!userOverride) {
          console.log('📱 Telegram theme changed, syncing...');
          this.syncWithTelegram();
        }
      });
    }
  }

  syncWithTelegram() {
    if (!telegram.isInTelegram()) return;
    
    const isDark = telegram.isDarkMode();
    const telegramTheme = isDark ? 'dark' : 'light';
    
    console.log('🎨 Syncing with Telegram theme:', telegramTheme);
    
    this.userStore.setTheme(telegramTheme);
  }
}

export default TelegramThemeService;
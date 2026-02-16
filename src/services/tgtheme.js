// services/telegram-theme.js
import telegram from './telegram';

class TelegramThemeService {
  constructor(userStore) {
    this.userStore = userStore;
    this.init();
  }

  init() {
    telegram.onThemeChanged(() => {
      this.syncWithTelegram();
    });

    this.syncWithTelegram();
  }

  syncWithTelegram() {
    const isDark = telegram.isDarkMode();
    const telegramTheme = isDark ? 'dark' : 'light';
    this.userStore.setTheme(telegramTheme);
  }
}

export default TelegramThemeService;
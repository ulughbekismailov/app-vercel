import telegram from './telegram';

class TelegramThemeService {
  constructor(userStore) {
    this.userStore = userStore;
    this.isUserOverride = false; 
    this.init();
  }

  init() {

    const savedTheme = localStorage.getItem('theme');
    const userManuallySetTheme = localStorage.getItem('userManuallySetTheme');
    
    if (userManuallySetTheme === 'true') {
      this.isUserOverride = true;
      console.log('🎨 User has manual theme preference:', savedTheme);
      return;
    }


    if (telegram.isInTelegram() && !this.isUserOverride) {
      this.syncWithTelegram();
    }

    if (telegram.isInTelegram()) {
      telegram.onThemeChanged(() => {
        if (!this.isUserOverride) {
          console.log('📱 Telegram theme changed, syncing...');
          this.syncWithTelegram();
        } else {
          console.log('📱 Telegram theme changed, but user preference exists');
        }
      });
    }
  }


  syncWithTelegram() {
    if (!telegram.isInTelegram()) return;

    const isDark = telegram.isDarkMode();
    const telegramTheme = isDark ? 'dark' : 'light';
    
    console.log('🎨 Syncing with Telegram theme:', telegramTheme);
    
    this.userStore.theme = telegramTheme;
    this.userStore.applyTheme();
    
    localStorage.setItem('theme', telegramTheme);
  }

  enableUserOverride() {
    this.isUserOverride = true;
    localStorage.setItem('userManuallySetTheme', 'true');
    console.log('🎨 User theme override enabled');
  }


  disableUserOverride() {
    this.isUserOverride = false;
    localStorage.removeItem('userManuallySetTheme');
    this.syncWithTelegram();
    console.log('🎨 User theme override disabled, syncing with Telegram');
  }


  hasUserPreference() {
    return this.isUserOverride;
  }
}

export default TelegramThemeService;
// ============================================================
// TELEGRAM THEME SYNCHRONIZATION SERVICE
// ============================================================
// This service syncs the app theme with Telegram's theme
// It listens for theme changes from Telegram and updates the app
// User's manual theme preference (from toggle) takes priority

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
      return; // Don't sync with Telegram if user has preference
    }

    // ============================================================
    // 2️⃣ SYNC WITH TELEGRAM THEME ON INIT
    // ============================================================
    if (telegram.isInTelegram() && !this.isUserOverride) {
      this.syncWithTelegram();
    }

    // ============================================================
    // 3️⃣ LISTEN FOR TELEGRAM THEME CHANGES
    // ============================================================
    if (telegram.isInTelegram()) {
      telegram.onThemeChanged(() => {
        // Only sync if user hasn't manually set a theme
        if (!this.isUserOverride) {
          console.log('📱 Telegram theme changed, syncing...');
          this.syncWithTelegram();
        } else {
          console.log('📱 Telegram theme changed, but user preference exists');
        }
      });
    }
  }

  // ============================================================
  // SYNC THEME WITH TELEGRAM
  // ============================================================
  syncWithTelegram() {
    if (!telegram.isInTelegram()) return;

    const isDark = telegram.isDarkMode();
    const telegramTheme = isDark ? 'dark' : 'light';
    
    console.log('🎨 Syncing with Telegram theme:', telegramTheme);
    
    // Update user store theme
    this.userStore.theme = telegramTheme;
    this.userStore.applyTheme();
    
    // Save to localStorage (but not as user preference)
    localStorage.setItem('theme', telegramTheme);
  }

  // ============================================================
  // ENABLE USER OVERRIDE (called when user manually toggles)
  // ============================================================
  enableUserOverride() {
    this.isUserOverride = true;
    localStorage.setItem('userManuallySetTheme', 'true');
    console.log('🎨 User theme override enabled');
  }

  // ============================================================
  // DISABLE USER OVERRIDE (reset to Telegram sync)
  // ============================================================
  disableUserOverride() {
    this.isUserOverride = false;
    localStorage.removeItem('userManuallySetTheme');
    this.syncWithTelegram();
    console.log('🎨 User theme override disabled, syncing with Telegram');
  }

  // ============================================================
  // CHECK IF USER HAS THEME PREFERENCE
  // ============================================================
  hasUserPreference() {
    return this.isUserOverride;
  }
}

export default TelegramThemeService;
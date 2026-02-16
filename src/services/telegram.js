// Telegram WebApp SDK wrapper
class TelegramService {
  constructor() {
    this.webApp = window.Telegram?.WebApp || null;
    this.isInitialized = false;
  }

  init() {
    if (!this.webApp || this.isInitialized) return;
    
    this.webApp.ready();
    this.webApp.expand();
    this.webApp.enableClosingConfirmation();
    
    // Disable vertical swipes to prevent accidental closing
    this.webApp.disableVerticalSwipes();
    
    this.isInitialized = true;
    console.log('Telegram WebApp initialized');
  }

  // Theme Methods
  getThemeParams() {
    return this.webApp?.themeParams || {};
  }

  getColorScheme() {
    return this.webApp?.colorScheme || 'light';
  }

  isDarkMode() {
    return this.getColorScheme() === 'dark';
  }

  onThemeChanged(callback) {
    if (!this.webApp) return;
    this.webApp.onEvent('themeChanged', callback);
  }

  // User Data
  getUser() {
    return this.webApp?.initDataUnsafe?.user || {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      language_code: 'en'
    };
  }

  getUserId() {
    return this.getUser().id;
  }

  getStartParam() {
    return this.webApp?.initDataUnsafe?.start_param || null;
  }

  // MainButton Methods
  showMainButton(text, onClick) {
    if (!this.webApp) return;
    
    this.webApp.MainButton.setText(text);
    this.webApp.MainButton.show();
    this.webApp.MainButton.enable();
    
    if (onClick) {
      this.webApp.MainButton.onClick(onClick);
    }
  }

  hideMainButton() {
    if (!this.webApp) return;
    this.webApp.MainButton.hide();
    this.webApp.MainButton.offClick();
  }

  updateMainButton(text) {
    if (!this.webApp) return;
    this.webApp.MainButton.setText(text);
  }

  setMainButtonLoading(isLoading) {
    if (!this.webApp) return;
    
    if (isLoading) {
      this.webApp.MainButton.showProgress();
      this.webApp.MainButton.disable();
    } else {
      this.webApp.MainButton.hideProgress();
      this.webApp.MainButton.enable();
    }
  }

  // BackButton Methods
  showBackButton(onClick) {
    if (!this.webApp) return;
    
    this.webApp.BackButton.show();
    
    if (onClick) {
      this.webApp.BackButton.onClick(onClick);
    }
  }

  hideBackButton() {
    if (!this.webApp) return;
    this.webApp.BackButton.hide();
    this.webApp.BackButton.offClick();
  }

  // Haptic Feedback
  hapticFeedback(type = 'medium') {
    if (!this.webApp?.HapticFeedback) return;
    
    const types = {
      light: () => this.webApp.HapticFeedback.impactOccurred('light'),
      medium: () => this.webApp.HapticFeedback.impactOccurred('medium'),
      heavy: () => this.webApp.HapticFeedback.impactOccurred('heavy'),
      success: () => this.webApp.HapticFeedback.notificationOccurred('success'),
      warning: () => this.webApp.HapticFeedback.notificationOccurred('warning'),
      error: () => this.webApp.HapticFeedback.notificationOccurred('error'),
      selection: () => this.webApp.HapticFeedback.selectionChanged()
    };

    if (types[type]) {
      types[type]();
    }
  }

  // Utility Methods
  close() {
    if (!this.webApp) return;
    this.webApp.close();
  }

  openLink(url, options = {}) {
    if (!this.webApp) {
      window.open(url, '_blank');
      return;
    }
    this.webApp.openLink(url, options);
  }

  openTelegramLink(url) {
    if (!this.webApp) return;
    this.webApp.openTelegramLink(url);
  }

  showPopup(params) {
    if (!this.webApp) {
      alert(params.message);
      return;
    }
    this.webApp.showPopup(params);
  }

  showAlert(message) {
    if (!this.webApp) {
      alert(message);
      return;
    }
    this.webApp.showAlert(message);
  }

  showConfirm(message, callback) {
    if (!this.webApp) {
      const result = confirm(message);
      callback(result);
      return;
    }
    this.webApp.showConfirm(message, callback);
  }

  // Check if running in Telegram
  isInTelegram() {
    return !!this.webApp;
  }

  // Get init data for API requests
  getInitData() {
    if (window.Telegram?.WebApp?.initData) {
      return window.Telegram.WebApp.initData;
    }
    return null;
  }

  // Platform info
  getPlatform() {
    return this.webApp?.platform || 'unknown';
  }

  getVersion() {
    return this.webApp?.version || '0.0';
  }
}

export default new TelegramService(); 

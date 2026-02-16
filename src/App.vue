<template>
  <div id="app" class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <BottomNavigation/>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useFavoriteStore } from '@/stores/favorites';
import { useCartStore } from '@/stores/cart';
import TelegramThemeService from '@/services/telegram-theme';
import telegram from '@/services/telegram';
import BottomNavigation from '@/components/BottomNavigation.vue';

const userStore = useUserStore();
const favoriteStore = useFavoriteStore();
const cartStore = useCartStore();

onMounted(async () => {
  // ============================================================
  // 1️⃣ INITIALIZE TELEGRAM WEBAPP (CRITICAL!)
  // ============================================================
  telegram.init();
  console.log('✅ Telegram WebApp initialized');
  console.log('Platform:', telegram.getPlatform());
  console.log('Version:', telegram.getVersion());
  console.log('Is in Telegram:', telegram.isInTelegram());
  
  // ============================================================
  // 2️⃣ INITIALIZE THEME SYSTEM
  // ============================================================
  // Check localStorage first, then fallback to Telegram theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    userStore.theme = savedTheme;
  } else if (telegram.isInTelegram()) {
    // Use Telegram's theme as default if no saved preference
    const telegramTheme = telegram.isDarkMode() ? 'dark' : 'light';
    userStore.theme = telegramTheme;
  }
  
  // Apply the theme immediately
  userStore.applyTheme();
  
  // Initialize theme sync service (listens for Telegram theme changes)
  new TelegramThemeService(userStore);
  
  // ============================================================
  // 3️⃣ LOAD USER DATA & APP STATE (PARALLEL)
  // ============================================================
  try {
    // Execute all data fetching in parallel for better performance
    await Promise.all([
      userStore.fetchCurrentUser(),
      favoriteStore.loadLikes(),
      cartStore.fetchCart()
    ]);
    
    console.log('✅ User data loaded');
    console.log('✅ Favorites loaded:', favoriteStore.count);
    console.log('✅ Cart loaded:', cartStore.itemCount, 'items');
  } catch (error) {
    console.error('❌ Error loading initial data:', error);
    // Don't block app initialization if data loading fails
    // User can retry from individual pages
  }
});

// ============================================================
// 4️⃣ WATCH FOR THEME CHANGES (REACTIVE)
// ============================================================
watch(() => userStore.theme, (newTheme) => {
  userStore.applyTheme();
  console.log('Theme changed to:', newTheme);
}, { immediate: false });
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>

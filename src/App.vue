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
import TelegramThemeService from '@/services/telegram-theme';
import telegram from '@/services/telegram';
import BottomNavigation from '@/components/BottomNavigation.vue'
import { useUserStore } from '@/stores/user';
import { useFavoriteStore } from '@/stores/favorites';
import { useCartStore } from '@/stores/cart';
import { useProductStore } from '@/stores/product'


const userStore = useUserStore();
const favoriteStore = useFavoriteStore();
const cartStore = useCartStore();
const productStore = useProductStore()


onMounted(async () => {

  telegram.init();
  console.log('✅ Telegram WebApp initialized');
  console.log('Platform:', telegram.getPlatform(), 'Version:',telegram.getVersion());
  

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    userStore.theme = savedTheme;
  } else if (telegram.isInTelegram()) {
    const telegramTheme = telegram.isDarkMode() ? 'dark' : 'light';
    userStore.theme = telegramTheme;
  }
  
  userStore.applyTheme();
  
  new TelegramThemeService(userStore);

  try {
    await Promise.all([
      productStore.fetchProducts(),
      userStore.fetchCurrentUser(),
      favoriteStore.loadLikes(),
      cartStore.fetchCart()
    ]);
    
    console.log('✅ User data loaded');


  } catch (error) {
    console.error('Error loading initial data:', error);

  }
});



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

/* #app {
  padding-bottom: env(safe-area-inset-bottom);
} */
</style>

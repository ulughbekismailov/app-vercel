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
import TelegramThemeService from '@/services/telegram-theme';
import telegram from '@/services/telegram';
import BottomNavigation from '@/components/BottomNavigation.vue'
const userStore = useUserStore();

onMounted(async () => {
  // Initialize Telegram WebApp
  // telegram.init();

  // Initialize user
  await userStore.fetchCurrentUser();
  new TelegramThemeService(userStore);


  // Apply theme

  // userStore.applyTheme();

  // Listen for theme changes from Telegram

  // telegram.onThemeChanged(() => {
  //   const newTheme = telegram.getColorScheme();
  //   userStore.setTheme(newTheme);
  // });

  console.log('Telegram Platform:', telegram.getPlatform());
  console.log('Telegram Version:', telegram.getVersion());
  console.log('Is in Telegram:', telegram.isInTelegram());
});


// Watch for theme changes

// watch(() => userStore.theme, () => {
//   userStore.applyTheme();
// });
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

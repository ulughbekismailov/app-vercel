<template>
  <div class="profile-page min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slide-up">
      <div class="app-container px-4 py-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-telegram-blue to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            UI
          </div>
          <div class="flex-1">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              {{user.first_name}}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              @{{ user.username }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <div class="px-4 pt-4 pb-24 space-y-4">
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-3 animate-slide-up stagger-1">
        <div class="card p-4 text-center">
          <div class="text-3xl font-bold text-telegram-blue mb-1">
            {{orderCount}}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ userStore.t('orders') }}
          </div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-3xl font-bold text-telegram-blue mb-1">
            {{favoritesCount}}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ userStore.t('favorites') }}
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="card overflow-hidden animate-slide-up stagger-2">
        <router-link
          to="/orders"
          class="menu-item flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:bg-gray-100 dark:active:bg-gray-700"
          @click="telegram.hapticFeedback('light')"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ userStore.t('orderHistory') }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ userStore.t('viewYourPastOrders') }}</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>

        <div class="border-t border-gray-200 dark:border-gray-700"></div>

        <router-link
          to="/favorites"
          class="menu-item flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:bg-gray-100 dark:active:bg-gray-700"
          @click="telegram.hapticFeedback('light')"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ userStore.t('favorites') }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ userStore.t('yourSavedProducts') }}</p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Settings -->
      <div class="card overflow-hidden animate-slide-up stagger-3">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="font-semibold text-gray-900 dark:text-white">{{ userStore.t('settings') }}</h2>
        </div>

        <!-- Theme Toggle -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ userStore.t('theme') }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ isDarkMode ? 'Dark' : 'Light' }} mode</p>
            </div>
          </div>
          <button
            @click="toggleTheme"
            class="relative w-14 h-8 rounded-full transition-colors duration-200"
            :class="isDarkMode ? 'bg-telegram-blue' : 'bg-gray-300'"
          >
            <span
              class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 shadow-md"
              :class="{ 'translate-x-6': isDarkMode }"
            ></span>
          </button>
        </div>

        <!-- Language Selector -->
        <div class="p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ userStore.t('language') }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ userStore.t('chooseYourPreferredLanguage') }}</p>
            </div>
          </div>
          <select
            v-model="selectedLanguage"
            @change="changeLanguage"
            class="input-field"
          >
            <option value="ru">Русский</option>
            <option value="uz">O'zbek</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <!-- App Info -->
      <div class="card p-4 text-center animate-slide-up stagger-4">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Mini Shop v1.0.0
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-500">
          Made with ❤️ for Telegram
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import telegram from '@/services/telegram';
import { useFavoriteStore } from '@/stores/favorites';
import { useOrderStore } from '@/stores/order';

const favoriteStore = useFavoriteStore();
const userStore = useUserStore();
const orderStore = useOrderStore();

const orderCount = computed(()=> orderStore.orders.length)
const favoritesCount = computed(()=> favoriteStore.likedIds.size)
const user = computed(() => userStore.user);

const selectedLanguage = ref(userStore.language);



const isDarkMode = computed(() => userStore.isDarkMode);

const toggleTheme = () => {
  userStore.toggleTheme();
};

const changeLanguage = () => {
  userStore.setLanguage(selectedLanguage.value);
  telegram.hapticFeedback('success');
  telegram.showAlert('Language changed successfully!');
};

onMounted(async() => {
  await favoriteStore.loadLikes();
  await orderStore.fetchOrders();

  if (!localStorage.getItem('userLanguageSet') && user.value?.language_code) {
    selectedLanguage.value = user.value.language_code;
  } else {
    selectedLanguage.value = userStore.language;
  }
});
</script>

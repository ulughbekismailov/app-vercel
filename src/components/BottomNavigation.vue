<template>
  <nav class="bottom-nav fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-area-bottom">
    <div class="app-container">
      <div class="flex items-center justify-around py-2">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="nav-item flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 min-w-[70px]"
          :class="{ 'active': isActive(item.path) }"
          @click="handleClick"
        >
          <div class="relative">
            <component 
              :is="item.icon" 
              class="w-6 h-6 transition-colors duration-200"
              :class="isActive(item.path) ? 'text-telegram-blue' : 'text-gray-500 dark:text-gray-400'"
            />
            <span 
              v-if="item.badge && getBadgeCount(item.badge) > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ getBadgeCount(item.badge) }}
            </span>
          </div>
          <span 
            class="text-xs mt-1 font-medium transition-colors duration-200"
            :class="isActive(item.path) ? 'text-telegram-blue' : 'text-gray-500 dark:text-gray-400'"
          >
            {{ item.label }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, h } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import telegram from '@/services/telegram';

// Icons as template strings for simplicity
// Icon komponentlarini render funksiya bilan yaratish
const HomeIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
    class: 'w-6 h-6'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    })
  ])
};

const CartIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
    class: 'w-6 h-6'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
    })
  ])
};

const ProfileIcon = {
  render: () => h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
    class: 'w-6 h-6'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    })
  ])
};

const navItems = [
  { name: 'home', label: '', path: '/', icon: HomeIcon },
  { name: 'cart', label: '', path: '/cart', icon: CartIcon, badge: 'cart' },
  { name: 'profile', label: '', path: '/profile', icon: ProfileIcon }
];

const route = useRoute();
const cartStore = useCartStore();

const isActive = (path) => {
  return route.path === path;
};

const getBadgeCount = (badge) => {
  if (badge === 'cart') {
    return cartStore.itemCount;
  }
  return 0;
};

const handleClick = () => {
  telegram.hapticFeedback('light');
};
</script>

<style scoped>
.nav-item.active {
  @apply bg-telegram-blue/5 dark:bg-telegram-blue/10;
}

.bottom-nav {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.dark .bottom-nav {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}
</style>

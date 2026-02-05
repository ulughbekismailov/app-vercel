import { createRouter, createWebHistory } from 'vue-router';
import telegram from '@/services/telegram';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Shop', showBottomNav: true }
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: () => import('@/pages/ProductPage.vue'),
    meta: { title: 'Product Details', showBackButton: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/pages/CartPage.vue'),
    meta: { title: 'Cart', showBottomNav: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/pages/CheckoutPage.vue'),
    meta: { title: 'Checkout', showBackButton: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/ProfilePage.vue'),
    meta: { title: 'Profile', showBottomNav: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/pages/OrdersPage.vue'),
    meta: { title: 'Order History', showBackButton: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/pages/FavoritesPage.vue'),
    meta: { title: 'Favorites', showBackButton: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Navigation guards
router.beforeEach((to, from, next) => {
  // Handle Telegram back button
  if (to.meta.showBackButton) {
    telegram.showBackButton(() => {
      router.back();
    });
  } else {
    telegram.hideBackButton();
  }

  // Update page title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  next();
});

router.afterEach(() => {
  // Hide main button by default on navigation
  telegram.hideMainButton();
});

export default router;

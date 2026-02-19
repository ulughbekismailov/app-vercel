<template>
  <div class="cart-page min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slide-up">
      <div class="app-container px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          Shopping Cart
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }} in cart
        </p>
      </div>
    </header>

    <!-- Cart Content -->
    <div class="px-4 pt-4 pb-24">
      <!-- Empty Cart -->
      <div v-if="cartItems.length === 0" class="text-center py-20 animate-fade-in">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Your cart is empty
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Start shopping to add items to your cart
        </p>
        <button
          @click="goToHome"
          class="btn-primary inline-block"
        >
          Browse Products
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="space-y-3">
        <CartItem
          v-for="item in cartItems"
          :key="item.id"
          :item="item"
        />

        <!-- Clear Cart Button -->
        <button
          @click="confirmClearCart"
          class="w-full py-3 text-red-500 font-medium text-sm rounded-xl border-2 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 active:scale-98"
        >
          Clear All Items
        </button>
      </div>

      <!-- Order Summary -->
      <div v-if="cartItems.length > 0" class="mt-6 card p-4 animate-slide-up stagger-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Order Summary
        </h3>

        <div class="space-y-3">
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal ({{ itemCount }} items)</span>
            <span>${{ totalPrice }}</span>
          </div>

          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Shipping</span>
            <span class="text-green-600 dark:text-green-400">Free</span>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
            <span class="text-xl font-bold text-gray-900 dark:text-white">
              Total
            </span>
            <span class="text-2xl font-bold text-telegram-blue">
              ${{ totalPrice }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Checkout Button -->
    <div 
      v-if="cartItems.length > 0"
      class="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 safe-area-bottom z-50"
    >
      <div class="app-container pb-4">
        <button
          @click="proceedToCheckout"
          class="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import CartItem from '@/components/CartItem.vue';
import telegram from '@/services/telegram';

const router = useRouter();
const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const itemCount = computed(() => cartStore.total_items);
const totalPrice = computed(() => cartStore.subtotal);

const goToHome = () => {
  telegram.hapticFeedback('light');
  router.push('/');
};

const proceedToCheckout = () => {
  telegram.hapticFeedback('medium');
  router.push('/checkout');
};

const confirmClearCart = () => {
  telegram.showConfirm('Are you sure you want to clear all items from your cart?', async (confirmed) => {
    if (confirmed) {
      telegram.hapticFeedback('medium');
      
      try {
        await cartStore.clearCart();
        telegram.hapticFeedback('success');
        console.log('✅ Cart cleared');
      } catch (error) {
        console.error('Failed to clear cart:', error);
        telegram.hapticFeedback('error');
        telegram.showAlert('Failed to clear cart. Please try again.');
      }
    }
  });
};


let backButtonHandler = null;

onMounted(async () => {
  backButtonHandler = () => {
    telegram.hapticFeedback('light');
    router.push('/');
  };
  
  telegram.showBackButton(backButtonHandler);

  try {
    await cartStore.fetchCart();
    console.log('✅ Cart loaded:', itemCount.value, 'items');
  } catch (error) {
    console.error('Failed to load cart:', error);
  }

});

onUnmounted(() => {
  telegram.hideBackButton();
  console.log('✅ Back button hidden on CartPage unmount');
});

</script>

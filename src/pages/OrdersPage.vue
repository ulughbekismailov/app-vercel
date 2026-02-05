<template>
  <div class="orders-page min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slide-up">
      <div class="app-container px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          Order History
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track your orders
        </p>
      </div>
    </header>

    <div class="px-4 pt-4 space-y-3">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="card h-32 animate-pulse bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center py-20 animate-fade-in">
        <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No orders yet
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Your order history will appear here
        </p>
        <button
          @click="$router.push('/')"
          class="btn-primary inline-block"
        >
          Start Shopping
        </button>
      </div>

      <!-- Orders List -->
      <div v-else>
        <div
          v-for="order in orders"
          :key="order.id"
          class="card p-4 animate-fade-in"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">
                Order #{{ order.id }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(order.date) }}
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {{ order.items }} {{ order.items === 1 ? 'item' : 'items' }}
              </p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                ${{ order.total.toFixed(2) }}
              </p>
            </div>
            <button
              @click="viewOrderDetails(order.id)"
              class="btn-secondary text-sm"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import telegram from '@/services/telegram';

const router = useRouter();
const userStore = useUserStore();

const loading = computed(() => userStore.loading);
const orders = computed(() => userStore.orders);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getStatusClass = (status) => {
  const classes = {
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };
  return classes[status] || classes.processing;
};

const getStatusText = (status) => {
  const texts = {
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return texts[status] || 'Unknown';
};

const viewOrderDetails = (orderId) => {
  telegram.hapticFeedback('light');
  telegram.showAlert(`Order #${orderId} details would be shown here`);
};

onMounted(() => {
  userStore.fetchOrders();
});
</script>

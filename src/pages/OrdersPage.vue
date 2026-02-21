<template>
  <div class="orders-page min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slide-up">
      <div class="app-container px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          {{ userStore.t('orderHistory') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ userStore.t('trackYourOrders') }}
        </p>
      </div>
    </header>

    <div class="px-4 pt-4 space-y-3">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="card h-32 animate-pulse bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!orders" class="text-center py-20 animate-fade-in">
        <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ userStore.t('noOrders') }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ userStore.t('orderHistoryInfo') }}
        </p>
        <button
          @click="$router.push('/')"
          class="btn-primary inline-block"
        >
          {{ userStore.t('startShopping') }}
        </button>
      </div>

      <!-- Orders List -->
      <div class="space-y-2" v-else>
        <div
          v-for="order in orders"
          :key="order.id"
          class="card p-4 animate-fade-in"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{order.id}}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(order.created_at) }}
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="getStatusClass(order.status)"
            >
              {{ order.status }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }}
              </p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                ${{ Number(order.total_price).toFixed(2) }}
              </p>
            </div>
            <button
              @click="viewOrderDetails(order.id)"
              class="btn-secondary text-sm"
            >
              {{ userStore.t('viewDetails') }}
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
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order';
import telegram from '@/services/telegram';


const router = useRouter();
const orderStore = useOrderStore();
const userStore = useUserStore()


const loading = computed(() => userStore.loading);
const orders = computed(() => orderStore.orders);


console.log(orders);

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
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    Delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-40'
  };
  return classes[status] || classes.Processing;
};

const viewOrderDetails = (orderId) => {
  telegram.hapticFeedback('light');
  
  // 1️⃣ Order ni topish
  const order = orderStore.orders.find(o => o.id === orderId);
  
  if (!order) {
    telegram.showAlert('❌ Order not found');
    return;
  }
  
  // 2️⃣ Order ma'lumotlarini formatlash
  const orderDate = new Date(order.created_at).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // 3️⃣ Status badge
  const statusEmoji = {
    'Pending': '⏳',
    'Processing': '⚙️',
    'Shipped': '📦',
    'Delivered': '✅',
    'Cancelled': '❌'
  }[order.status] || '📋';
  
  // 4️⃣ Mahsulotlar ro'yxatini tuzish
  let itemsList = '';
  let total = 0;
  
  order.items.forEach((item, index) => {
    itemsList += `${index + 1}. ${item.product_name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}\n`;
    total += item.price * item.quantity;
  });
  
  // 5️⃣ To'liq xabarni yaratish
  const message = `
    📋 **ORDER #${order.id} DETAILS**

    📅 **Date:** ${orderDate}
    ${statusEmoji} **Status:** ${order.status}

    👤 **Customer:** ${order.customer_name || 'N/A'}
    📞 **Phone:** ${order.phone_number || 'Not provided'}
    📍 **Address:** ${order.shipping_address || 'N/A'}
    📝 **Notes:** ${order.notes || 'No notes'}

    🛍️ **ITEMS:**
    ${itemsList}
    ────────────────
    💰 **TOTAL: $${total.toFixed(2)}**

    💳 **Payment:** ${order.payment_method || 'Cash on Delivery'}
      `;
  
  // 6️⃣ Alertda ko'rsatish
  telegram.showAlert(message);
};

onMounted(async() => {
  await orderStore.fetchOrders();
  console.log("Order consolda", orders.value);
  
});
</script>

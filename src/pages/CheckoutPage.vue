<template>
  <div class="checkout-page min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slide-up">
      <div class="app-container px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          Checkout
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review your order details
        </p>
      </div>
    </header>

    <div class="px-4 pt-4 space-y-4">
      <!-- User Information -->
      <div class="card p-4 animate-slide-up">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-telegram-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Customer Information
        </h2>

        <div class="space-y-3">
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Full Name
            </label>
            <div class="input-field bg-gray-100 dark:bg-gray-900 cursor-not-allowed">
              {{ userName }}
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Telegram Username
            </label>
            <div class="input-field bg-gray-100 dark:bg-gray-900 cursor-not-allowed">
              @{{ user.username || 'N/A' }}
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Phone Number (Optional)
            </label>
            <input
              v-model="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              class="input-field"
            />
          </div>

          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Delivery Address
            </label>
            <textarea
              v-model="address"
              rows="3"
              placeholder="Enter your delivery address"
              class="input-field resize-none"
            ></textarea>
          </div>

          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Notes (Optional)
            </label>
            <textarea
              v-model="notes"
              rows="2"
              placeholder="Any special instructions?"
              class="input-field resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="card p-4 animate-slide-up stagger-1">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-telegram-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Order Summary
        </h2>

        <div class="space-y-3 mb-4">
          <div 
            v-for="item in cartItems" 
            :key="item.id"
            class="flex items-center gap-3 py-2"
          >
            <img 
              :src="item.image" 
              :alt="item.name"
              class="w-12 h-12 rounded-lg object-cover"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ item.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Qty: {{ item.quantity }} × ${{ item.price.toFixed(2) }}
              </p>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              ${{ (item.quantity * item.price).toFixed(2) }}
            </span>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${{ totalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Shipping</span>
            <span class="text-green-600 dark:text-green-400">Free</span>
          </div>
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-center">
            <span class="text-xl font-bold text-gray-900 dark:text-white">
              Total
            </span>
            <span class="text-2xl font-bold text-telegram-blue">
              ${{ totalPrice.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="card p-4 animate-slide-up stagger-2">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-telegram-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Payment Method
        </h2>

        <div class="space-y-2">
          <label class="flex items-center p-3 rounded-xl border-2 border-telegram-blue bg-telegram-blue/5 cursor-pointer">
            <input 
              type="radio" 
              name="payment" 
              value="cod"
              v-model="paymentMethod"
              class="w-5 h-5 text-telegram-blue"
              checked
            />
            <div class="ml-3 flex-1">
              <p class="font-medium text-gray-900 dark:text-white">Cash on Delivery</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Pay when you receive</p>
            </div>
          </label>

          <label class="flex items-center p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer opacity-50">
            <input 
              type="radio" 
              name="payment" 
              value="card"
              disabled
              class="w-5 h-5"
            />
            <div class="ml-3 flex-1">
              <p class="font-medium text-gray-900 dark:text-white">Card Payment</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Sticky Confirm Button -->
    <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 safe-area-bottom z-50">
      <div class="app-container">
        <button
          @click="placeOrder"
          :disabled="!isFormValid || isSubmitting"
          class="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isSubmitting ? 'Processing...' : 'Confirm Order' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import apiService from '@/services/api';
import telegram from '@/services/telegram';

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();

const phoneNumber = ref('');
const address = ref('');
const notes = ref('');
const paymentMethod = ref('cod');
const isSubmitting = ref(false);

const user = computed(() => userStore.user);
const userName = computed(() => userStore.userName);
const cartItems = computed(() => cartStore.cartItems);
const totalPrice = computed(() => cartStore.totalPrice);

const isFormValid = computed(() => {
  return address.value.trim().length > 0;
});

const placeOrder = async () => {
  if (!isFormValid.value || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const orderData = {
      user: {
        id: user.value.id,
        name: userName.value,
        username: user.value.username,
        phone: phoneNumber.value
      },
      items: cartStore.getOrderData().items,
      total: totalPrice.value,
      address: address.value,
      notes: notes.value,
      paymentMethod: paymentMethod.value,
      timestamp: new Date().toISOString()
    };

    const response = await apiService.createOrder(orderData);

    if (response.success) {
      telegram.hapticFeedback('success');
      
      // Clear cart
      cartStore.clearCart();

      // Show success message
      telegram.showAlert(response.message || 'Order placed successfully! We will contact you soon.');

      // Navigate to profile/orders
      setTimeout(() => {
        router.push('/orders');
      }, 1500);
    }
  } catch (error) {
    console.error('Order placement failed:', error);
    telegram.showAlert('Failed to place order. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  // Redirect if cart is empty
  if (cartItems.value.length === 0) {
    telegram.showAlert('Your cart is empty');
    router.push('/cart');
  }
});
</script>

<template>
  <div class="checkout-page min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slide-up">
      <div class="app-container px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          Checkout
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Complete your order
        </p>
      </div>
    </header>

    <div class="px-4 pt-4 space-y-4">
      <!-- ============================================================
           CUSTOMER INFORMATION
           ============================================================ -->
      <div class="card p-4 animate-slide-up">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-telegram-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Customer Information
        </h2>

        <div class="space-y-3">
          <!-- Full Name (from Telegram) -->
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Full Name
            </label>
            <div class="input-field bg-gray-100 dark:bg-gray-900 cursor-not-allowed">
              {{ userFullName }}
            </div>
          </div>

          <!-- Telegram Username -->
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Telegram Username
            </label>
            <div class="input-field bg-gray-100 dark:bg-gray-900 cursor-not-allowed">
              @{{ userUsername || 'N/A' }}
            </div>
          </div>

          <!-- Phone Number (Optional but validated) -->
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Phone Number <span class="text-xs">(Optional)</span>
            </label>
            <input
              v-model="phoneNumber"
              @input="validatePhone"
              @keypress="isNumber($event)"
              @focus="telegram.hapticFeedback('light')"
              maxlength="13"
              type="tel"
              placeholder="+998901234567"
              class="input-field"
              :class="{ 'border-red-500': phoneError }"
            />
            <p v-if="phoneError" class="text-red-500 text-xs mt-1">
              {{ phoneError }}
            </p>
            <p v-else class="text-gray-400 text-xs mt-1">
              Format: +998XXXXXXXXX
            </p>
          </div>

          <!-- Delivery Address (Required) -->
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Delivery Address <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="address"
              @input="validateAddress"
              @focus="telegram.hapticFeedback('light')"
              rows="3"
              placeholder="Enter your full delivery address (street, building, apartment)"
              class="input-field resize-none"
              :class="{ 'border-red-500': addressError }"
              required
            ></textarea>
            <p v-if="addressError" class="text-red-500 text-xs mt-1">
              {{ addressError }}
            </p>
            <p v-else class="text-gray-400 text-xs mt-1">
              Minimum 10 characters
            </p>
          </div>

          <!-- Notes (Optional) -->
          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Order Notes <span class="text-xs">(Optional)</span>
            </label>
            <textarea
              v-model="notes"
              @focus="telegram.hapticFeedback('light')"
              rows="2"
              placeholder="Any special instructions? (e.g., delivery time, floor number)"
              class="input-field resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- ============================================================
           ORDER SUMMARY
           ============================================================ -->
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
              :src="item.product_image || 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop'"
              :alt="item.product_name"
              class="w-12 h-12 rounded-lg object-cover"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ item.product_name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Qty: {{ item.quantity }} × ${{ item.product_price }}
              </p>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              ${{ item.total_price.toFixed(2) }}
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

      <!-- ============================================================
           PAYMENT METHOD
           ============================================================ -->
      <div class="card p-4 animate-slide-up stagger-2">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-telegram-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Payment Method
        </h2>

        <div class="space-y-2">
          <label 
            @click="selectPaymentMethod('cod')"
            class="flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200"
            :class="paymentMethod === 'cod' 
              ? 'border-telegram-blue bg-telegram-blue/5' 
              : 'border-gray-200 dark:border-gray-700'"
          >
            <input 
              type="radio" 
              name="payment" 
              value="cod"
              v-model="paymentMethod"
              class="w-5 h-5 text-telegram-blue"
            />
            <div class="ml-3 flex-1">
              <p class="font-medium text-gray-900 dark:text-white">Cash on Delivery</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Pay when you receive</p>
            </div>
          </label>

          <label class="flex items-center p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50">
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

    <!-- ============================================================
         STICKY CONFIRM BUTTON (Fallback if MainButton not available)
         ============================================================ -->
    <div 
      v-if="!useMainButton"
      class="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 safe-area-bottom z-50"
    >
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import telegram from '@/services/telegram';

// ============================================================
// ROUTER & STORES
// ============================================================
const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const orderStore = useOrderStore();

// ============================================================
// STATE
// ============================================================
const phoneNumber = ref('');
const address = ref('');
const notes = ref('');
const phoneError = ref('');
const addressError = ref('');
const paymentMethod = ref('cod');
const isSubmitting = ref(false);
const useMainButton = ref(telegram.isInTelegram());

// ============================================================
// COMPUTED
// ============================================================
const userFullName = computed(() => userStore.userFullName);
const userUsername = computed(() => userStore.userUsername);
const cartItems = computed(() => cartStore.items);
const totalPrice = computed(() => cartStore.subtotal);

const isFormValid = computed(() => {
  const isPhoneValid = !phoneNumber.value || validatePhone();
  const isAddressValid = validateAddress();
  return isAddressValid && isPhoneValid;
});

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

const isNumber = (evt) => {
  const char = String.fromCharCode(evt.keyCode);
  if (!/^[0-9+]$/.test(char)) {
    evt.preventDefault();
  }
};

const validatePhone = () => {
  if (!phoneNumber.value) {
    phoneError.value = '';
    return true;
  }

  const phoneRegex = /^\+998\d{9}$/;
  if (!phoneRegex.test(phoneNumber.value)) {
    phoneError.value = 'Phone format: +998XXXXXXXXX';
    return false;
  }
  
  phoneError.value = '';
  return true;
};

const validateAddress = () => {
  if (!address.value || address.value.trim().length < 10) {
    addressError.value = 'Address must be at least 10 characters';
    return false;
  }
  
  addressError.value = '';
  return true;
};

const selectPaymentMethod = (method) => {
  paymentMethod.value = method;
  telegram.hapticFeedback('selection');
};

// ============================================================
// ORDER PLACEMENT
// ============================================================
const placeOrder = async () => {
  if (!isFormValid.value || isSubmitting.value) {
    if (!isFormValid.value) {
      telegram.hapticFeedback('error');
      telegram.showAlert('Please fill in all required fields correctly');
    }
    return;
  }

  isSubmitting.value = true;
  telegram.setMainButtonLoading(true);
  telegram.hapticFeedback('heavy');

  try {
    const orderData = {
      shipping_address: address.value.trim(),
      phone_number: phoneNumber.value.trim() || '',
      notes: notes.value.trim() || ''
    };

    console.log('📦 Creating order:', orderData);

    const response = await orderStore.checkout(orderData);

    if (response) {
      telegram.hapticFeedback('success');
      await cartStore.fetchCart();

      console.log('✅ Order placed successfully:', response.id);

      setTimeout(() => {
        router.push('/orders');
      }, 1000);
    }
  } catch (error) {
    console.error('❌ Order error:', error);
    
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        'Failed to create order. Please try again.';
    
    telegram.hapticFeedback('error');
    telegram.showAlert(errorMessage);
  } finally {
    isSubmitting.value = false;
    telegram.setMainButtonLoading(false);
  }
};

// ============================================================
// LIFECYCLE - TELEGRAM INTEGRATION
// ============================================================
let backButtonHandler = null;
let mainButtonHandler = null;

onMounted(async () => {
  // ============================================================
  // 1️⃣ CHECK CART
  // ============================================================
  await cartStore.fetchCart();
  
  if (cartStore.items.length === 0) {
    telegram.showAlert('Your cart is empty');
    router.push('/cart');
    return;
  }

  // ============================================================
  // 2️⃣ SHOW BACK BUTTON
  // ============================================================
  backButtonHandler = () => {
    telegram.hapticFeedback('light');
    router.back();
  };
  telegram.showBackButton(backButtonHandler);

  // ============================================================
  // 3️⃣ SHOW MAIN BUTTON (Telegram feature)
  // ============================================================
  if (useMainButton.value) {
    mainButtonHandler = placeOrder;
    telegram.showMainButton('Confirm Order ($' + totalPrice.value.toFixed(2) + ')', mainButtonHandler);
  }

  console.log('✅ Checkout page initialized');
});

onUnmounted(() => {
  // ============================================================
  // CLEANUP
  // ============================================================
  telegram.hideBackButton();
  if (useMainButton.value) {
    telegram.hideMainButton();
  }
  console.log('✅ Checkout page cleaned up');
});
</script>

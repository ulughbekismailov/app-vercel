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
              Ulughbek  Ismailov
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Telegram Username
            </label>
            <div class="input-field bg-gray-100 dark:bg-gray-900 cursor-not-allowed">
              <!-- @{{ user.username || 'N/A' }} -->
               rootismail
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Phone Number (Optional)
            </label>
            <input
              v-model="phoneNumber"
              @input="validatePhone(phoneNumber)"
              @keypress="isNumber($event)"
              maxlength="13"
              type="tel"
              placeholder="+998123456789"
              class="input-field"
              :class="{ 'border-red-500': phoneError }"
            />
            <p v-if="phoneError" class="text-red-500 text-xs mt-1">
              {{ phoneError }}
            </p>
          </div>

          <div>
            <label class="text-sm text-gray-600 dark:text-gray-400 block mb-1">
              Delivery Address
            </label>
            <textarea
              v-model="address"
              @input="validateAddress(address)"
              rows="3"
              placeholder="Enter your delivery address"
              class="input-field resize-none"
              :class="{ 'border-red-500': addressError }"
              required
            ></textarea>
            <p v-if="addressError" class="text-red-500 text-xs mt-1">
              {{ addressError }}
            </p>
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
              src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop"
              class="w-12 h-12 rounded-lg object-cover"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ item.product_name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Qty: {{ item.quantity }} × {{ item.product_price }}
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
            <span>0.00 сум</span>
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
    <div class="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 safe-area-bottom z-50">
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
import { useOrderStore } from '@/stores/order'; // ✅ OrderStore qo'shildi
import telegram from '@/services/telegram';

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const orderStore = useOrderStore(); // ✅ OrderStore ishlatiladi



const user = computed(() => userStore.user);
const cartItems = computed(() => cartStore.items); // ✅ item.product_name, item.product_price, item.total_price
const totalPrice = computed(() => cartStore.subtotal); // ✅ subtotal


const phoneNumber = ref('');
const address = ref('');
const notes = ref('');
const phoneError = ref('');
const addressError = ref('');

const paymentMethod = ref('cod');
const isSubmitting = ref(false);

const isNumber = (evt) => {
  const char = String.fromCharCode(evt.keyCode);
  if (!/^[0-9+]$/.test(char)) {
    evt.preventDefault();  // ✅ Faqat raqam va + ga ruxsat
  }
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+998\d{9}$/;  // +998901234567
  if (phone && !phoneRegex.test(phone)) {
    phoneError.value = 'Telefon raqam formati: +998901234567';
    return false;
  }
  phoneError.value = '';
  return true;
};


const validateAddress = (addr) => {
  if (!addr || addr.trim().length < 5) {
    addressError.value = 'Manzil kamida 5 ta belgi bo\'lishi kerak';
    return false;
  }
  addressError.value = '';
  return true;
};


const isFormValid = computed(() => {
  const isPhoneValid = !phoneNumber.value || validatePhone(phoneNumber.value);
  const isAddressValid = validateAddress(address.value);
  
  return isAddressValid && isPhoneValid;
});


const placeOrder = async () => {
  // ============================================================
  // 1️⃣ TEKSHIRISH (Validation)
  // ============================================================
  
  if (!isFormValid.value || isSubmitting.value) return;

  if (!validateAddress(address.value)) {
    telegram.showAlert('Илтимос, манзилни тўлиқ киритинг.');
    return;
  }

  // Telefon raqamni tekshirish (agar kiritilgan bo'lsa)
  if (phoneNumber.value && !validatePhone(phoneNumber.value)) {
    telegram.showAlert('Телефон рақам формати: +998901234567');
    return;
  }

  // ============================================================
  // 2️⃣ YUBORISH (Submit)
  // ============================================================
  
  isSubmitting.value = true;  // Tugmani bosib bo'lmaydigan qilish

  try {
    // Backend kutayotgan ma'lumotlarni tayyorlash
    const orderData = {
      shipping_address: address.value.trim(),      // Manzil (majburiy)
      phone_number: phoneNumber.value.trim() || '', // Tel (ixtiyoriy)
      notes: notes.value.trim() || ''               // Izoh (ixtiyoriy)
    };

    console.log('📦 Yuborilayotgan order:', orderData);

    const response = await orderStore.checkout(orderData);

    // ============================================================
    // 3️⃣ MUVOFFAQIYATLI (Success)
    // ============================================================
    
    if (response) {
      telegram.hapticFeedback('success');           // Tebranish
      
      await cartStore.fetchCart();

      telegram.showAlert('✅ Буйуртмангиз қабул қилинди!');

      // Order confirmation sahifasiga o'tish
      setTimeout(() => {
        // router.push(`/order-confirmation/${response.id}`);
        router.push('/orders/');
      }, 1500);
    }
  } catch (error) {

    console.error('❌ Order xatosi:', error);
    
    // Backenddan kelgan xatolikni o'qish
    const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         'Buyurtma yaratishda xatolik yuz berdi';
    
    telegram.showAlert(errorMessage);
    telegram.hapticFeedback('error');
  } finally {
    // ============================================================
    // 5️⃣ TOZALASH (Cleanup)
    // ============================================================
    
    isSubmitting.value = false;  // Tugmani qayta bosish mumkin
  }
};


onMounted(() => {
  cartStore.fetchCart();
  
  if (cartStore.items.length === 0) {
    router.push('/cart');
  }
});
</script>
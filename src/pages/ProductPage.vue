<template>
  <div class="product-page min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse">
      <div class="w-full h-96 bg-gray-200 dark:bg-gray-800"></div>
      <div class="p-4 space-y-4">
        <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div class="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        <div class="h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="animate-fade-in">
      <!-- Image Slider -->
      <div class="relative bg-white dark:bg-gray-800 mb-4">
        <div class="relative h-96 overflow-hidden">
          <img 
            :src="product.image || 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop'"
            :alt="product.name"
            class="w-full h-full object-cover"
          />

          <!-- Favorite Button -->
          <button
            @click="handleLikeClick"
            class="absolute top-4 right-4 w-11 h-11 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg z-10"
            :class="[
              isLiked 
                ? 'text-red-500 bg-white' 
                : 'text-gray-400 bg-white/90'
            ]"
          >
            <svg 
              class="w-6 h-6 transition-all duration-200" 
              :class="{'fill-current': isLiked }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="px-4 space-y-4">
        <!-- Name and Price -->
        <div class="animate-slide-up">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">
            {{ product.name }}
          </h1>

          <div class="flex items-center gap-3 mb-3">
            <span 
              v-if="product.discount_percent"
              class="text-3xl font-bold text-telegram-blue">
              ${{ product.new_price }}
            </span>
            <span 
              v-else
              class="text-3xl font-bold text-telegram-blue">
              ${{ product.price }}
            </span>
            <span 
              v-if="product.discount_percent"
              class="text-xl text-gray-400 line-through"
            >
              ${{ product.price }}
            </span>
            <span 
              v-if="product.discount_percent"
              class="px-2 py-1 bg-red-500 text-white text-sm font-bold rounded-lg"
            >
              -{{ product.discount_percent }}%
            </span>
          </div>

          <!-- Rating -->
          <div class="flex items-center gap-2">
            <div class="flex gap-0.5">
              <svg 
                v-for="i in 5" 
                :key="i"
                class="w-4 h-4"
                :class="i <= 5 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              5 out of 5
            </span>
          </div>

          <!-- Stock Status -->
          <div class="mt-3">
            <span 
              v-if="product.is_active"
              class="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
            >
              <span class="w-2 h-2 bg-green-600 rounded-full"></span>
              In Stock
            </span>
            <span 
              v-else
              class="inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
            >
              <span class="w-2 h-2 bg-red-600 rounded-full"></span>
              Out of Stock
            </span>
          </div>
        </div>

        <!-- Description -->
        <div class="card p-4 animate-slide-up stagger-1">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Description
          </h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Expandable Details -->
        <div class="card overflow-hidden animate-slide-up stagger-2">
          <button
            @click="toggleDetails"
            class="w-full px-4 py-4 flex items-center justify-between"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              More Details
            </h2>
            <svg 
              class="w-5 h-5 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': showDetails }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <transition name="expand">
            <div v-show="showDetails" class="px-4 pb-4">
              <div class="space-y-2 text-gray-600 dark:text-gray-400">
                <p v-if="product.category">
                  <strong>Category:</strong> {{ product.category_name || 'N/A' }}
                </p>
                <p>
                  <strong>SKU:</strong> {{ product.id }}
                </p>
                <p v-if="product.created_at">
                  <strong>Added:</strong> {{ formatDate(product.created_at) }}
                </p>
              </div>
            </div>
          </transition>
        </div>

        <!-- Quantity Selector -->
        <div class="card p-4 animate-slide-up stagger-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quantity
          </h2>
          <QuantitySelector 
            v-model="quantity" 
            :min="1" 
            :max="99"
            @update:modelValue="handleQuantityChange"
          />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-20 animate-fade-in">
      <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Product not found
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        The product you're looking for doesn't exist
      </p>
      <button
        @click="goBack"
        class="btn-primary inline-block"
      >
        Go Back
      </button>
    </div>

    <!-- Sticky Add to Cart Button -->
    <div 
      v-if="product"
      class="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 safe-area-bottom z-50"
    >
      <div class="app-container flex gap-3">
        <div class="flex-1">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Price</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            ${{ totalPrice.toFixed(2) }}
          </p>
        </div>
        <button
          @click="addToCart"
          :disabled="!product.is_active || isAddingToCart"
          class="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isAddingToCart" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ buttonText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';
import { useFavoriteStore } from '@/stores/favorites';
import QuantitySelector from '@/components/QuantitySelector.vue';
import telegram from '@/services/telegram';

// ============================================================
// ROUTER & STORES
// ============================================================
const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();

// ============================================================
// STATE
// ============================================================
const quantity = ref(1);
const showDetails = ref(false);
const isAddingToCart = ref(false);

// ============================================================
// COMPUTED
// ============================================================
const loading = computed(() => productStore.loading);
const product = computed(() => productStore.currentProduct);

const isLiked = computed(() => {
  return product.value ? favoriteStore.isLiked(product.value.id) : false;
});

const totalPrice = computed(() => {
  if (!product.value) return 0;
  const price = product.value.discount_percent 
    ? product.value.new_price 
    : product.value.price;
  return price * quantity.value;
});

const isInCart = computed(() => {
  return product.value ? cartStore.isInCart(product.value.id) : false;
});

const buttonText = computed(() => {
  if (isAddingToCart.value) return 'Adding...';
  if (isInCart.value) return 'Update Cart';
  return 'Add to Cart';
});

// ============================================================
// EVENT HANDLERS
// ============================================================

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
  telegram.hapticFeedback('light');
};

const handleQuantityChange = (newQuantity) => {
  telegram.hapticFeedback('selection');
  console.log('Quantity changed to:', newQuantity);
};

const handleLikeClick = async () => {
  if (!product.value) return;
  
  telegram.hapticFeedback('selection');
  
  try {
    await favoriteStore.toggleFavorite(product.value.id, {
      name: product.value.name,
      price: product.value.price,
      image: product.value.image,
      discount_percent: product.value.discount_percent,
      new_price: product.value.new_price
    });
    
    telegram.hapticFeedback(isLiked.value ? 'success' : 'light');
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
};

const addToCart = async () => {
  if (!product.value || !product.value.is_active || isAddingToCart.value) return;

  isAddingToCart.value = true;
  telegram.hapticFeedback('medium');

  try {
    await cartStore.addItem(product.value.id, quantity.value);
    
    console.log('✅ Added to cart:', quantity.value, 'items');
    telegram.hapticFeedback('success');
    
    // Navigate to cart after short delay
    setTimeout(() => {
      router.push('/cart');
    }, 500);
    
  } catch (error) {
    console.error('❌ Failed to add to cart:', error);
    telegram.hapticFeedback('error');
    telegram.showAlert('Failed to add to cart. Please try again.');
  } finally {
    isAddingToCart.value = false;
  }
};

const goBack = () => {
  telegram.hapticFeedback('light');
  router.push('/');
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// ============================================================
// LIFECYCLE - TELEGRAM BACK BUTTON
// ============================================================
let backButtonHandler = null;

onMounted(async () => {
  // ============================================================
  // 1️⃣ SHOW TELEGRAM BACK BUTTON
  // ============================================================
  backButtonHandler = () => {
    telegram.hapticFeedback('light');
    router.back();
  };
  
  telegram.showBackButton(backButtonHandler);
  console.log('✅ Back button enabled');

  // ============================================================
  // 2️⃣ LOAD PRODUCT DATA
  // ============================================================
  const productId = parseInt(route.params.id);
  
  try {
    await Promise.all([
      productStore.fetchProductById(productId),
      cartStore.fetchCart()
    ]);

    // Set initial quantity if already in cart
    if (product.value) {
      const cartQuantity = cartStore.getItemQuantity(product.value.id);
      if (cartQuantity > 0) {
        quantity.value = cartQuantity;
      }
    }
  } catch (error) {
    console.error('❌ Failed to load product:', error);
  }
});

onUnmounted(() => {
  // ============================================================
  // CLEANUP - HIDE TELEGRAM BACK BUTTON
  // ============================================================
  telegram.hideBackButton();
  console.log('✅ Back button hidden');
});
</script>

<style scoped>
/* ============================================================
   EXPAND TRANSITION
   ============================================================ */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>

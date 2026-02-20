<template>
  <div class="product-page min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
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
          <transition-group name="slide-fade">
            <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop"/>
          </transition-group>

          <!-- Favorite Button -->
          <button
            @click="handleLikeClick"
            class="absolute top-4 right-4 w-11 h-11 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg z-10"
            :class="[
              favoriteStore.isLiked(product.id) 
                ? 'text-red-500 bg-white' 
                : 'text-gray-400 bg-white/90'
            ]"
          >
            <svg 
              class="w-6 h-6 transition-all duration-200" 
              :class="{'fill-current': favoriteStore.isLiked(product.id) }"
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

          <!-- Navigation Arrows -->
          <button
            v-if="images.length > 1"
            @click="prevImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg"
          >
            <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            v-if="images.length > 1"
            @click="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg"
          >
            <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Image Indicators -->
          <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              v-for="(image, index) in images"
              :key="`dot-${index}`"
              @click="goToImage(index)"
              class="transition-all duration-300 rounded-full"
              :class="currentImageIndex === index 
                ? 'w-8 h-2 bg-white' 
                : 'w-2 h-2 bg-white/50'"
            ></button>
          </div>
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
                :class="i <= productRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">
               {{productRating}}  out of 5
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
            @click="showDetails = !showDetails"
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
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                Doim biz bilan bo'ling!!!
              </p>
            </div>
          </transition>
        </div>

        <!-- Quantity Selector -->
        <div class="card p-4 animate-slide-up stagger-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quantity
          </h2>
          <QuantitySelector v-if="!isInCart" v-model="quantity" :min="1" :max="99" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-20">
      <p class="text-gray-500 dark:text-gray-400">Product not found</p>
    </div>

    <!-- Sticky Add to Cart Button -->
    <div 
      v-if="product"
      class="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 safe-area-bottom z-50"
    >
      <div class="app-container flex gap-3 pb-4">
        <div class="flex-1">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Price</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            ${{ totalPrice }}
          </p>
        </div>
        <button
          @click="addToCart"
          :disabled="!product.is_active"
          class="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{{ isInCart ? 'Go to Cart' : 'Add to Cart' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';
import QuantitySelector from '@/components/QuantitySelector.vue';
import telegram from '@/services/telegram';
import { useFavoriteStore } from '@/stores/favorites';




const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

const favoriteStore = useFavoriteStore()

const currentImageIndex = ref(0);
const quantity = ref(1);
const showDetails = ref(false);

const loading = computed(() => productStore.loading);
const product = computed(() => productStore.currentProduct);
const productRating = computed(() => Math.floor(Math.random() * 2) + 4);

const images = computed(() => {
  if (!product.value) return [];
  return product.value.images || [product.value.image];
});


const totalPrice = computed(() => {
  return product.value ? product.value.price * quantity.value : 0;
});

const isInCart = computed(() => {
  return product.value ? cartStore.isInCart(product.value.id) : false;
});

// const nextImage = () => {
//   currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
//   telegram.hapticFeedback('selection');
// };

// const prevImage = () => {
//   currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length;
//   telegram.hapticFeedback('selection');
// };

// const goToImage = (index) => {
//   currentImageIndex.value = index;
//   telegram.hapticFeedback('light');
// };


const handleLikeClick = async (event) => {
  event.stopPropagation();
  telegram.hapticFeedback('medium');
  await favoriteStore.toggleFavorite(product.value.id);
};


const addToCart = async (event) => {
  if (!product.value || !product.value.is_active) return;

  if (!isInCart.value) {
    isInCart.value = true;
    
    try {
      setTimeout(() => {
        router.push('/cart');
      }, 150);
      await cartStore.addItem(product.value.id, quantity.value);
      telegram.hapticFeedback('success');
      
    } catch (error) {
      isInCart.value = false;
      telegram.hapticFeedback('error');
      console.error('Xatolik:', error);
    }
  } else {
    router.push('/cart');
  }

};

onMounted(async () => {
  const productId = parseInt(route.params.id);
  await productStore.fetchProductById(productId);
  await cartStore.fetchCart();
  

  // Set initial quantity if already in cart
  if (product.value) {
    const cartQuantity = cartStore.getItemQuantity(product.value.id);
    if (cartQuantity > 0) {
      quantity.value = cartQuantity;
    }
  }
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
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

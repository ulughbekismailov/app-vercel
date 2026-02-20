<template>
  <div class="favorites-page min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slide-up">
      <div class="app-container px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          {{ userStore.t('favorites') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Qty:{{ favoriteProducts.length }}
        </p>
      </div>
    </header>

    <div class="px-4 pt-4">
      <!-- Empty State -->
      <div v-if="favoriteProducts.length === 0" class="text-center py-20 animate-fade-in">
        <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ userStore.t('favoritesIsEmpty') }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ userStore.t('FavoritesStart') }}
        </p>
        <button
          @click="$router.push('/')"
          class="btn-primary inline-block"
        >
          {{ userStore.t('browseProducts') }}
        </button>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-2 gap-3">
        <ProductCard
          v-for="(product, index) in favoriteProducts"
          :key="product.id"
          :product="product"
          :style="{ animationDelay: `${index * 50}ms` }"
          @click="goToProduct(product.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import ProductCard from '@/components/ProductCard.vue';
import telegram from '@/services/telegram';
import { useFavoriteStore } from '@/stores/favorites';
import { useUserStore } from '@/stores/user';


const router = useRouter();
const productStore = useProductStore();
const favoriteStore = useFavoriteStore();
const userStore = useUserStore()

const favoriteProducts = computed(() => {
  const favoriteIds = favoriteStore.likedIds;
  return productStore.products.filter(product => favoriteIds.has(product.id));
});

const goToProduct = (productId) => {
  telegram.hapticFeedback('light');
  router.push(`/product/${productId}`);
};

onMounted(async () => { 
  await Promise.all([
    favoriteStore.loadLikes(),
    productStore.fetchProducts()
  ]);
  console.log('✅ Like lar yuklandi, endi products filter qilish mumkin');
});
</script>

<template>
  <div 
    class="product-card card overflow-hidden cursor-pointer group animate-fade-in"
    @click="$emit('click')"
  >
    <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img 
        src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop" 
        alt="pisot"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Discount Badge -->
      <div 
         v-if="product.discount_percent"
        class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg"
      >
        -{{ product.discount_percent }}%
      </div>

      <!-- Favorite Button -->
      <button
          @click.stop="handleLikeClick"
          class="absolute top-2 left-2 w-9 h-9 rounded-full flex items-center justify-center"
          :class="[
            favoriteStore.isLiked(product.id) 
              ? 'text-red-500 bg-white' 
              : 'text-gray-400 bg-white/90'
          ]"
        >
          <svg 
            class="w-5 h-5"
            :class="{ 'fill-current': favoriteStore.isLiked(product.id) }"
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

      <!-- Out of Stock Overlay -->
      <div 
        v-if="product.inStock"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      >
        <span class="text-white font-semibold text-sm">Out of Stock</span>
      </div>
    </div>

    <div class="p-3 space-y-2">
      <h3 class="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white min-h-[2.5rem]">
        {{ product.name }}
      </h3>

      <div class="flex items-center gap-2">
        <span v-if="product.discount_percent" 
         class="text-lg font-bold text-gray-900 dark:text-white">
          ${{ product.new_price }}
        </span>
        <span v-else
         class="text-lg font-bold text-gray-900 dark:text-white">
          ${{ product.price }}
        </span>
        <span 
          v-if="product.discount_percent" 
          class="text-sm text-gray-400 line-through"
        >
          {{ product.price }}
        </span>
      </div>

      <!-- Rating -->
      <div class="flex items-center gap-1">
        <svg 
          v-for="i in 5" 
          :key="i"
          class="w-3.5 h-3.5"
          :class="i <= productRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
          {{ productRating }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFavoriteStore } from '@/stores/favorites';
import telegram from '@/services/telegram';


const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);

const productRating = computed(() => Math.floor(Math.random() * 2) + 4);

const favoriteStore = useFavoriteStore();

const handleLikeClick = async (event) => {
  event.stopPropagation();
  telegram.hapticFeedback('selection');
  await favoriteStore.toggleFavorite(props.product.id);
};

</script>

<style scoped>
.product-card {
  @apply transition-all duration-200;
}

.product-card:active {
  @apply scale-98;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

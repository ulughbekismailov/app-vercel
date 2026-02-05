<template>
  <div class="cart-item card p-3 flex gap-3 animate-fade-in">
    <!-- Product Image -->
    <div class="flex-shrink-0">
      <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img 
          :src="item.image" 
          :alt="item.name"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Product Info -->
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-sm text-gray-900 dark:text-white truncate mb-1">
        {{ item.name }}
      </h3>
      
      <div class="flex items-center justify-between">
        <div>
          <p class="text-lg font-bold text-gray-900 dark:text-white">
            ${{ item.price.toFixed(2) }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Total: ${{ (item.price * item.quantity).toFixed(2) }}
          </p>
        </div>

        <!-- Quantity Controls -->
        <div class="flex items-center gap-2">
          <button
            @click="decrementQuantity"
            class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-all duration-200 active:scale-90"
            :disabled="item.quantity <= 1"
          >
            <svg 
              v-if="item.quantity > 1"
              class="w-4 h-4 text-gray-700 dark:text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M20 12H4"
              />
            </svg>
            <svg 
              v-else
              class="w-4 h-4 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>

          <span class="w-8 text-center font-semibold text-gray-900 dark:text-white">
            {{ item.quantity }}
          </span>

          <button
            @click="incrementQuantity"
            class="w-8 h-8 rounded-lg bg-telegram-blue text-white flex items-center justify-center transition-all duration-200 active:scale-90"
            :disabled="!item.inStock"
          >
            <svg 
              class="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Stock Warning -->
      <p v-if="!item.inStock" class="text-xs text-red-500 mt-1">
        Out of stock
      </p>
    </div>

    <!-- Remove Button -->
    <button
      @click="removeItem"
      class="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-red-100 dark:hover:bg-red-900/30"
    >
      <svg 
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const cartStore = useCartStore();

const incrementQuantity = () => {
  cartStore.incrementQuantity(props.item.id);
};

const decrementQuantity = () => {
  cartStore.decrementQuantity(props.item.id);
};

const removeItem = () => {
  cartStore.removeItem(props.item.id);
};
</script>

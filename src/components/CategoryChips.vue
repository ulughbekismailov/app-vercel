<template>
  <div class="category-chips-container animate-slide-up stagger-1">
    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 -mx-4">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category.id)"
        class="chip whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 active:scale-95"
        :class="isSelected(category.id) 
          ? 'bg-telegram-blue text-white shadow-md' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
      >
        <span v-if="category.icon" class="text-base">{{ category.icon }}</span>
        <span>{{ category.name }}</span>
        <span 
          v-if="isSelected(category.id)" 
          class="w-1.5 h-1.5 bg-white rounded-full"
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import telegram from '@/services/telegram';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  selectedCategory: {
    type: String,
    default: 'all'
  }
});

const emit = defineEmits(['update:selectedCategory']);

const isSelected = (categoryId) => {
  return props.selectedCategory === categoryId;
};

const selectCategory = (categoryId) => {
  emit('update:selectedCategory', categoryId);
  telegram.hapticFeedback('selection');
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.category-chips-container {
  padding: 0 15px;
  position: relative;
}

.category-chips-container::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to right, transparent, var(--tg-theme-bg-color));
  pointer-events: none;
}

.dark .category-chips-container::after {
  background: linear-gradient(to right, transparent, var(--tg-theme-bg-color));
}
</style>

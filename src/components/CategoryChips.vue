<template>
  <div class="category-chips px-4 py-3 bg-white dark:bg-gray-900 sticky top-[120px] z-30 border-b border-gray-200 dark:border-gray-800 animate-slide-up">
    <div class="flex gap-2 overflow-x-auto no-scrollbar">
      <!-- All Categories Chip -->
      <button
        @click="handleCategorySelect(null)"
        class="chip"
        :class="selectedCategory === null ? 'chip-active' : 'chip-inactive'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>All</span>
      </button>

      <!-- Category Chips -->
      <button
        v-for="category in categories"
        :key="category.id"
        @click="handleCategorySelect(category.id)"
        class="chip"
        :class="selectedCategory === category.id ? 'chip-active' : 'chip-inactive'"
      >
        <span>{{ category.name }}</span>
        <span v-if="category.product_count" class="text-xs opacity-75">
          ({{ category.product_count }})
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import telegram from '@/services/telegram';

// ============================================================
// PROPS & EMITS
// ============================================================
const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedCategory: {
    type: [Number, String, null],
    default: null
  }
});

const emit = defineEmits(['update:selectedCategory']);

// ============================================================
// EVENT HANDLERS
// ============================================================
const handleCategorySelect = (categoryId) => {
  // Don't do anything if already selected
  if (props.selectedCategory === categoryId) return;

  // ✅ HAPTIC FEEDBACK - Selection changed
  telegram.hapticFeedback('selection');
  
  // Emit the change
  emit('update:selectedCategory', categoryId);
  
  console.log('Category selected:', categoryId);
};
</script>

<style scoped>
/* ============================================================
   CHIP BASE STYLES
   ============================================================ */
.chip {
  @apply flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap 
         font-medium text-sm transition-all duration-200 active:scale-95;
}

/* ============================================================
   ACTIVE CHIP
   ============================================================ */
.chip-active {
  @apply bg-telegram-blue text-white shadow-md;
}

.chip-active:hover {
  @apply bg-telegram-blue/90;
}

/* ============================================================
   INACTIVE CHIP
   ============================================================ */
.chip-inactive {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
}

.chip-inactive:hover {
  @apply bg-gray-200 dark:bg-gray-700;
}

/* ============================================================
   SCROLLBAR HIDING
   ============================================================ */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

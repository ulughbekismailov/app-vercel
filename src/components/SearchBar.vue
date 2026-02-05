<template>
  <div class="relative animate-slide-up">
    <div class="relative">
      <input
        v-model="localQuery"
        type="text"
        placeholder="Search products..."
        class="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-telegram-blue transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      
      <!-- Search Icon -->
      <svg 
        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200"
        :class="{ 'text-telegram-blue': isFocused }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <!-- Clear Button -->
      <button
        v-if="localQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
      >
        <svg 
          class="w-4 h-4 text-gray-600 dark:text-gray-300" 
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

    <!-- Search Suggestions (Optional) -->
    <div 
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-elevated overflow-hidden z-10 animate-scale-in"
    >
      <div 
        v-for="suggestion in suggestions" 
        :key="suggestion"
        @click="selectSuggestion(suggestion)"
        class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
      >
        <span class="text-sm text-gray-900 dark:text-white">{{ suggestion }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'search', 'clear']);

const localQuery = ref(props.modelValue);
const isFocused = ref(false);
const showSuggestions = ref(false);

watch(() => props.modelValue, (newVal) => {
  localQuery.value = newVal;
});

const handleInput = () => {
  emit('update:modelValue', localQuery.value);
  emit('search', localQuery.value);
  showSuggestions.value = localQuery.value.length > 0;
};

const clearSearch = () => {
  localQuery.value = '';
  emit('update:modelValue', '');
  emit('clear');
  showSuggestions.value = false;
};

const selectSuggestion = (suggestion) => {
  localQuery.value = suggestion;
  emit('update:modelValue', suggestion);
  emit('search', suggestion);
  showSuggestions.value = false;
};
</script>

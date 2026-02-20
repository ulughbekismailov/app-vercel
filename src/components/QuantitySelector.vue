<template>
  <div class="quantity-selector flex items-center gap-3">
    <button
      @click="decrement"
      :disabled="modelValue <= min"
      class="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg 
        class="w-5 h-5 text-gray-700 dark:text-gray-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2.5" 
          d="M20 12H4"
        />
      </svg>
    </button>

    <div class="flex-1 text-center">
      <input
        :value="modelValue"
        @input="handleInput"
        type="number"
        :min="min"
        :max="max"
        class="w-20 text-center text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white"
        readonly
      />
      <p v-if="showLabel" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Qty
      </p>
    </div>

    <button
      @click="increment"
      :disabled="max && modelValue >= max"
      class="w-11 h-11 rounded-xl bg-telegram-blue text-white flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg 
        class="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2.5" 
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import telegram from '@/services/telegram';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: null
  },
  showLabel: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const increment = () => {
  if (props.max && props.modelValue >= props.max) return;
  emit('update:modelValue', props.modelValue + 1);
  telegram.hapticFeedback('selection');
};

const decrement = () => {
  if (props.modelValue <= props.min) return;
  emit('update:modelValue', props.modelValue - 1);
  telegram.hapticFeedback('selection');
};

const handleInput = (event) => {
  let value = parseInt(event.target.value) || props.min;
  
  if (value < props.min) {
    value = props.min;
  }
  
  if (props.max && value > props.max) {
    value = props.max;
  }
  
  emit('update:modelValue', value);
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>

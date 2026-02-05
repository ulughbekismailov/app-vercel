<template>
  <div class="ad-slider relative overflow-hidden rounded-2xl mx-4 my-3 animate-slide-up stagger-2" style="height: 160px;">
    <div class="relative w-full h-full">
      <!-- Slides -->
      <transition-group name="slide-fade">
        <div
          v-for="(ad, index) in ads"
          :key="ad.id"
          v-show="currentIndex === index"
          class="absolute inset-0 w-full h-full"
        >
          <div 
            class="w-full h-full bg-gradient-to-br rounded-2xl overflow-hidden cursor-pointer group"
            :style="{ background: ad.gradient }"
            @click="handleAdClick(ad)"
          >
            <!-- Content -->
            <div class="relative h-full flex items-center justify-between p-6">
              <div class="flex-1 z-10">
                <h3 class="text-white font-bold text-xl mb-2 drop-shadow-lg">
                  {{ ad.title }}
                </h3>
                <p class="text-white/90 text-sm mb-3 drop-shadow">
                  {{ ad.description }}
                </p>
                <button 
                  class="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 group-hover:bg-white/30"
                >
                  {{ ad.buttonText }}
                </button>
              </div>

              <!-- Image/Icon -->
              <div v-if="ad.image" class="flex-shrink-0 ml-4">
                <img 
                  :src="ad.image" 
                  :alt="ad.title"
                  class="w-24 h-24 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div v-else class="text-6xl opacity-20">
                {{ ad.emoji }}
              </div>
            </div>

            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </transition-group>

      <!-- Navigation Dots -->
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        <button
          v-for="(ad, index) in ads"
          :key="`dot-${ad.id}`"
          @click="goToSlide(index)"
          class="transition-all duration-300 rounded-full"
          :class="currentIndex === index 
            ? 'w-6 h-1.5 bg-white' 
            : 'w-1.5 h-1.5 bg-white/50'"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import telegram from '@/services/telegram';

const props = defineProps({
  ads: {
    type: Array,
    default: () => [
      {
        id: 1,
        title: 'Summer Sale',
        description: 'Up to 50% off on selected items',
        buttonText: 'Shop Now',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        emoji: '☀️',
        link: '/category/sale'
      },
      {
        id: 2,
        title: 'New Arrivals',
        description: 'Check out our latest products',
        buttonText: 'Explore',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        emoji: '✨',
        link: '/category/new'
      },
      {
        id: 3,
        title: 'Free Shipping',
        description: 'On orders over $50',
        buttonText: 'Learn More',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        emoji: '🚚',
        link: '/shipping'
      }
    ]
  },
  autoPlayInterval: {
    type: Number,
    default: 4000
  }
});

const emit = defineEmits(['adClick']);

const currentIndex = ref(0);
let autoPlayTimer = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.ads.length;
};

const goToSlide = (index) => {
  currentIndex.value = index;
  telegram.hapticFeedback('selection');
  resetAutoPlay();
};

const handleAdClick = (ad) => {
  telegram.hapticFeedback('light');
  emit('adClick', ad);
};

const startAutoPlay = () => {
  if (props.autoPlayInterval > 0) {
    autoPlayTimer = setInterval(nextSlide, props.autoPlayInterval);
  }
};

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
};

const resetAutoPlay = () => {
  stopAutoPlay();
  startAutoPlay();
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease;
}

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
</style>

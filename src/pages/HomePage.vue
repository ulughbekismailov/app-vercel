<template>
  <div class="home-page min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slide-up">
      <div class="app-container px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-telegram-blue rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white font-display">
            UI-Shop
          </h1>
        </div>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all duration-200 active:scale-90"
        >
          <svg v-if="!isDarkMode" class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="px-4 pb-3">
        <SearchBar
          v-model="searchQuery"
          @search="handleSearch"
          @clear="handleClearSearch"
        />
      </div>
    </header>

    <!-- Ad Slider -->
    <AdSlider @ad-click="handleAdClick" />

    <!-- Category Chips -->
    <CategoryChips
      :categories="categories"
      :selected-category="selectedCategory"
      @update:selected-category="handleCategoryChange"
    />

    <!-- Products Grid -->
    <div class="px-4 mt-4 pb-20">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 gap-3">
        <div v-for="i in 6" :key="i" class="card h-72 animate-pulse bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="text-center py-16 animate-fade-in">
        <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No products found
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Try adjusting your search or filters
        </p>
        <button
          @click="clearFilters"
          class="btn-primary inline-block"
        >
          Clear Filters
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-2 gap-3">
        <ProductCard
          v-for="(product, index) in products"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';
import ProductCard from '@/components/ProductCard.vue';
import SearchBar from '@/components/SearchBar.vue';
import CategoryChips from '@/components/CategoryChips.vue';
import AdSlider from '@/components/AdSlider.vue';
import telegram from '@/services/telegram';
import { useFavoriteStore } from '@/stores/favorites';
import { useProductStore } from '@/stores/product';


const router = useRouter();
const productStore = useProductStore();
const userStore = useUserStore();
const cartStore = useCartStore();
const searchQuery = ref('');
const selectedCategory = ref(null); // ✅ 'all' emas, null
const favoriteStore = useFavoriteStore();
// ==================
// ==================

const loading = computed(() => productStore.loading);
const categories = computed(() => productStore.categories);
const products = computed(() => productStore.products); // ✅ filteredProducts emas!
const isDarkMode = computed(() => userStore.isDarkMode);



// ✅ Qidiruv
const handleSearch = (query) => {
  searchQuery.value = query;
  productStore.setSearchQuery(query);
};

// ✅ Tozalash
const handleClearSearch = () => {
  searchQuery.value = '';
  productStore.setSearchQuery('');
};

// ✅ Kategoriya tanlash
const handleCategoryChange = (categoryId) => {
    selectedCategory.value = categoryId;
    
  if (categoryId === null) {
    productStore.setSelectedCategory(null);
  } else {
    productStore.setSelectedCategory(categoryId);
  }
  
};

// ✅ Filterlarni tozalash
const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = null;
  productStore.clearSearch();
  productStore.setSelectedCategory(null);
};

const goToProduct = (productId) => {
  telegram.hapticFeedback('light');
  router.push(`/product/${productId}`);
};

const handleAdClick = (ad) => {
  console.log('Ad clicked:', ad);
};

const toggleTheme = () => {
  userStore.toggleTheme();
};

onMounted(async () => {
  // ✅ 1. Userni yuklash
  await userStore.fetchCurrentUser();
  
  // ✅ 2. Kategoriyalarni yuklash
  await productStore.fetchCategories();
  
  // ✅ 3. Mahsulotlarni yuklash (barchasi)
  await productStore.fetchProducts();
  
  // ✅ 4. Savatni backenddan yuklash
  await cartStore.fetchCart();


  await favoriteStore.loadLikes();

});
</script>
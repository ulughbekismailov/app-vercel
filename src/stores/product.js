import { defineStore } from 'pinia';
import apiService from '@/services/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    selectedCategory: 'all',
    searchQuery: '',
    loading: false,
    error: null,
    currentProduct: null
  }),

  getters: {
    filteredProducts: (state) => {
      let filtered = state.products;

      // Filter by category
      if (state.selectedCategory && state.selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === state.selectedCategory);
      }

      // Filter by search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }

      return filtered;
    },

    productById: (state) => (id) => {
      return state.products.find(p => p.id === id);
    },

    hasDiscount: () => (product) => {
      return product.oldPrice && product.oldPrice > product.price;
    },

    discountPercentage: () => (product) => {
      if (!product.oldPrice || product.oldPrice <= product.price) return 0;
      return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
    }
  },

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        this.products = await apiService.getProducts();
      } catch (error) {
        this.error = 'Failed to load products';
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        this.categories = await apiService.getCategories();
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    async fetchProductById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        this.currentProduct = await apiService.getProductById(id);
      } catch (error) {
        this.error = 'Failed to load product details';
        console.error('Error fetching product:', error);
      } finally {
        this.loading = false;
      }
    },

    setSelectedCategory(categoryId) {
      this.selectedCategory = categoryId;
    },

    setSearchQuery(query) {
      this.searchQuery = query;
    },

    clearSearch() {
      this.searchQuery = '';
    },

    async searchProducts(query) {
      this.searchQuery = query;
      
      if (!query) {
        return;
      }

      this.loading = true;
      try {
        // You can implement server-side search here
        // this.products = await apiService.searchProducts(query);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});

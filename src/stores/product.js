import { defineStore } from 'pinia';
import apiService from '@/services/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    selectedCategory: null,
    searchQuery: '',
    loading: false,
    error: null,
    currentProduct: null
  }),

  getters: {

    hasDiscount: () => (product) => {
      return product.old_price && product.old_price > product.price;
    },

    discountPercentage: () => (product) => {
      if (!product.old_price || product.old_price <= product.price) return 0;
      return Math.round(((product.old_price - product.price) / product.old_price) * 100);
    }
    
  },

  actions: {
    // ✅ GET /products/
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      
      try {
        const params = {};
        
        if (this.selectedCategory) {
          params.category = this.selectedCategory;
        }
        
        if (this.searchQuery) {
          params.search = this.searchQuery;
        }
        
        this.products = await apiService.getProducts(params);
      } catch (error) {
        this.error = 'Mahsulotlarni yuklashda xatolik';
      } finally {
        this.loading = false;
      }

    },

    // ✅ GET /categories/
    async fetchCategories() {
      try {
        this.categories = await apiService.getCategories();
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    // ✅ GET /products/{id}/
    async fetchProductById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        this.currentProduct = await apiService.getProductById(id);
      } catch (error) {
        this.error = 'Mahsulot ma\'lumotlarini yuklashda xatolik';
        console.error('Error fetching product:', error);
      } finally {
        this.loading = false;
      }
    },

    // ✅ Filter va qidiruv (keyin backendga ulaymiz)
    setSelectedCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.fetchProducts();
    },

    setSearchQuery(query) {
      this.searchQuery = query;
      this.fetchProducts();  // ✅ SHUNI QO'SHING
    },

    clearSearch() {
      this.searchQuery = '';
      this.selectedCategory = null;
      this.fetchProducts();
    }
  }
});
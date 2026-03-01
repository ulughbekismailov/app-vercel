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
    currentProduct: null,

    // paginatsiya uchun qo'shilganlar

    nextCursor: null,        // Keyingi sahifa uchun cursor
    hasMore: true,            // Yana product bormi?
    loadingMore: false, 
    pageSize: 20
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
    async fetchProducts(reset = true) {

      if(reset){
        this.products = [];
        this.nextCursor = null;
        this.hasMore = true;
      }

      this.loading = reset;

      this.loadingMore = !reset;
      this.error = null;
      
      try {
          const params = {
            page_size: this.pageSize
          };
          

          if (this.nextCursor) {
            params.cursor = this.nextCursor;
          }

          if (this.selectedCategory) {
            params.category = this.selectedCategory;
          }
          
          if (this.searchQuery) {
            params.search = this.searchQuery;
          }
          
          const response = await apiService.getProducts(params);
          const data = response.data || response;

          if (reset) {
            this.products = data.results || [];
          } else {
            this.products = [...this.products, ...(data.results || [])];
          }

          this.nextCursor = data.next ? this._extractCursor(data.next) : null;
          this.hasMore = !!data.next;

      } catch (error) {
        this.error = 'Mahsulotlarni yuklashda xatolik';
        console.error('Fetch products error:', error);
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },


    async loadMoreProducts() {
      if (this.loadingMore || !this.hasMore || this.loading) return;
      
      await this.fetchProducts(false);
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
    },


    _extractCursor(url) {
      // URL dan cursor ni ajratib olish
      // ?cursor=abc123 -> abc123
      if (!url) return null;
      const match = url.match(/[?&]cursor=([^&]+)/);
      return match ? match[1] : null;
    }

  }
});
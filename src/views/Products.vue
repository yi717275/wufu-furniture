<template>
  <div class="products">
    <h1>產品列表</h1>
    <div class="filters">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索產品..."
          @input="applyFilters"
        >
      </div>
      <div class="filter-options">
        <div class="price-range">
          <label>價格範圍：</label>
          <input 
            v-model.number="minPrice" 
            type="number" 
            placeholder="最低價格" 
            @input="applyFilters"
          >
          <input 
            v-model.number="maxPrice" 
            type="number" 
            placeholder="最高價格" 
            @input="applyFilters"
          >
        </div>
        <div class="category-filter">
          <label>類別：</label>
          <select v-model="selectedCategory" @change="applyFilters">
            <option value="">全部</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="sort-options">
          <label>排序：</label>
          <select v-model="sortOption" @change="applyFilters">
            <option value="default">默認</option>
            <option value="price-asc">價格從低到高</option>
            <option value="price-desc">價格從高到低</option>
            <option value="name-asc">名稱 A-Z</option>
            <option value="name-desc">名稱 Z-A</option>
          </select>
        </div>
      </div>
    </div>
    <div class="product-grid">
      <div v-for="product in filteredAndSortedProducts" :key="product.id" class="product-card">
        <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
          <img :src="product.image" :alt="product.name">
          <h3>{{ product.name }}</h3>
          <p>價格: NT$ {{ product.price }}</p>
          <p>類別: {{ product.category }}</p>
        </router-link>
        <button @click="addToCart(product)">加入購物車</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { inject } from 'vue'

export default {
  name: 'ProductsView',
  setup() {
    const route = useRoute()
    const { addToCart } = inject('cart')
    const products = ref([])
    const searchQuery = ref('')
    const minPrice = ref(null)
    const maxPrice = ref(null)
    const selectedCategory = ref('')
    const sortOption = ref('default')

    const categories = computed(() => {
      return [...new Set(products.value.map(product => product.category))]
    })

    const filteredAndSortedProducts = computed(() => {
      let result = products.value

      // 應用搜索過濾
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      }

      // 應用價格範圍過濾
      if (minPrice.value !== null) {
        result = result.filter(product => product.price >= minPrice.value)
      }
      if (maxPrice.value !== null) {
        result = result.filter(product => product.price <= maxPrice.value)
      }

      // 應用類別過濾
      if (selectedCategory.value) {
        result = result.filter(product => product.category === selectedCategory.value)
      }

      // 應用排序
      switch (sortOption.value) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          result.sort((a, b) => b.price - a.price)
          break
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name))
          break
        default:
          result.sort((a, b) => a.id - b.id)
      }

      return result
    })

    const applyFilters = () => {
      console.log('Filters applied')
    }

    watch(() => route.query.search, (newSearchQuery) => {
      if (newSearchQuery) {
        searchQuery.value = newSearchQuery
      }
    })

    onMounted(async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      products.value = [
        { id: 1, name: '五尺雙人床頭', price: 5000, category: '臥室', image: '/五尺雙人床頭.jpg', width: 150 },
        { id: 2, name: '厚牛皮訂製款沙發', price: 35000, category: '客廳', image: '/厚牛皮訂製款沙發.jpg', width: 220 },
        { id: 3, name: '厚牛皮電動沙發', price: 45000, category: '客廳', image: '/厚牛皮電動沙發.jpg', width: 240 },
        { id: 4, name: '約克實木櫃', price: 15000, category: '臥室', image: '/約克實木櫃.jpg', width: 100 },
        { id: 5, name: '蜂巢透氣獨立筒床墊', price: 12000, category: '臥室', image: '/蜂巢透氣獨立筒床墊.jpg', width: 150 },
        { id: 6, name: '機能涼感布功能沙發', price: 28000, category: '客廳', image: '/機能涼感布功能沙發.jpg', width: 200 },
        { id: 7, name: '簡約風化妝台', price: 8000, category: '臥室', image: '/簡約風化妝台.jpg', width: 80 },
        { id: 8, name: '設計師款原木床台', price: 18000, category: '臥室', image: '/設計師款原木床台.jpg', width: 160 }
      ]

      if (route.query.search) {
        searchQuery.value = route.query.search
      }
    })

    return {
      products,
      searchQuery,
      minPrice,
      maxPrice,
      selectedCategory,
      sortOption,
      categories,
      filteredAndSortedProducts,
      applyFilters,
      addToCart
    }
  }
}
</script>

<style scoped>
.products {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
}

.search-bar input,
.filter-options input,
.filter-options select {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
}

.price-range,
.category-filter,
.sort-options {
  display: flex;
  align-items: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.product-card img {
  max-width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 10px;
}

.product-card a {
  text-decoration: none;
  color: inherit;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
}

button:hover {
  background-color: #3aa876;
}
</style>
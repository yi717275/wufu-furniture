<template>
  <div class="home">
    <h1>歡迎來到五福傢俱</h1>
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="輸入您的需求，例如：我需要放衣服的櫃子寬度不能超過90cm"
        @keyup.enter="search"
      >
      <button @click="search">搜索</button>
    </div>
    <div class="features">
      <router-link to="/space-planner" class="feature-link">
        使用空間規劃器
      </router-link>
    </div>
    <div class="categories">
      <h2>產品分類</h2>
      <div class="category-grid">
        <div v-for="category in categories" :key="category.name" class="category">
          <h3>{{ category.name }}</h3>
          <ul>
            <li v-for="item in category.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'HomeView',
  setup() {
    const searchQuery = ref('');
    const router = useRouter();

    const categories = [
      {
        name: '房間類',
        items: ['床頭', '床邊櫃', '斗櫃', '化妝台', '衣櫃', '床座']
      },
      {
        name: '客廳類',
        items: ['沙發', '原木', '茶几', '電視櫃']
      },
      {
        name: '廚房',
        items: ['餐櫃', '餐桌', '餐椅']
      },
      {
        name: '書房',
        items: ['書桌', '辦公桌', '辦公椅']
      }
    ];

    const search = () => {
      router.push({ 
        name: 'Products', 
        query: { search: searchQuery.value } 
      });
    };

    return {
      searchQuery,
      categories,
      search
    };
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-bar {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.search-bar input {
  width: 60%;
  padding: 10px;
  font-size: 16px;
}

.search-bar button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

.features {
  margin-top: 20px;
}

.feature-link {
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.categories {
  margin-top: 30px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.category {
  text-align: left;
}

.category h3 {
  margin-bottom: 10px;
}

.category ul {
  list-style-type: none;
  padding-left: 0;
}

.category li {
  margin-bottom: 5px;
}
</style>
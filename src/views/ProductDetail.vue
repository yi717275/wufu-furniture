<template>
  <div v-if="product" class="product-detail">
    <div class="product-content">
      <div class="product-gallery">
        <img :src="currentImage" :alt="product.name" class="main-image">
        <div class="thumbnail-container">
          <img 
            v-for="(image, index) in product.images" 
            :key="index" 
            :src="image" 
            :alt="product.name + ' - 圖片 ' + (index + 1)"
            class="thumbnail"
            :class="{ active: currentImageIndex === index }"
            @click="setCurrentImage(index)"
          >
        </div>
      </div>
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">NT$ {{ product.price }}</p>
        <p class="size">尺寸：{{ product.size }}</p>
        <p class="material">材質：{{ product.material }}</p>
        <div class="color-options" v-if="product.colors">
          <span>顏色選項：</span>
          <button 
            v-for="color in product.colors" 
            :key="color" 
            class="color-btn" 
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
          ></button>
        </div>
        <div class="quantity-selector">
          <button @click="decreaseQuantity">-</button>
          <input type="number" v-model.number="quantity" min="1">
          <button @click="increaseQuantity">+</button>
        </div>
        <button @click="addToCart" class="add-to-cart">加入購物車</button>
        <div class="description">
          <h2>商品描述</h2>
          <p>{{ product.description }}</p>
        </div>
      </div>
    </div>

    <div class="reviews-section">
      <h2>商品評論</h2>
      <div class="average-rating">
        平均評分: {{ averageRating }} / 5
        <div class="star-rating">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= averageRating }">★</span>
        </div>
      </div>
      <div v-if="reviews.length" class="reviews-list">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <span class="review-author">{{ review.author }}</span>
            <span class="review-date">{{ formatDate(review.date) }}</span>
          </div>
          <div class="review-rating">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">★</span>
          </div>
          <p class="review-content">{{ review.content }}</p>
        </div>
      </div>
      <div v-else>
        <p>此商品暫無評論。</p>
      </div>

      <div class="add-review" v-if="user">
        <h3>新增評論</h3>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label for="rating">評分：</label>
            <div class="star-rating-input">
              <span 
                v-for="n in 5" 
                :key="n" 
                class="star" 
                :class="{ filled: n <= newReview.rating }"
                @click="setRating(n)"
              >★</span>
            </div>
          </div>
          <div class="form-group">
            <label for="content">評論內容：</label>
            <textarea v-model="newReview.content" id="content" required></textarea>
          </div>
          <button type="submit">提交評論</button>
        </form>
      </div>
      <p v-else>請<router-link to="/login">登入</router-link>後評論。</p>
    </div>
  </div>
  <div v-else class="loading">
    <p>載入中...</p>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ProductDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { addToCart } = inject('cart')
    const product = ref(null)
    const currentImageIndex = ref(0)
    const reviews = ref([])
    const user = ref(null)
    const newReview = ref({ rating: 5, content: '' })
    const quantity = ref(1)
    const selectedColor = ref(null)

    const currentImage = computed(() => {
      return product.value ? product.value.images[currentImageIndex.value] : ''
    })

    const averageRating = computed(() => {
      if (reviews.value.length === 0) return 0
      const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
      return (sum / reviews.value.length).toFixed(1)
    })

    const setCurrentImage = (index) => {
      currentImageIndex.value = index
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const submitReview = () => {
      if (!user.value) return

      const review = {
        id: Date.now(),
        author: user.value.name,
        date: new Date().toISOString(),
        rating: newReview.value.rating,
        content: newReview.value.content
      }

      reviews.value.unshift(review)
      newReview.value = { rating: 5, content: '' }

      // 這裡應該發送評論到後端 API
      console.log('提交評論:', review)
    }

    const setRating = (rating) => {
      newReview.value.rating = rating
    }

    const increaseQuantity = () => {
      quantity.value++
    }

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const selectColor = (color) => {
      selectedColor.value = color
    }

    const addToCartHandler = () => {
      if (product.value) {
        const cartItem = {
          ...product.value,
          quantity: quantity.value,
          color: selectedColor.value
        }
        addToCart(cartItem)
        router.push('/cart')
      }
    }

    onMounted(async () => {
      const productId = parseInt(route.params.id)
      // 這裡應該從 API 獲取產品數據
      // 使用模擬數據
      await new Promise(resolve => setTimeout(resolve, 500))
      
      product.value = {
        id: productId,
        name: '五尺雙人床頭',
        price: 5000,
        size: '150x30x100cm',
        material: '優質木材',
        colors: ['#8B4513', '#D2691E', '#CD853F'],
        images: [
          '/五尺雙人床頭.jpg',
          '/厚牛皮訂製款沙發.jpg',
          '/厚牛皮電動沙發.jpg',
        ],
        description: '這款五尺雙人床頭採用優質木材製作，具有極高的耐用性和美觀性。其簡約現代的設計風格適合各種臥室裝修風格。產品表面經過精細打磨和優質塗裝處理，觸感光滑，易於清潔維護。床頭配有USB充電插孔，方便使用電子設備。'
      }

      // 這裡應該從 API 獲取評論數據
      // 使用模擬數據
      reviews.value = [
        { id: 1, author: '張小明', rating: 5, content: '非常舒適的床頭，質量很好！', date: '2023-05-15T10:30:00Z' },
        { id: 2, author: '李小華', rating: 4, content: '整體來說不錯，就是顏色比想像中的深一些。', date: '2023-05-10T14:20:00Z' }
      ]

      // 獲取用戶信息
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
    })

    return {
      product,
      currentImage,
      currentImageIndex,
      setCurrentImage,
      reviews,
      formatDate,
      user,
      newReview,
      submitReview,
      averageRating,
      setRating,
      quantity,
      increaseQuantity,
      decreaseQuantity,
      selectColor,
      addToCart: addToCartHandler
    }
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-content {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.product-gallery {
  width: 50%;
}

.main-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.thumbnail-container {
  display: flex;
  gap: 10px;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumbnail:hover, .thumbnail.active {
  opacity: 1;
}

.product-info {
  width: 50%;
}

h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

.price {
  font-size: 1.5em;
  font-weight: bold;
  color: #e53935;
  margin-bottom: 15px;
}

.size, .material {
  margin-bottom: 10px;
}

.color-options {
  margin-bottom: 15px;
}

.color-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  margin-right: 10px;
  cursor: pointer;
}

.quantity-selector {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
}

.quantity-selector input {
  width: 50px;
  text-align: center;
  margin: 0 10px;
}

.add-to-cart {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.1em;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 20px;
}

.add-to-cart:hover {
  background-color: #45a049;
}

.description {
  margin-top: 30px;
}

.description h2 {
  font-size: 1.3em;
  margin-bottom: 10px;
}

.reviews-section {
  margin-top: 40px;
}

.average-rating {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.review-item {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review-author {
  font-weight: bold;
}

.review-date {
  color: #666;
}

.star-rating, .star-rating-input {
  font-size: 1.2em;
}

.star {
  color: #ddd;
  cursor: pointer;
}

.star.filled {
  color: #FFD700;
}

.add-review {
  margin-top: 30px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  border-radius: 4px;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
}
</style>
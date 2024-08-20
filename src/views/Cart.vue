<template>
  <div class="cart">
    <h1>購物車</h1>
    <div v-if="cart.length === 0">
      <p>您的購物車是空的。</p>
      <router-link to="/products" class="continue-shopping">繼續購物</router-link>
    </div>
    <div v-else>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.name" class="cart-item-image">
        <div class="cart-item-details">
          <h3>{{ item.name }}</h3>
          <p>單價: NT$ {{ item.price }}</p>
          <p v-if="item.color">顏色: <span class="color-dot" :style="{ backgroundColor: item.color }"></span></p>
          <div class="quantity-control">
            <button @click="decreaseQuantity(item.id)">-</button>
            <input type="number" v-model.number="item.quantity" @change="updateQuantity(item.id, item.quantity)">
            <button @click="increaseQuantity(item.id)">+</button>
          </div>
          <p>小計: NT$ {{ item.price * item.quantity }}</p>
          <button @click="removeFromCart(item.id)" class="remove-button">移除</button>
        </div>
      </div>
      <div class="cart-summary">
        <div class="promo-code">
          <input v-model="promoCode" placeholder="輸入優惠碼">
          <button @click="applyPromoCode">應用</button>
        </div>
        <div class="summary-details">
          <p>商品總額: NT$ {{ subtotal }}</p>
          <p v-if="discount > 0">折扣: -NT$ {{ discount }}</p>
          <p>運費: NT$ {{ shippingFee }}</p>
          <p>稅費: NT$ {{ tax }}</p>
          <h3>總計: NT$ {{ totalPrice }}</h3>
        </div>
        <p class="estimated-delivery">預計送達時間: {{ estimatedDelivery }}</p>
        <button @click="checkout" class="checkout-button">結帳</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CartView',
  setup() {
    const { cart, removeFromCart, updateQuantity, totalItems } = inject('cart')
    const router = useRouter()
    const promoCode = ref('')
    const discount = ref(0)
    const shippingFee = ref(100) // 假設固定運費為 NT$ 100
    const taxRate = 0.05 // 假設稅率為 5%

    const subtotal = computed(() => {
      return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
    })

    const tax = computed(() => {
      return Math.round((subtotal.value - discount.value) * taxRate)
    })

    const totalPrice = computed(() => {
      return subtotal.value - discount.value + shippingFee.value + tax.value
    })

    const estimatedDelivery = computed(() => {
      const today = new Date()
      const deliveryDate = new Date(today.setDate(today.getDate() + 3)) // 假設3天後送達
      return deliveryDate.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })
    })

    const decreaseQuantity = (productId) => {
      const item = cart.value.find(item => item.id === productId)
      if (item && item.quantity > 1) {
        updateQuantity(productId, item.quantity - 1)
      }
    }

    const increaseQuantity = (productId) => {
      const item = cart.value.find(item => item.id === productId)
      if (item) {
        updateQuantity(productId, item.quantity + 1)
      }
    }

    const applyPromoCode = () => {
      // 這裡應該調用後端 API 來驗證優惠碼
      // 現在我們使用一個模擬的優惠碼 "DISCOUNT10"
      if (promoCode.value === 'DISCOUNT10') {
        discount.value = Math.round(subtotal.value * 0.1) // 10% 折扣
        alert('優惠碼已應用，您獲得了10%的折扣！')
      } else {
        alert('無效的優惠碼')
      }
    }

    const checkout = () => {
      // 這裡可以添加一些檢查，例如確保用戶已登錄
      router.push({ name: 'Checkout' })
    }

    return {
      cart,
      removeFromCart,
      updateQuantity,
      decreaseQuantity,
      increaseQuantity,
      totalItems,
      totalPrice,
      subtotal,
      discount,
      shippingFee,
      tax,
      estimatedDelivery,
      promoCode,
      applyPromoCode,
      checkout
    }
  }
}
</script>

<style scoped>
.cart {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.cart-item {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 15px;
}

.cart-item-details {
  flex-grow: 1;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.quantity-control input {
  width: 50px;
  text-align: center;
  margin: 0 10px;
}

.quantity-control button {
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.remove-button {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}

.cart-summary {
  margin-top: 20px;
  text-align: right;
}

.promo-code {
  margin-bottom: 15px;
}

.promo-code input {
  padding: 5px;
  margin-right: 10px;
}

.summary-details p {
  margin: 5px 0;
}

.checkout-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1.1em;
  cursor: pointer;
  margin-top: 10px;
}

.checkout-button:hover {
  background-color: #45a049;
}

.continue-shopping {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.estimated-delivery {
  margin-top: 10px;
  font-style: italic;
}

.color-dot {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-left: 5px;
}
</style>
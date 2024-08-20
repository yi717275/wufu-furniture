<template>
  <div class="checkout">
    <h1>結帳</h1>
    <div v-if="cart.length === 0">
      <p>您的購物車是空的，無法進行結帳。</p>
      <router-link to="/products" class="continue-shopping">繼續購物</router-link>
    </div>
    <div v-else>
      <form @submit.prevent="submitOrder" class="checkout-form">
        <div class="form-section">
          <h2>個人信息</h2>
          <div class="form-group">
            <label for="name">姓名：</label>
            <input type="text" id="name" v-model="orderInfo.name" required>
          </div>
          <div class="form-group">
            <label for="phone">電話：</label>
            <input type="tel" id="phone" v-model="orderInfo.phone" required>
          </div>
          <div class="form-group">
            <label for="email">電子郵件：</label>
            <input type="email" id="email" v-model="orderInfo.email" required>
          </div>
          <div class="form-group">
            <label for="address">地址：</label>
            <input type="text" id="address" v-model="orderInfo.address" required>
          </div>
        </div>

        <div class="form-section">
          <h2>送貨時間</h2>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="orderInfo.deliveryTime.weekday"> 平日
            </label>
            <label>
              <input type="checkbox" v-model="orderInfo.deliveryTime.weekend"> 假日
            </label>
            <label>
              <input type="checkbox" v-model="orderInfo.deliveryTime.morning"> 上午
            </label>
            <label>
              <input type="checkbox" v-model="orderInfo.deliveryTime.afternoon"> 下午
            </label>
            <label>
              <input type="checkbox" v-model="orderInfo.deliveryTime.evening"> 晚上
            </label>
          </div>
        </div>

        <div class="form-section">
          <h2>支付方式</h2>
          <div class="form-group">
            <label>
              <input type="radio" v-model="orderInfo.paymentMethod" value="cash" required> 現金
            </label>
            <label>
              <input type="radio" v-model="orderInfo.paymentMethod" value="transfer" required> 轉帳
            </label>
            <label>
              <input type="radio" v-model="orderInfo.paymentMethod" value="creditCard" required> 刷卡
            </label>
          </div>
        </div>

        <div class="order-summary">
          <h2>訂單摘要</h2>
          <div v-for="item in cart" :key="item.id" class="order-item">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>NT$ {{ item.price * item.quantity }}</span>
          </div>
          <div class="order-total">
            <strong>小計：NT$ {{ subtotal }}</strong>
          </div>
          <div v-if="discount > 0" class="order-discount">
            <strong>折扣：-NT$ {{ discount }}</strong>
          </div>
          <div class="order-shipping">
            <strong>運費：NT$ {{ shippingFee }}</strong>
          </div>
          <div class="order-tax">
            <strong>稅費：NT$ {{ tax }}</strong>
          </div>
          <div class="order-grand-total">
            <strong>總計：NT$ {{ totalPrice }}</strong>
          </div>
        </div>

        <button type="submit" class="submit-order">提交訂單</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'CheckoutView',
  setup() {
    const { cart, clearCart } = inject('cart')
    const router = useRouter()

    const orderInfo = ref({
      name: '',
      phone: '',
      email: '',
      address: '',
      deliveryTime: {
        weekday: false,
        weekend: false,
        morning: false,
        afternoon: false,
        evening: false
      },
      paymentMethod: ''
    })

    const discount = ref(0) // 假設沒有折扣
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

    const submitOrder = () => {
      // 生成訂單編號
      const orderNumber = generateOrderNumber()

      // 在實際應用中，這裡應該發送訂單數據到後端API
      console.log('訂單提交', { orderNumber, orderInfo: orderInfo.value, cart: cart.value, totalPrice: totalPrice.value })

      // 清空購物車
      clearCart()

      // 導航到訂單確認頁面
      router.push({ name: 'OrderConfirmation', params: { orderNumber } })
    }

    const generateOrderNumber = () => {
      const date = new Date()
      const dateString = date.toISOString().slice(0, 10).replace(/-/g, '')
      const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      return `${dateString}${orderInfo.value.phone.slice(-4)}${randomDigits}`
    }

    return {
      cart,
      orderInfo,
      subtotal,
      discount,
      shippingFee,
      tax,
      totalPrice,
      submitOrder
    }
  }
}
</script>

<style scoped>
.checkout {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.checkout-form {
  display: grid;
  gap: 20px;
}

.form-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="tel"],
input[type="email"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group label {
  display: inline-block;
  margin-right: 15px;
}

.order-summary {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.order-total,
.order-discount,
.order-shipping,
.order-tax,
.order-grand-total {
  margin-top: 10px;
  text-align: right;
}

.submit-order {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1.1em;
  cursor: pointer;
  border-radius: 4px;
  width: 100%;
}

.submit-order:hover {
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
</style>
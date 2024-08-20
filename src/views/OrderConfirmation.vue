<template>
  <div class="order-confirmation">
    <h1>訂單確認</h1>
    <div class="confirmation-message">
      <p>感謝您的訂購！您的訂單已成功提交。</p>
      <p>訂單編號：<strong>{{ orderNumber }}</strong></p>
    </div>
    <div class="order-details">
      <h2>訂單詳情</h2>
      <p><strong>訂購日期：</strong> {{ orderDate }}</p>
      <p><strong>訂單狀態：</strong> 處理中</p>
      <div class="order-items">
        <h3>訂購商品</h3>
        <ul>
          <li v-for="item in orderItems" :key="item.id">
            {{ item.name }} - 數量: {{ item.quantity }} - 小計: NT$ {{ item.price * item.quantity }}
          </li>
        </ul>
      </div>
      <div class="order-summary">
        <p><strong>商品總額：</strong> NT$ {{ subtotal }}</p>
        <p v-if="discount > 0"><strong>折扣：</strong> -NT$ {{ discount }}</p>
        <p><strong>運費：</strong> NT$ {{ shippingFee }}</p>
        <p><strong>稅費：</strong> NT$ {{ tax }}</p>
        <p class="order-total"><strong>訂單總額：</strong> NT$ {{ totalPrice }}</p>
      </div>
      <div class="delivery-info">
        <h3>配送資訊</h3>
        <p><strong>收件人：</strong> {{ orderInfo.name }}</p>
        <p><strong>聯絡電話：</strong> {{ orderInfo.phone }}</p>
        <p><strong>電子郵件：</strong> {{ orderInfo.email }}</p>
        <p><strong>收件地址：</strong> {{ orderInfo.address }}</p>
        <p><strong>配送時間：</strong> {{ formatDeliveryTime(orderInfo.deliveryTime) }}</p>
      </div>
      <div class="payment-info">
        <h3>付款資訊</h3>
        <p><strong>付款方式：</strong> {{ formatPaymentMethod(orderInfo.paymentMethod) }}</p>
      </div>
    </div>
    <div class="next-steps">
      <h2>接下來的步驟</h2>
      <ol>
        <li>我們將盡快處理您的訂單。</li>
        <li>您將收到一封確認郵件，其中包含訂單詳情。</li>
        <li>我們會在發貨時通知您。</li>
        <li>如有任何問題，請聯繫我們的客戶服務。</li>
      </ol>
    </div>
    <div class="actions">
      <button @click="goToHome" class="continue-shopping">繼續購物</button>
      <button @click="goToOrderHistory" class="view-orders">查看訂單歷史</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'OrderConfirmation',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const orderNumber = ref(route.params.orderNumber || '未知')
    const orderDate = ref(new Date().toLocaleString('zh-TW'))
    const orderItems = ref([])
    const orderInfo = ref({})
    const subtotal = ref(0)
    const discount = ref(0)
    const shippingFee = ref(100)
    const tax = ref(0)
    const totalPrice = ref(0)

    onMounted(() => {
      // 在實際應用中，這裡應該從後端API獲取訂單詳情
      // 現在我們使用模擬數據
      orderItems.value = [
        { id: 1, name: '五尺雙人床頭', quantity: 1, price: 5000 },
        { id: 2, name: '三人沙發', quantity: 1, price: 15000 },
      ]
      orderInfo.value = {
        name: '張三',
        phone: '0912345678',
        email: 'zhangsan@example.com',
        address: '台北市信義區101號',
        deliveryTime: {
          weekday: true,
          weekend: false,
          morning: true,
          afternoon: false,
          evening: false
        },
        paymentMethod: 'creditCard'
      }
      subtotal.value = orderItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
      tax.value = Math.round(subtotal.value * 0.05)
      totalPrice.value = subtotal.value + shippingFee.value + tax.value - discount.value
    })

    const formatDeliveryTime = (deliveryTime) => {
      if (!deliveryTime) return '未指定'
      const times = []
      if (deliveryTime.weekday) times.push('平日')
      if (deliveryTime.weekend) times.push('假日')
      if (deliveryTime.morning) times.push('上午')
      if (deliveryTime.afternoon) times.push('下午')
      if (deliveryTime.evening) times.push('晚上')
      return times.length > 0 ? times.join('、') : '未指定'
    }

    const formatPaymentMethod = (method) => {
      const methods = {
        cash: '現金',
        transfer: '轉帳',
        creditCard: '刷卡'
      }
      return methods[method] || method
    }

    const goToHome = () => {
      router.push({ name: 'Home' })
    }

    const goToOrderHistory = () => {
      router.push({ name: 'OrderHistory' })
    }

    return {
      orderNumber,
      orderDate,
      orderItems,
      orderInfo,
      subtotal,
      discount,
      shippingFee,
      tax,
      totalPrice,
      formatDeliveryTime,
      formatPaymentMethod,
      goToHome,
      goToOrderHistory
    }
  }
}
</script>

<style scoped>
.order-confirmation {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2, h3 {
  color: #2c3e50;
}

.confirmation-message {
  background-color: #e7f7e7;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.order-details, .next-steps {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.order-items ul {
  list-style-type: none;
  padding: 0;
}

.order-items li {
  margin-bottom: 10px;
}

.order-total {
  font-size: 1.2em;
  margin-top: 15px;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.continue-shopping, .view-orders {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  border-radius: 4px;
}

.continue-shopping:hover, .view-orders:hover {
  background-color: #45a049;
}
</style>

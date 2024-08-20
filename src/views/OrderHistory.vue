<template>
  <div class="order-history">
    <h1>訂單歷史</h1>
    <div class="filters">
      <div class="date-filter">
        <label>開始日期：</label>
        <input type="date" v-model="startDate" @change="applyFilters">
        <label>結束日期：</label>
        <input type="date" v-model="endDate" @change="applyFilters">
      </div>
      <div class="status-filter">
        <label>訂單狀態：</label>
        <select v-model="selectedStatus" @change="applyFilters">
          <option value="">全部</option>
          <option value="處理中">處理中</option>
          <option value="已出貨">已出貨</option>
          <option value="已完成">已完成</option>
          <option value="已取消">已取消</option>
        </select>
      </div>
    </div>
    <div v-if="filteredOrders.length">
      <div v-for="order in filteredOrders" :key="order.id" class="order-item">
        <h3>訂單 #{{ order.id }}</h3>
        <p>日期: {{ formatDate(order.date) }}</p>
        <p>狀態: <span :class="'status-' + order.status">{{ order.status }}</span></p>
        <p>總金額: NT$ {{ order.total }}</p>
        <button @click="toggleOrderDetails(order.id)" class="toggle-details">
          {{ expandedOrders.includes(order.id) ? '隱藏詳情' : '查看詳情' }}
        </button>
        <div v-if="expandedOrders.includes(order.id)" class="order-details">
          <h4>訂單項目:</h4>
          <ul>
            <li v-for="item in order.items" :key="item.id">
              {{ item.name }} - 數量: {{ item.quantity }} - 單價: NT$ {{ item.price }}
            </li>
          </ul>
          <p><strong>配送地址：</strong> {{ order.address }}</p>
          <p><strong>配送時間：</strong> {{ formatDeliveryTime(order.deliveryTime) }}</p>
          <p><strong>支付方式：</strong> {{ formatPaymentMethod(order.paymentMethod) }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>沒有找到符合條件的訂單。</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'OrderHistoryView',
  setup() {
    const orders = ref([])
    const startDate = ref('')
    const endDate = ref('')
    const selectedStatus = ref('')
    const expandedOrders = ref([])

    const filteredOrders = computed(() => {
      return orders.value.filter(order => {
        const orderDate = new Date(order.date)
        const isAfterStartDate = startDate.value ? orderDate >= new Date(startDate.value) : true
        const isBeforeEndDate = endDate.value ? orderDate <= new Date(endDate.value) : true
        const matchesStatus = selectedStatus.value ? order.status === selectedStatus.value : true
        return isAfterStartDate && isBeforeEndDate && matchesStatus
      })
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

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

    const applyFilters = () => {
      // 這個函數可以用來觸發額外的過濾邏輯，如果需要的話
      console.log('Filters applied')
    }

    const toggleOrderDetails = (orderId) => {
      const index = expandedOrders.value.indexOf(orderId)
      if (index === -1) {
        expandedOrders.value.push(orderId)
      } else {
        expandedOrders.value.splice(index, 1)
      }
    }

    onMounted(async () => {
      // 這裡應該從後端 API 獲取訂單數據
      // 現在我們使用模擬數據
      orders.value = [
        {
          id: '001',
          date: '2023-05-15T10:30:00Z',
          status: '已完成',
          total: 15000,
          items: [
            { id: 1, name: '五尺雙人床頭', quantity: 1, price: 5000 },
            { id: 2, name: '三人沙發', quantity: 1, price: 10000 }
          ],
          address: '台北市信義區101號',
          deliveryTime: {
            weekday: true,
            weekend: false,
            morning: true,
            afternoon: false,
            evening: false
          },
          paymentMethod: 'creditCard'
        },
        {
          id: '002',
          date: '2023-06-01T14:45:00Z',
          status: '處理中',
          total: 8000,
          items: [
            { id: 3, name: '餐桌', quantity: 1, price: 8000 }
          ],
          address: '新北市板橋區府中路1號',
          deliveryTime: {
            weekday: false,
            weekend: true,
            morning: false,
            afternoon: true,
            evening: false
          },
          paymentMethod: 'transfer'
        }
      ]
    })

    return {
      orders,
      filteredOrders,
      startDate,
      endDate,
      selectedStatus,
      expandedOrders,
      formatDate,
      formatDeliveryTime,
      formatPaymentMethod,
      applyFilters,
      toggleOrderDetails
    }
  }
}
</script>

<style scoped>
.order-history {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-filter, .status-filter {
  display: flex;
  align-items: center;
}

.date-filter input, .status-filter select {
  margin-left: 10px;
  margin-right: 20px;
  padding: 5px;
}

.order-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.status-處理中 { color: #ffa500; }
.status-已出貨 { color: #1e90ff; }
.status-已完成 { color: #32cd32; }
.status-已取消 { color: #ff0000; }

.toggle-details {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.order-details {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.order-details ul {
  list-style-type: none;
  padding-left: 0;
}

.order-details li {
  margin-bottom: 5px;
}
</style>
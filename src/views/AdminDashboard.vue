<template>
  <div class="admin-dashboard">
    <nav class="sidebar">
      <div class="sidebar-header">
        <h2>五福傢俱管理</h2>
      </div>
      <ul class="nav-links">
        <li @click="currentView = 'overview'" :class="{ active: currentView === 'overview' }">概覽</li>
        <li @click="currentView = 'products'" :class="{ active: currentView === 'products' }">產品管理</li>
        <li @click="currentView = 'orders'" :class="{ active: currentView === 'orders' }">訂單管理</li>
        <li @click="currentView = 'users'" :class="{ active: currentView === 'users' }">用戶管理</li>
        <li @click="currentView = 'analytics'" :class="{ active: currentView === 'analytics' }">數據分析</li>
        <li @click="currentView = 'predictions'" :class="{ active: currentView === 'predictions' }">預測分析</li>
        <li @click="currentView = 'settings'" :class="{ active: currentView === 'settings' }">系統設置</li>
      </ul>
    </nav>

    <main class="main-content">
      <header>
        <h1>{{ viewTitle }}</h1>
        <div class="user-info">
          管理員：{{ currentUser.name }}
          <button @click="logout">登出</button>
        </div>
      </header>

      <div v-if="lowStockAlerts.length > 0" class="alerts">
        <h3>庫存警報</h3>
        <ul>
          <li v-for="alert in lowStockAlerts" :key="alert.id">
            {{ alert.name }} 庫存低於 {{ alert.lowStockThreshold }}（當前：{{ alert.stock }}）
          </li>
        </ul>
      </div>

      <div v-if="currentView === 'overview'" class="overview">
        <div class="kpi-cards">
          <div class="kpi-card">
            <h3>總銷售額</h3>
            <p>NT$ {{ totalSales }}</p>
          </div>
          <div class="kpi-card">
            <h3>訂單數</h3>
            <p>{{ totalOrders }}</p>
          </div>
          <div class="kpi-card">
            <h3>活躍用戶</h3>
            <p>{{ activeUsers }}</p>
          </div>
          <div class="kpi-card">
            <h3>平均訂單金額</h3>
            <p>NT$ {{ averageOrderValue }}</p>
          </div>
        </div>
        <div class="charts-container">
          <div class="chart">
            <h3>銷售趨勢</h3>
            <canvas ref="salesTrendChart"></canvas>
          </div>
          <div class="chart">
            <h3>產品類別分佈</h3>
            <canvas ref="categoryDistributionChart"></canvas>
          </div>
        </div>
      </div>

      <div v-if="currentView === 'products'">
        <h2>產品管理</h2>
        <div class="search-filter">
          <input v-model="productSearch" placeholder="搜索產品..." @input="productPage = 1">
          <select v-model="productCategoryFilter" @change="productPage = 1">
            <option value="">所有類別</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <button @click="showLowStockOnly = !showLowStockOnly">
            {{ showLowStockOnly ? '顯示所有產品' : '顯示低庫存產品' }}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名稱</th>
              <th>價格</th>
              <th>類別</th>
              <th>庫存</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id" :class="{ 'low-stock': product.stock <= product.lowStockThreshold }">
              <td>{{ product.id }}</td>
              <td>
                <input v-if="editingProduct === product.id" v-model="product.name" @blur="saveEdit(product)">
                <span v-else>{{ product.name }}</span>
              </td>
              <td>
                <input v-if="editingProduct === product.id" v-model.number="product.price" @blur="saveEdit(product)">
                <span v-else>NT$ {{ product.price }}</span>
              </td>
              <td>
                <input v-if="editingProduct === product.id" v-model="product.category" @blur="saveEdit(product)">
                <span v-else>{{ product.category }}</span>
              </td>
              <td>
                <input v-if="editingProduct === product.id" v-model.number="product.stock" @blur="saveEdit(product)">
                <span v-else>{{ product.stock }}</span>
              </td>
              <td>
                <button v-if="editingProduct !== product.id" @click="startEdit(product.id)">編輯</button>
                <button v-else @click="cancelEdit">取消</button>
                <button @click="updateStock(product)">更新庫存</button>
                <button @click="deleteProduct(product.id)">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="productPage--" :disabled="productPage === 1">上一頁</button>
          <span>第 {{ productPage }} 頁，共 {{ totalProductPages }} 頁</span>
          <button @click="productPage++" :disabled="productPage === totalProductPages">下一頁</button>
        </div>
        <button @click="showAddProductForm = true">添加新產品</button>

        <div v-if="showAddProductForm" class="product-form">
          <h3>添加新產品</h3>
          <form @submit.prevent="addProduct">
            <input v-model="newProduct.name" placeholder="產品名稱" required>
            <input v-model.number="newProduct.price" type="number" placeholder="價格" required>
            <input v-model="newProduct.category" placeholder="類別" required>
            <input v-model.number="newProduct.stock" type="number" placeholder="初始庫存" required>
            <input v-model.number="newProduct.lowStockThreshold" type="number" placeholder="低庫存閾值" required>
            <button type="submit">添加</button>
          </form>
        </div>
      </div>

      <div v-if="currentView === 'orders'">
        <h2>訂單管理</h2>
        <div class="search-filter">
          <input v-model="orderSearch" placeholder="搜索訂單..." @input="orderPage = 1">
          <select v-model="orderStatusFilter" @change="orderPage = 1">
            <option value="">所有狀態</option>
            <option value="處理中">處理中</option>
            <option value="已出貨">已出貨</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
          <input type="date" v-model="startDate" @change="filterOrders">
          <input type="date" v-model="endDate" @change="filterOrders">
        </div>
        <table>
          <thead>
            <tr>
              <th>訂單 ID</th>
              <th>日期</th>
              <th>狀態</th>
              <th>總金額</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ formatDate(order.date) }}</td>
              <td>
                <select v-model="order.status" @change="updateOrderStatus(order)">
                  <option value="處理中">處理中</option>
                  <option value="已出貨">已出貨</option>
                  <option value="已完成">已完成</option>
                  <option value="已取消">已取消</option>
                </select>
              </td>
              <td>NT$ {{ order.total }}</td>
              <td>
                <button @click="viewOrderDetails(order)">查看詳情</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="orderPage--" :disabled="orderPage === 1">上一頁</button>
          <span>第 {{ orderPage }} 頁，共 {{ totalOrderPages }} 頁</span>
          <button @click="orderPage++" :disabled="orderPage === totalOrderPages">下一頁</button>
        </div>
      </div>

      <div v-if="currentView === 'analytics'" class="analytics">
        <div class="date-range">
          <input type="date" v-model="analysisStartDate" @change="updateAnalysis">
          <input type="date" v-model="analysisEndDate" @change="updateAnalysis">
        </div>
        <div class="charts-container">
          <div class="chart">
            <h3>銷售趨勢</h3>
            <canvas ref="salesChart"></canvas>
          </div>
          <div class="chart">
            <h3>熱門產品</h3>
            <canvas ref="topProductsChart"></canvas>
          </div>
        </div>
        <div class="analytics-details">
          <h3>銷售摘要</h3>
          <p>總銷售額: NT$ {{ totalSales }}</p>
          <p>平均訂單金額: NT$ {{ averageOrderValue }}</p>
          <p>銷售最好的產品: {{ bestSellingProduct }}</p>
          <p>銷售最差的產品: {{ worstSellingProduct }}</p>
        </div>
        <div class="export-options">
          <h3>導出報告</h3>
          <button @click="exportData('sales')">導出銷售報告</button>
          <button @click="exportData('inventory')">導出庫存報告</button>
          <button @click="exportData('customers')">導出客戶報告</button>
        </div>
      </div>

      <div v-if="currentView === 'users'">
        <h2>用戶管理</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>用戶名</th>
              <th>電子郵件</th>
              <th>角色</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <select v-model="user.role" @change="updateUserRole(user)">
                  <option value="user">普通用戶</option>
                  <option value="admin">管理員</option>
                </select>
              </td>
              <td>
                <button @click="deleteUser(user.id)">刪除用戶</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="showAddUserForm = true">添加新用戶</button>
        <div v-if="showAddUserForm" class="user-form">
          <h3>添加新用戶</h3>
          <form @submit.prevent="addUser">
            <input v-model="newUser.username" placeholder="用戶名" required>
            <input v-model="newUser.email" type="email" placeholder="電子郵件" required>
            <input v-model="newUser.password" type="password" placeholder="密碼" required>
            <select v-model="newUser.role">
              <option value="user">普通用戶</option>
              <option value="admin">管理員</option>
            </select>
            <button type="submit">添加用戶</button>
          </form>
        </div>
      </div>

      <div v-if="currentView === 'predictions'" class="predictions">
        <h2>預測分析</h2>
        <div class="prediction-options">
          <select v-model="selectedPrediction">
            <option value="sales">銷售預測</option>
            <option value="inventory">庫存預測</option>
            <option value="customerChurn">客戶流失預測</option>
          </select>
          <button @click="runPrediction">運行預測</button>
        </div>
        <div class="prediction-result" v-if="predictionResult">
          <h3>{{ predictionResultTitle }}</h3>
          <canvas ref="predictionChart"></canvas>
          <p>{{ predictionSummary }}</p>
        </div>
      </div>

      <div v-if="currentView === 'settings'" class="settings">
        <h2>系統設置</h2>
        <div class="setting-group">
          <h3>儀表板自定義</h3>
          <label>
            <input type="checkbox" v-model="settings.showLowStockAlerts"> 顯示低庫存警報
          </label>
          <label>
            <input type="checkbox" v-model="settings.enableRealtimeUpdates"> 啟用實時數據更新
          </label>
        </div>
        <div class="setting-group">
          <h3>數據分析設置</h3>
          <label>
            預設日期範圍：
            <select v-model="settings.defaultDateRange">
              <option value="7">過去7天</option>
              <option value="30">過去30天</option>
              <option value="90">過去90天</option>
              <option value="365">過去一年</option>
            </select>
          </label>
        </div>
        <button @click="saveSettings">保存設置</button>
      </div>

      <div class="export-buttons">
        <button @click="exportData('products')">匯出產品數據</button>
        <button @click="exportData('orders')">匯出訂單數據</button>
        <button @click="exportData('users')">匯出用戶數據</button>
      </div>

      <div v-if="selectedOrder" class="modal">
        <div class="modal-content">
          <h3>訂單詳情 - 訂單 ID: {{ selectedOrder.id }}</h3>
          <p>日期: {{ formatDate(selectedOrder.date) }}</p>
          <p>狀態: {{ selectedOrder.status }}</p>
          <p>總金額: NT$ {{ selectedOrder.total }}</p>
          <h4>訂單項目:</h4>
          <ul>
            <li v-for="item in selectedOrder.items" :key="item.id">
              {{ item.name }} - 數量: {{ item.quantity }} - 單價: NT$ {{ item.price }}
            </li>
          </ul>
          <button @click="selectedOrder = null">關閉</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'AdminDashboard',
  setup() {
    const currentView = ref('overview')
    const currentUser = ref({ name: '管理員A' })
    const products = ref([])
    const orders = ref([])
    const users = ref([])
    const showAddProductForm = ref(false)
    const showAddUserForm = ref(false)
    const newProduct = ref({ name: '', price: 0, category: '', stock: 0, lowStockThreshold: 10 })
    const newUser = ref({ username: '', email: '', password: '', role: 'user' })
    const editingProduct = ref(null)
    const selectedOrder = ref(null)
    const productPage = ref(1)
    const orderPage = ref(1)
    const itemsPerPage = 10
    const productSearch = ref('')
    const productCategoryFilter = ref('')
    const orderSearch = ref('')
    const orderStatusFilter = ref('')
    const salesChart = ref(null)
    const startDate = ref('')
    const endDate = ref('')
    const analysisStartDate = ref('')
    const analysisEndDate = ref('')
    const totalSales = ref(0)
    const totalOrders = ref(0)
    const activeUsers = ref(0)
    const averageOrderValue = ref(0)
    const bestSellingProduct = ref('')
    const worstSellingProduct = ref('')
    const showLowStockOnly = ref(false)
    const selectedPrediction = ref('sales')
    const predictionResult = ref(null)
    const settings = ref({
      showLowStockAlerts: true,
      enableRealtimeUpdates: false,
      defaultDateRange: '30'
    })

    const lowStockAlerts = computed(() => {
      return products.value.filter(product => product.stock <= product.lowStockThreshold)
    })

    const viewTitle = computed(() => {
      const titles = {
        overview: '儀表板概覽',
        products: '產品管理',
        orders: '訂單管理',
        users: '用戶管理',
        analytics: '數據分析',
        predictions: '預測分析',
        settings: '系統設置'
      }
      return titles[currentView.value]
    })

    const predictionResultTitle = computed(() => {
      const titles = {
        sales: '銷售預測結果',
        inventory: '庫存預測結果',
        customerChurn: '客戶流失預測結果'
      }
      return titles[selectedPrediction.value]
    })

    const predictionSummary = computed(() => {
      if (!predictionResult.value) return ''
      switch (selectedPrediction.value) {
        case 'sales':
          return `預計下個月銷售額將增長 ${predictionResult.value.growth}%`
        case 'inventory':
          return `建議在下個月增加 ${predictionResult.value.increaseAmount} 件庫存`
        case 'customerChurn':
          return `預計下個月客戶流失率為 ${predictionResult.value.churnRate}%`
        default:
          return ''
      }
    })

    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(productSearch.value.toLowerCase())
        const categoryMatch = productCategoryFilter.value ? product.category === productCategoryFilter.value : true
        const stockMatch = showLowStockOnly.value ? product.stock <= product.lowStockThreshold : true
        return nameMatch && categoryMatch && stockMatch
      })
    })

    const paginatedProducts = computed(() => {
      const start = (productPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredProducts.value.slice(start, end)
    })

    const totalProductPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

    const filteredOrders = computed(() => {
      return orders.value.filter(order => {
        const orderDate = new Date(order.date)
        const isAfterStart = !startDate.value || orderDate >= new Date(startDate.value)
        const isBeforeEnd = !endDate.value || orderDate <= new Date(endDate.value)
        const idMatch = order.id.includes(orderSearch.value)
        const statusMatch = orderStatusFilter.value ? order.status === orderStatusFilter.value : true
        return idMatch && statusMatch && isAfterStart && isBeforeEnd
      })
    })

    const paginatedOrders = computed(() => {
      const start = (orderPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredOrders.value.slice(start, end)
    })

    const totalOrderPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))

    const uniqueCategories = computed(() => {
      return [...new Set(products.value.map(p => p.category))]
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const startEdit = (productId) => {
      editingProduct.value = productId;
    };

    const saveEdit = (product) => {
      console.log('Saving edited product:', product);
      editingProduct.value = null;
    };

    const cancelEdit = () => {
      editingProduct.value = null;
    };

    const deleteProduct = (productId) => {
      console.log('Deleting product:', productId);
      products.value = products.value.filter(p => p.id !== productId);
    };

    const addProduct = () => {
      console.log('Adding product:', newProduct.value)
      const id = Math.max(...products.value.map(p => p.id)) + 1
      products.value.push({ id, ...newProduct.value })
      newProduct.value = { name: '', price: 0, category: '', stock: 0, lowStockThreshold: 10 }
      showAddProductForm.value = false
    };

    const viewOrderDetails = (order) => {
      selectedOrder.value = order
    };

    const updateOrderStatus = (order) => {
      console.log('Updating order status:', order)
    };

    const updateStock = (product) => {
      const newStock = prompt(`輸入 ${product.name} 的新庫存數量:`, product.stock)
      if (newStock !== null) {
        product.stock = parseInt(newStock, 10)
        console.log(`更新 ${product.name} 的庫存為 ${product.stock}`)
      }
    };

    const updateUserRole = (user) => {
      console.log(`更新用戶 ${user.username} 的角色為 ${user.role}`)
    };

    const deleteUser = (userId) => {
      console.log(`刪除用戶 ID: ${userId}`)
      users.value = users.value.filter(user => user.id !== userId)
    };

    const addUser = () => {
      console.log('添加新用戶:', newUser.value)
      const id = Math.max(...users.value.map(u => u.id)) + 1
      users.value.push({ id, ...newUser.value })
      newUser.value = { username: '', email: '', password: '', role: 'user' }
      showAddUserForm.value = false
    };

    const filterOrders = () => {
      orderPage.value = 1
    };

    const updateAnalysis = () => {
      totalSales.value = 500000
      averageOrderValue.value = 2500
      bestSellingProduct.value = '五尺雙人床頭'
      worstSellingProduct.value = '簡約風化妝台'

      updateSalesChart()
    };

    const updateSalesChart = () => {
      const labels = ['一月', '二月', '三月', '四月', '五月', '六月']
      const data = [12000, 19000, 30000, 50000, 20000, 30000]

      if (salesChart.value) {
        salesChart.value.data.labels = labels
        salesChart.value.data.datasets[0].data = data
        salesChart.value.update()
      } else {
        createSalesChart(labels, data)
      }
    };

    const createSalesChart = (labels, data) => {
      const ctx = document.getElementById('salesChart')
      if (ctx) {
        salesChart.value = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: '銷售額 (NT$)',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
    };

    const updateSalesTrendChart = () => {
      const ctx = document.getElementById('salesTrendChart')
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
            datasets: [{
              label: '銷售額',
              data: [120000, 190000, 300000, 500000, 200000, 300000],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
    };

    const updateCategoryDistributionChart = () => {
      const ctx = document.getElementById('categoryDistributionChart')
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['臥室', '客廳', '廚房', '書房'],
            datasets: [{
              data: [300, 200, 100, 50],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)'
              ]
            }]
          },
          options: {
            responsive: true
          }
        })
      }
    };

    const runPrediction = () => {
      switch (selectedPrediction.value) {
        case 'sales':
          predictionResult.value = { growth: 5.2 }
          break
        case 'inventory':
          predictionResult.value = { increaseAmount: 100 }
          break
        case 'customerChurn':
          predictionResult.value = { churnRate: 2.5 }
          break
      }
      updatePredictionChart()
    };

    const updatePredictionChart = () => {
      const ctx = document.getElementById('predictionChart')
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
            datasets: [{
              label: '實際數據',
              data: [65, 59, 80, 81, 56, 55],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }, {
              label: '預測數據',
              data: [65, 59, 80, 81, 56, 55, 70],
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
              borderDash: [5, 5]
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
    };

    const saveSettings = () => {
      console.log('保存設置:', settings.value)
      alert('設置已保存')
    };

    const exportData = (dataType) => {
      console.log(`正在匯出 ${dataType} 數據`)
      alert(`${dataType} 數據已準備好下載`)
    };

    const logout = () => {
      console.log('登出')
    };

    watch(currentView, (newView) => {
      if (newView === 'overview') {
        updateOverview()
      } else if (newView === 'sales' || newView === 'analytics') {
        setTimeout(updateAnalysis, 0)
      }
    });

    const updateOverview = () => {
      totalSales.value = 1500000
      totalOrders.value = 500
      activeUsers.value = 1000
      averageOrderValue.value = totalSales.value / totalOrders.value

      updateSalesTrendChart()
      updateCategoryDistributionChart()
    };

    onMounted(() => {
      updateOverview()
      products.value = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `產品 ${i + 1}`,
        price: Math.floor(Math.random() * 10000) + 1000,
        category: ['臥室', '客廳', '廚房', '書房'][Math.floor(Math.random() * 4)],
        stock: Math.floor(Math.random() * 100),
        lowStockThreshold: 10
      }))

      orders.value = Array.from({ length: 50 }, (_, i) => ({
        id: `00${i + 1}`,
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        status: ['處理中', '已出貨', '已完成', '已取消'][Math.floor(Math.random() * 4)],
        total: Math.floor(Math.random() * 50000) + 5000,
        items: [
          { id: 1, name: '產品 A', quantity: 2, price: 1000 },
          { id: 2, name: '產品 B', quantity: 1, price: 2000 }
        ]
      }))

      users.value = [
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'user' },
      ]
    });

    return {
      currentView,
      currentUser,
      viewTitle,
      products,
      orders,
      users,
      showAddProductForm,
      showAddUserForm,
      newProduct,
      newUser,
      editingProduct,
      selectedOrder,
      productPage,
      orderPage,
      paginatedProducts,
      paginatedOrders,
      totalProductPages,
      totalOrderPages,
      productSearch,
      productCategoryFilter,
      orderSearch,
      orderStatusFilter,
      uniqueCategories,
      lowStockAlerts,
      formatDate,
      startEdit,
      saveEdit,
      cancelEdit,
      deleteProduct,
      addProduct,
      viewOrderDetails,
      updateOrderStatus,
      updateStock,
      updateUserRole,
      deleteUser,
      addUser,
      startDate,
      endDate,
      analysisStartDate,
      analysisEndDate,
      totalSales,
      totalOrders,
      activeUsers,
      averageOrderValue,
      bestSellingProduct,
      worstSellingProduct,
      showLowStockOnly,
      selectedPrediction,
      predictionResult,
      predictionResultTitle,
      predictionSummary,
      settings,
      filterOrders,
      updateAnalysis,
      exportData,
      runPrediction,
      saveSettings,
      updateSalesChart,
      logout
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}

.sidebar-header h2 {
  margin-bottom: 20px;
}

.nav-links {
  list-style-type: none;
  padding: 0;
}

.nav-links li {
  padding: 10px;
  cursor: pointer;
}

.nav-links li.active {
  background-color: #34495e;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.kpi-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.kpi-card {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
  margin: 0 10px;
}

.charts-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.chart {
  width: 48%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.alerts {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.alerts h3 {
  color: #856404;
  margin-top: 0;
}

.alerts ul {
  list-style-type: none;
  padding: 0;
}

.alerts li {
  margin-bottom: 5px;
}

.product-form, .user-form {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 20px;
}

.product-form input, .product-form select, .user-form input, .user-form select {
  display: block;
  margin-bottom: 10px;
  padding: 5px;
  width: 200px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination span {
  margin: 0 10px;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
}

.chart-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.date-range {
  margin-bottom: 20px;
}

.date-range input {
  margin-right: 10px;
}

.low-stock {
  background-color: #ffcccc;
}

.analytics-details {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.export-buttons {
  margin-top: 20px;
}

.export-buttons button {
  margin-right: 10px;
}

.predictions, .settings {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.prediction-options, .setting-group {
  margin-bottom: 20px;
}

.prediction-options select, .setting-group select {
  margin-right: 10px;
}

.setting-group label {
  display: block;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.actions {
  margin-bottom: 20px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}
</style>

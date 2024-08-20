<template>
  <div id="app">
    <header>
      <h1>五福傢俱</h1>
      <nav>
        <router-link to="/">首頁</router-link> |
        <router-link to="/products">產品</router-link> |
        <router-link to="/cart">購物車 ({{ totalItems }})</router-link> |
        <template v-if="user">
          <router-link to="/profile">個人資料</router-link> |
          <router-link to="/order-history">訂單歷史</router-link> |
          <a @click="logout" href="#">登出</a>
        </template>
        <template v-else>
          <router-link to="/login">消費者登入</router-link> |
          <router-link to="/register">註冊</router-link> |
          <router-link to="/admin-login">管理員登入</router-link>
        </template>
      </nav>
    </header>

    <main>
      <router-view></router-view>
    </main>

    <footer>
      <p>&copy; 2024 五福傢俱. 版權所有。</p>
    </footer>
  </div>
</template>

<script>
import { provide, ref, computed, onMounted, watch } from 'vue'
import useCart from './cartState'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, loadCart } = useCart()
    provide('cart', {
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    })

    const router = useRouter()
    const user = ref(null)
    const isAdmin = computed(() => user.value && user.value.role === 'admin')

    const loadUser = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
        loadCart()
        if (isAdmin.value) {
          router.push('/admin')
        }
      }
    }

    onMounted(loadUser)

    watch(user, (newUser) => {
      if (newUser) {
        loadCart()
      } else {
        clearCart()
      }
    })

    const logout = () => {
      localStorage.removeItem('user')
      user.value = null
      clearCart()
      router.push('/')
    }

    return {
      totalItems: totalItems(),
      user,
      logout
    }
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  background-color: #f8f8f8;
  padding: 20px;
}

nav {
  padding: 20px 0;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

main {
  padding: 20px;
}

footer {
  background-color: #f8f8f8;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
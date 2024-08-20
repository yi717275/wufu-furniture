import { ref, watch } from 'vue'

export default function useCart() {
  const cart = ref([])

  // 從 localStorage 加載購物車
  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      cart.value = JSON.parse(savedCart)
    }
  }

  // 保存購物車到 localStorage
  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  }

  // 監聽購物車變化並保存
  watch(cart, saveCart, { deep: true })

  const addToCart = (product) => {
    const existingItem = cart.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.push({ ...product, quantity: 1 })
    }
  }

  const removeFromCart = (productId) => {
    const index = cart.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }

  const updateQuantity = (productId, quantity) => {
    const item = cart.value.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  const totalItems = () => {
    return cart.value.reduce((total, item) => total + item.quantity, 0)
  }

  const totalPrice = () => {
    return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // 初始加載購物車
  loadCart()

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    loadCart
  }
}
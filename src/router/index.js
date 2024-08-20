import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import ProductsView from '../views/Products.vue'
import ProductDetail from '../views/ProductDetail.vue'
import CartView from '../views/Cart.vue'
import CheckoutView from '../views/Checkout.vue'
import OrderConfirmation from '../views/OrderConfirmation.vue'
import LoginView from '../views/Login.vue'
import RegisterView from '../views/Register.vue'
import ProfileView from '../views/Profile.vue'
import OrderHistoryView from '../views/OrderHistory.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import ForgotPasswordView from '../views/ForgotPassword.vue'
import AdminLoginView from '../views/AdminLogin.vue'
import Auth from '../utils/Auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartView
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-confirmation/:orderNumber',
    name: 'OrderConfirmation',
    component: OrderConfirmation,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-history',
    name: 'OrderHistory',
    component: OrderHistoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: AdminLoginView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  Auth.checkAuth()
  
  if (to.matched.some(record => record.meta.requiresAuth) && !Auth.user.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.matched.some(record => record.meta.requiresAdmin) && Auth.user.value?.role !== 'admin') {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
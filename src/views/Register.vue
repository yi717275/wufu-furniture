<template>
  <div class="register">
    <h2>註冊</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">姓名：</label>
        <input type="text" id="name" v-model="name" required>
      </div>
      <div class="form-group">
        <label for="email">電子郵件：</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="lineId">LINE ID：</label>
        <input type="text" id="lineId" v-model="lineId">
      </div>
      <div class="form-group">
        <label for="password">密碼：</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">確認密碼：</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <button type="submit" :disabled="isLoading">{{ isLoading ? '註冊中...' : '註冊' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p>已有帳號？ <router-link to="/login">登錄</router-link></p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '@/utils/Auth'

export default {
  name: 'RegisterView',
  setup() {
    const name = ref('')
    const email = ref('')
    const lineId = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const router = useRouter()

    const handleSubmit = async () => {
      if (password.value !== confirmPassword.value) {
        error.value = '密碼不匹配'
        return
      }

      isLoading.value = true
      error.value = ''
      try {
        await Auth.register(name.value, email.value, password.value, lineId.value)
        localStorage.setItem('user', JSON.stringify({ name: name.value, email: email.value, lineId: lineId.value }))
        router.push('/')
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      name,
      email,
      lineId,
      password,
      confirmPassword,
      error,
      isLoading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #a0cfb4;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>

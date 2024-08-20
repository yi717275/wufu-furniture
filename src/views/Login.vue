<template>
  <div class="login">
    <h2>登錄</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">電子郵件：</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">密碼：</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" :disabled="isLoading">{{ isLoading ? '登錄中...' : '登錄' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p>忘記密碼？ <router-link to="/forgot-password">重置密碼</router-link></p>
    <p>還沒有帳號？ <router-link to="/register">註冊</router-link></p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Auth from '@/utils/Auth'

export default {
  name: 'LoginView',
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const router = useRouter()
    const route = useRoute()

    const handleSubmit = async () => {
      isLoading.value = true
      error.value = ''
      try {
        await Auth.login(email.value, password.value)
        const redirectPath = route.query.redirect || '/'
        router.push(redirectPath)
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      password,
      error,
      isLoading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.login {
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
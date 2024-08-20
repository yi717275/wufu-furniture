<template>
  <div class="admin-login">
    <h2>管理員登入</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="account">帳號：</label>
        <input type="text" id="account" v-model="account" required>
      </div>
      <div class="form-group">
        <label for="password">密碼：</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" :disabled="isLoading">{{ isLoading ? '登入中...' : '登入' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '@/utils/Auth'

export default {
  name: 'AdminLoginView',
  setup() {
    const account = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const router = useRouter()

    const handleSubmit = async () => {
      isLoading.value = true
      error.value = ''
      try {
        const user = await Auth.adminLogin(account.value, password.value)
        if (user.role === 'admin') {
          router.push('/admin')
        } else {
          throw new Error('無效的管理員帳號')
        }
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      account,
      password,
      error,
      isLoading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.admin-login {
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

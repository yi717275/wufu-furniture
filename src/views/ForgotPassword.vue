<template>
  <div class="forgot-password">
    <h2>忘記密碼</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">電子郵件：</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <button type="submit" :disabled="isLoading">{{ isLoading ? '發送中...' : '發送重置密碼郵件' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p>記起密碼了？ <router-link to="/login">登錄</router-link></p>
  </div>
</template>

<script>
import { ref } from 'vue'
import Auth from '@/utils/Auth'

export default {
  name: 'ForgotPasswordView',
  setup() {
    const email = ref('')
    const error = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)

    const handleSubmit = async () => {
      isLoading.value = true
      error.value = ''
      successMessage.value = ''
      try {
        const result = await Auth.forgotPassword(email.value)
        successMessage.value = result.message
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      error,
      successMessage,
      isLoading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.forgot-password {
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

.success {
  color: green;
  margin-top: 10px;
}
</style>
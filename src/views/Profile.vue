<template>
  <div class="profile">
    <h2>個人資料</h2>
    <div v-if="user">
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="name">姓名：</label>
          <input type="text" id="name" v-model="user.name" required>
        </div>
        <div class="form-group">
          <label for="email">電子郵件：</label>
          <input type="email" id="email" v-model="user.email" required>
        </div>
        <div class="form-group">
          <label for="phone">電話：</label>
          <input type="tel" id="phone" v-model="user.phone">
        </div>
        <div class="form-group">
          <label for="address">地址：</label>
          <textarea id="address" v-model="user.address"></textarea>
        </div>
        <button type="submit" :disabled="isLoading">{{ isLoading ? '更新中...' : '更新資料' }}</button>
      </form>
      <div class="change-password">
        <h3>更改密碼</h3>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label for="currentPassword">當前密碼：</label>
            <input type="password" id="currentPassword" v-model="currentPassword" required>
          </div>
          <div class="form-group">
            <label for="newPassword">新密碼：</label>
            <input type="password" id="newPassword" v-model="newPassword" required>
          </div>
          <div class="form-group">
            <label for="confirmNewPassword">確認新密碼：</label>
            <input type="password" id="confirmNewPassword" v-model="confirmNewPassword" required>
          </div>
          <button type="submit" :disabled="isChangingPassword">{{ isChangingPassword ? '更改中...' : '更改密碼' }}</button>
        </form>
      </div>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Auth from '@/utils/Auth'

export default {
  name: 'ProfileView',
  setup() {
    const user = ref(null)
    const error = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)
    const isChangingPassword = ref(false)
    const currentPassword = ref('')
    const newPassword = ref('')
    const confirmNewPassword = ref('')

    onMounted(() => {
      user.value = Auth.user.value
    })

    const updateProfile = async () => {
      isLoading.value = true
      error.value = ''
      successMessage.value = ''
      try {
        // 这里应该调用后端 API 来更新用户资料
        // 现在我们只是更新本地存储
        localStorage.setItem('user', JSON.stringify(user.value))
        successMessage.value = '個人資料已更新'
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    const changePassword = async () => {
      if (newPassword.value !== confirmNewPassword.value) {
        error.value = '新密碼不匹配'
        return
      }

      isChangingPassword.value = true
      error.value = ''
      successMessage.value = ''
      try {
        // 这里应该调用后端 API 来更改密码
        // 现在我们只是模拟这个过程
        await new Promise(resolve => setTimeout(resolve, 1000))
        successMessage.value = '密碼已成功更改'
        currentPassword.value = ''
        newPassword.value = ''
        confirmNewPassword.value = ''
      } catch (err) {
        error.value = err.message
      } finally {
        isChangingPassword.value = false
      }
    }

    return {
      user,
      error,
      successMessage,
      isLoading,
      isChangingPassword,
      currentPassword,
      newPassword,
      confirmNewPassword,
      updateProfile,
      changePassword
    }
  }
}
</script>

<style scoped>
.profile {
  max-width: 600px;
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

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  height: 100px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #3aa876;
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

.change-password {
  margin-top: 30px;
}
</style>
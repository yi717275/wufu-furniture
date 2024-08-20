// src/utils/Auth.js

import { ref } from 'vue'

const user = ref(null)

export default {
  user,
  login(email, password) {
    // 這裡應該調用後端 API 進行身份驗證
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'password') {
          user.value = { id: 1, name: 'Admin', email: email, role: 'admin' }
          localStorage.setItem('user', JSON.stringify(user.value))
          resolve(user.value)
        } else if (email === 'user@example.com' && password === 'password') {
          user.value = { id: 2, name: 'User', email: email, role: 'user' }
          localStorage.setItem('user', JSON.stringify(user.value))
          resolve(user.value)
        } else {
          reject(new Error('Invalid email or password'))
        }
      }, 1000)
    })
  },
  adminLogin(account, password) {
    // 這裡應該調用後端 API 進行管理員身份驗證
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (account === '0937706521' && password === 'Ll19861025') {
          user.value = { id: 1, name: 'Admin', account: account, role: 'admin' }
          localStorage.setItem('user', JSON.stringify(user.value))
          resolve(user.value)
        } else {
          reject(new Error('無效的管理員帳號或密碼'))
        }
      }, 1000)
    })
  },
  register(name, email, password, lineId) {
    // 這裡應該調用後端 API 進行用戶註冊
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模擬註冊過程
        if (email === 'admin@example.com') {
          reject(new Error('Email already exists'))
        } else {
          const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            lineId: lineId || null,  // 如果 lineId 为空字符串，则存储为 null
            role: 'user' 
          }
          user.value = newUser
          localStorage.setItem('user', JSON.stringify(newUser))
          resolve(newUser)
        }
      }, 1000)
    })
  },
  logout() {
    user.value = null
    localStorage.removeItem('user')
  },
  checkAuth() {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  },
  forgotPassword(email) {
    // 這裡應該調用後端 API 來發送重置密碼的郵件
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模擬發送重置密碼郵件的過程
        if (email === 'admin@example.com' || email === 'user@example.com') {
          resolve({ message: '重置密碼的郵件已發送' })
        } else {
          reject(new Error('找不到該郵箱對應的用戶'))
        }
      }, 1000)
    })
  },
  resetPassword(token, newPassword) {
    // 這裡應該調用後端 API 來重置密碼
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模擬重置密碼的過程
        if (token === 'valid_token') {
          console.log(`Password would be reset to: ${newPassword}`);
          resolve({ message: '密碼已成功重置' })
        } else {
          reject(new Error('無效或過期的令牌'))
        }
      }, 1000)
    })
  }
}

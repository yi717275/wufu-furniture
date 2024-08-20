<template>
  <div class="space-planner">
    <h2>空間規劃</h2>
    <div class="planner-input">
      <div class="room-dimensions">
        <label>
          房間尺寸：
          <input v-model.number="roomWidth" type="number" placeholder="寬度 (cm)">
          x
          <input v-model.number="roomLength" type="number" placeholder="長度 (cm)">
        </label>
      </div>
      <div class="furniture-list">
        <label>需要的家具（每行一個）：</label>
        <textarea v-model="furnitureList" placeholder="例如：
雙人床
衣櫃
書桌"></textarea>
      </div>
      <button @click="planSpace">規劃空間</button>
    </div>
    <div v-if="recommendation" class="recommendation">
      <h3>推薦配置：</h3>
      <ul>
        <li v-for="(item, index) in recommendation" :key="index">
          {{ item.name }} - {{ item.width }}cm x {{ item.length }}cm
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SpacePlanner',
  setup() {
    const roomWidth = ref(0)
    const roomLength = ref(0)
    const furnitureList = ref('')
    const recommendation = ref(null)

    const availableProducts = [
      { name: '雙人床', width: 150, length: 200 },
      { name: '單人床', width: 90, length: 200 },
      { name: '衣櫃', width: 120, length: 60 },
      { name: '書桌', width: 120, length: 60 },
      { name: '餐桌', width: 150, length: 90 },
      { name: '沙發', width: 200, length: 90 },
      { name: '電視櫃', width: 180, length: 45 },
      { name: '梳妝台', width: 100, length: 50 },
      { name: '床頭櫃', width: 45, length: 45 }
    ]

    const planSpace = () => {
      const items = furnitureList.value.split('\n').filter(item => item.trim() !== '')
      const recommended = []

      for (const item of items) {
        const product = availableProducts.find(p => p.name.includes(item))
        if (product) {
          recommended.push(product)
        }
      }

      // 簡單的佈局檢查
      let totalArea = 0
      for (const item of recommended) {
        totalArea += item.width * item.length
      }

      const roomArea = roomWidth.value * roomLength.value
      if (totalArea > roomArea * 0.8) { // 假設家具不應該佔用超過80%的房間面積
        alert('警告：選擇的家具可能太多，無法舒適地放入房間。請考慮減少一些家具或選擇更小的款式。')
      }

      recommendation.value = recommended
    }

    return {
      roomWidth,
      roomLength,
      furnitureList,
      recommendation,
      planSpace
    }
  }
}
</script>

<style scoped>
.space-planner {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.planner-input {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.room-dimensions input {
  width: 80px;
  margin: 0 5px;
  padding: 5px;
}

.furniture-list textarea {
  width: 100%;
  height: 100px;
  padding: 5px;
}

button {
  align-self: flex-start;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #3aa876;
}

.recommendation ul {
  list-style-type: none;
  padding: 0;
}

.recommendation li {
  margin-bottom: 10px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
}
</style>
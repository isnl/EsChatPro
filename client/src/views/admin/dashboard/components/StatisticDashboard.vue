<template>
  <div class="sm:grid sm:grid-cols-7 sm:gap-4">
    <div
      v-for="(item, key) in statistics"
      :key="key"
      class="my-4 sm:my-0"
      :class="getCardClasses(key)"
      :style="{
        background: `linear-gradient(to bottom right, ${gradients[key].from}, ${gradients[key].to})`
      }"
    >
      <div class="p-4">
        <h2 class="text-xl text-#888 font-bold mb-2">{{ statisticsMaps[key] }}</h2>
        <p class="text-3xl text-#666 font-semibold">{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { service } from '@/service'

const statisticsMaps = {
  userCount: '用户总数',
  shareCount: '分享总数',
  callCount: '调用总数',
  todayRegisterUserCount: '今日注册用户数',
  todayUsedUserCount: '今日使用用户数',
  todayCallsCount: '今日调用次数',
  todayShareCount: '今日分享次数'
}

const statistics = ref({})

function getCardClasses(index) {
  const gradientClasses = {
    userCount: 'to-red-200',
    shareCount: 'to-green-200',
    callCount: 'to-yellow-200',
    todayRegisterUserCount: 'to-purple-200',
    todayUsedUserCount: 'to-pink-200',
    todayCallsCount: 'to-indigo-200',
    todayShareCount: 'to-blue-200'
  }

  return [
    'rounded-md',
    'shadow-[0_0_5px_rgba(153,153,153,0.4)]',
    'hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]',
    'hover:scale-105',
    'dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]',
    'transition-all',
    'duration-300',
    gradientClasses[index]
  ]
}

const gradients = {
  userCount: { from: 'rgba(64, 158, 255, 0.5)', to: 'rgba(94, 189, 169, 0.5)' },
  shareCount: { from: 'rgba(94, 189, 169, 0.5)', to: 'rgba(124, 220, 83, 0.5)' },
  callCount: { from: 'rgba(124, 220, 83, 0.5)', to: 'rgba(155, 251, 253, 0.5)' },
  todayRegisterUserCount: { from: 'rgba(155, 251, 253, 0.5)', to: 'rgba(185, 34, 100, 0.5)' },
  todayUsedUserCount: { from: 'rgba(185, 34, 100, 0.5)', to: 'rgba(215, 65, 212, 0.5)' },
  todayCallsCount: { from: 'rgba(215, 65, 212, 0.5)', to: 'rgba(245, 96, 126, 0.5)' },
  todayShareCount: { from: 'rgba(245, 96, 126, 0.5)', to: 'rgba(255, 127, 0, 0.5)' }
}

const getDashboardInfo = () => {
  service.get('admin/statistics').then((res) => {
    statistics.value = res.data
  })
}

onBeforeMount(() => {
  getDashboardInfo()
})
</script>

<style scoped>
/* .to-red-200 {
  --gradient-color-to: rgba(220, 38, 38, 0.6);
}

.to-green-200 {
  --gradient-color-to: rgba(34, 197, 94, 0.6);
}

.to-yellow-200 {
  --gradient-color-to: rgba(255, 223, 0, 0.6);
}

.to-purple-200 {
  --gradient-color-to: rgba(138, 43, 226, 0.6);
}

.to-pink-200 {
  --gradient-color-to: rgba(240, 98, 146, 0.6);
}

.to-indigo-200 {
  --gradient-color-to: rgba(75, 85, 166, 0.6);
}
.to-blue-200 {
  --gradient-color-to: rgba(64, 158, 255, 0.6);
} */
</style>

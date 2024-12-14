<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import GoodTitle from '@/components/GoodTitle.vue'
import service from '@/service'
const currentDate = ref(new Date())

interface CallsCountInfo {
  count: number
  date: string
}

const list = ref<CallsCountInfo[]>([])

const getList = async () => {
  const res = await service.get(`admin/statistics/calls`)
  list.value = res.data
}

const getCountByDay = (day: string) => {
  const info = list.value.find((item) => item.date === day)
  return info ? info.count + '次' : ''
}

onBeforeMount(() => {
  getList()
})
</script>
<template>
  <div class="flex-1 ml-10">
    <GoodTitle title="调用日历" />
    <el-calendar v-model="currentDate">
      <template #date-cell="{ data }">
        <div :class="data.isSelected ? 'is-selected' : ''" class="flex flex-col">
          <span class="font-bold">{{ data.day.split('-').slice(2).join('-') }}</span>

          <span class="mt-2">{{ getCountByDay(data.day) }}</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import api from '@/service'

interface Timeline {
  id: string
  time: string
  content: string
}

const timelines = ref<Timeline[]>([])
const getTimelineList = () => {
  api.get('timeline').then((res: any) => {
    timelines.value = res.data.list
  })
}
onBeforeMount(() => {
  getTimelineList()
})
</script>
<template>
  <main class="max-w-screen-md h-full p-4 mx-auto">
    <h1 class="text-center">更新记录</h1>
    <el-timeline class="p-0">
      <el-timeline-item
        center
        :timestamp="item.time"
        placement="top"
        v-for="item in timelines"
        :key="item.content"
      >
        <el-card>
          <div class="text-xs lh-6" v-html="item.content"></div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </main>
</template>

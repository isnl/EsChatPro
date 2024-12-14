<script lang="ts" setup>
import { ref } from 'vue'
import { useModelStore } from '@/stores/model'
const modelStore = useModelStore()
const onModelChange = () => {
  modelStore.setVisible(true)
}
</script>
<template>
  <el-tooltip content="模型切换" placement="top">
    <div
      class="ml-3 sm:ml-5 w-12 h-12 fc b-rd-1/2 bg-#fff text-[#2f2f32] dark-text-[#b4bbc4] shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer absolute right-20px sm-right-50px bottom-100px"
      @click="onModelChange"
    >
      <el-icon class="text-lg"><Switch /></el-icon>
    </div>
  </el-tooltip>
</template>

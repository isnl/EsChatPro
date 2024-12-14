<script lang="ts" setup>
import { ref } from 'vue'
import { useNoticeStore } from '@/stores/notice'
const noticeStore = useNoticeStore()
</script>
<template>
  <div
    class="w-full h-45px mb-15px bg-#fff flex items-center border-rd-10px px-20px dark:bg-#333 dark-text-[#b4bbc4]"
  >
    <div
      class="flex items-center cursor-pointer space-x-10px"
      @click="noticeStore.setVisible(true)"
    >
      <el-icon><Bell /></el-icon>
      <span class="text-sm">{{ noticeStore.noticeInfo.title }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useChatStore } from '@/stores/chat'
import { SwitchButton } from '@element-plus/icons-vue'
const chatStore = useChatStore()

const { abort } = chatStore
</script>
<template>
  <div class="flex justify-center items-center h-40px" v-if="chatStore.generateLoading">
    <el-button @click="abort" type="warning" :icon="SwitchButton">停止响应</el-button>
  </div>
</template>

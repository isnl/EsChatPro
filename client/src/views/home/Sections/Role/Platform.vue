<script lang="ts" setup>
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { prompts } from '../prompt'

const { setPrompt } = useChatStore()
const promptList = ref<typeof prompts>([...prompts])

const onSelect = (prompt: string) => {
  setPrompt(prompt)
}
const keyword = ref('')

const onSearch = (value: string) => {
  promptList.value = prompts.filter((item) => item.act.includes(value))
}
</script>
<template>
  <div class="w-full px-2">
    <el-input placeholder="搜索" v-model="keyword" @input="onSearch"></el-input>
  </div>
  <el-scrollbar class="flex-1 py-2">
    <div
      class="w-full box-border p-2 px-4 overflow-hidden text-ellipsis whitespace-nowrap text-xs hover:bg-[#f5f5f5] dark-hover:bg-[#333] cursor-pointer dark-text-[#b4bbc4]"
      v-for="item in promptList"
      @click="onSelect(item.prompt)"
      :key="item.act"
    >
      {{ item.act }}
    </div>
  </el-scrollbar>
</template>

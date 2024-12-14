<script lang="ts" setup>
import { computed, ref } from 'vue'
import PlatformRole from './Role/Platform.vue'
import UploadRole from './Role/Upload.vue'
import DiyRole from './Role/Diy.vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
const chatStore = useChatStore()

const TABS = [
  { name: 'PlatformRole', label: '内置', component: PlatformRole },
  { name: 'upload', label: '用户分享', component: UploadRole, isVip: true },
  { name: 'diy', label: '自定义', component: DiyRole, isVip: true }
]
const { roleTabKey } = storeToRefs(chatStore)

const tabComponent = computed(() => {
  const tab = TABS.find((item) => item.name === roleTabKey.value)
  return tab?.component
})
</script>
<template>
  <div
    height="100%"
    class="sm:w-60 w-full border-rd-10px h-full flex-col sm:flex bg-#fff sm:mx-15px overflow-hidden dark:bg-#333"
  >
    <div class="w-full flex box-border p2 pb-0 dark-text-[#b4bbc4]">
      <div class="flex-1 font-bold">「</div>
      <div class="text-xl">角色列表</div>
      <div class="flex-1 font-bold flex items-end justify-end">」</div>
    </div>
    <el-tabs v-model="roleTabKey" class="fc">
      <el-tab-pane :name="item.name" v-for="item in TABS" :key="item.name">
        <template #label>
          {{ item.label }}
        </template>
      </el-tab-pane>
    </el-tabs>
    <component :is="tabComponent"></component>
  </div>
</template>

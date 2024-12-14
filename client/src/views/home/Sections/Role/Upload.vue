<script lang="ts" setup>
import { useSystemRoleHooks } from './hooks/useSystemRoleHooks'
import IconUsage from '@/components/icons/IconUsage.vue'

const { keyword, filterRoleList, currentRecord, onSelect, onSearch } = useSystemRoleHooks(
  'system_role?isPublic=true'
)
</script>
<template>
  <div class="w-full px-2">
    <el-input placeholder="搜索" v-model="keyword" @input="onSearch"></el-input>
  </div>
  <el-scrollbar class="flex-1 py-2" v-if="filterRoleList.length">
    <div
      class="w-full box-border p-2 px-4 flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-sm hover:bg-[#f5f5f5] dark-hover:bg-[#333] cursor-pointer dark-text-[#b4bbc4]"
    >
      <span class="flex-1 ellipsis font-bold">名称</span>
      <span class="ml-2 font-bold">调用量</span>
    </div>
    <div
      class="w-full box-border p-2 px-4 flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-xs hover:bg-[#f5f5f5] dark-hover:bg-[#333] cursor-pointer dark-text-[#b4bbc4]"
      :class="{
        'bg-[#f5f5f5] dark:bg-[#333]': item._id === currentRecord?.systemRole?._id
      }"
      v-for="item in filterRoleList"
      @click="onSelect(item)"
      :key="item._id"
    >
      <span class="flex-1 ellipsis">{{ item.title }}</span>
      <div class="text-12px fc">
        <el-icon>
          <IconUsage class="text-12" />
        </el-icon>
        <span class="ml-2">{{ item.usageCount }}</span>
      </div>
    </div>
  </el-scrollbar>
  <el-empty description="暂无数据" v-else />
</template>

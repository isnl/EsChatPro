<script lang="ts" setup>
import FormDialog from './FormDialog.vue'
import { useSystemRoleHooks } from './hooks/useSystemRoleHooks'

const {
  keyword,
  filterRoleList,
  currentRecord,
  formVisible,
  editInfo,
  onSelect,
  onSearch,
  onCreateSystemRole,
  onUpdated,
  onEditRole,
  deleteRole
} = useSystemRoleHooks('system_role')
</script>
<template>
  <div class="w-full px-2">
    <div
      class="mb-3 bl b-style-dashed fc py-2 text-xs dark-text-[#b4bbc4] cursor-pointer border-rd-1 hover:bg-[#f5f5f5] dark-hover:bg-[#333]"
      @click="onCreateSystemRole"
    >
      新建角色
    </div>
    <el-input placeholder="搜索" v-model="keyword" @input="onSearch"></el-input>
  </div>
  <el-scrollbar class="flex-1 py-2" v-if="filterRoleList.length">
    <div
      class="w-full box-border p-2 px-4 flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-sm hover:bg-[#f5f5f5] dark-hover:bg-[#333] cursor-pointer dark-text-[#b4bbc4]"
    >
      <span class="flex-1 ellipsis font-bold">名称</span>
      <span class="ml-2 font-bold">操作</span>
    </div>
    <div
      class="w-full box-border p-2 px-4 flex items-center overflow-hidden text-ellipsis whitespace-nowrap text-sm hover:bg-[#f5f5f5] dark-hover:bg-[#333] cursor-pointer dark-text-[#b4bbc4]"
      :class="{
        'bg-[#f5f5f5] dark:bg-[#333]': item._id === currentRecord?.systemRole?._id
      }"
      v-for="item in filterRoleList"
      @click="onSelect(item)"
      :key="item._id"
    >
      <span class="flex-1 ellipsis text-xs">{{ item.title }}</span>
      <el-icon @click="(e:Event)=> onEditRole(e, item)"><Edit /></el-icon>
      <el-popconfirm
        title="删除后，所有此角色相关的对话都将失效，确定删除吗？"
        :width="200"
        @confirm="deleteRole(item._id)"
        confirm-button-type="danger"
        confirm-button-text="确定"
        cancel-button-text="取消"
      >
        <template #reference>
          <el-icon class="ml-2" @click="(e: Event)=> e.stopPropagation()"><Delete /></el-icon>
        </template>
      </el-popconfirm>
    </div>
  </el-scrollbar>
  <el-empty description="暂无数据" v-else />

  <FormDialog v-model="formVisible" :editInfo="editInfo" @onUpdated="onUpdated" />
</template>

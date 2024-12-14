<script setup lang="ts">
import UserInfo from './UserInfo.vue'
import SessionRecord from './SessionRecord.vue'
import { ElScrollbar } from 'element-plus'
</script>

<template>
  <el-scrollbar height="100%" ref="scrollbarRef" view-class="h-full">
    <div class="w-full h-full flex flex-col py-4 sm:p-4">
      <UserInfo />
      <SessionRecord />
    </div>
  </el-scrollbar>
</template>

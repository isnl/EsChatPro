<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouterStore } from '@/stores/router'
const route = useRoute()
const routerStore = useRouterStore()

const props = defineProps<{
  asideClass: string
  menuClass: string
}>()
</script>
<template>
  <el-aside :class="asideClass">
    <el-menu :default-active="route.path" :class="menuClass" :router="true">
      <el-menu-item
        :index="'/admin/' + item.path"
        v-for="item in routerStore.routeInfo.children"
        :key="'/admin/' + item.path"
      >
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.alias }}</span>
        </template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

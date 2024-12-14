<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import AdminHeader from './components/AdminHeader.vue'
const router = useRouter()

const showPannel = ref(false)
const onTogglePannel = () => {
  showPannel.value = !showPannel.value
}

const goHome = () => {
  router.push('/')
}
</script>
<template>
  <el-container class="w-full h-full flex flex-col sm:flex-row">
    <!-- <AdminHeader aside-class="w-auto display-none flex-col sm:flex" menu-class="w-200px flex-1" /> -->

    <div class="flex items-center px-4 sm:hidden w-full h-12 bbl">
      <el-icon @click="onTogglePannel" class="text-6 color-[#24292f]"><Menu /></el-icon>

      <el-drawer v-model="showPannel" size="80%" :with-header="false">
        <!-- <AdminHeader aside-class="w-full flex flex-col" menu-class="w-full" /> -->
      </el-drawer>
    </div>
    <el-main class="flex-1">
      <div class="flex flex-col">
        <div class="flex-1 overflow-hidden">
          <RouterView />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

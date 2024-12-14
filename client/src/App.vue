<script setup lang="ts">
import { onBeforeMount, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { service } from '@/service'

const { setIsLogin, setVisible } = useLoginStore()
onBeforeMount(async () => {
  try {
    const res = await service.get('status')
    if (res) {
      setIsLogin(true)
    }
  } catch (error) {
    setVisible(true)
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>

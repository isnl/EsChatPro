<script lang="ts" setup>
import { ref } from 'vue'
import StatisticDashboard from './components/StatisticDashboard.vue'
import StatisticUser from './components/StatisticUser.vue'
import GoodTitle from '@/components/GoodTitle.vue'
import Calendar from './components/Calendar.vue'
</script>
<template>
  <div class="sm:mx-4 flex flex-col overflow-hidden">
    <GoodTitle title="仪表盘" />
    <StatisticDashboard />
    <div class="w-full flex-1 overflow-hidden flex justify-between">
      <StatisticUser />
      <Calendar />
    </div>
  </div>
</template>

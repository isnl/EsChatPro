<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '标题'
  }
})
</script>
<template>
  <div class="w-full h-38px flex items-center bg-[rgba(64,158,255,.3)] border-rd-4px pl-20px">
    <span class="w-5px h-20px bg-#67c23a"></span>
    <h3 class="text-14px font-bold pl-10px">
      {{ title }}
    </h3>
    <slot></slot>
  </div>
</template>

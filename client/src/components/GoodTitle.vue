<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '标题'
  }
})
</script>
<template>
  <div class="w-full flex sm:py-4">
    <h3 class="title px-5">
      {{ title }}
    </h3>
  </div>
</template>
<style>
.title {
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(56%, transparent),
    color-stop(0, #fdd000)
  );
  font-weight: bold;
  background-image: linear-gradient(180deg, transparent 56%, #fdd000);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  text-decoration: none;
  -webkit-transition: background-size 0.4s ease;
  transition: background-size 0.4s ease;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue'
import IconShare from '@/components/icons/IconShare.vue'
import IconSystemRole from '@/components/icons/IconSystemRole.vue'
import PannelLeft from '../PannelLeft/index.vue'
import { PromptStore } from '../Sections'
import { useChatStore } from '@/stores/chat'
import { useScreenshotStore } from '@/stores/screenshot'
import { storeToRefs } from 'pinia'
import { onShare } from '@/hooks/useShare'
import MenuPannel from './MenuPannel.vue'
const chatStore = useChatStore()

const screenshotStore = useScreenshotStore()
const { onScreenshot } = screenshotStore
const { screenshotLoading } = storeToRefs(screenshotStore)
const { currentMessage, generateLoading } = storeToRefs(chatStore)

const showPannel = ref(false)
const showSystemRole = ref(false)
const onTogglePannel = () => {
  showPannel.value = !showPannel.value
}
const onToggleSystemRole = () => {
  showSystemRole.value = !showSystemRole.value
}
</script>
<template>
  <div class="flex items-center justify-between px-4 sm:hidden w-full h-12 bbl">
    <el-icon @click="onTogglePannel" class="text-6 color-[#24292f] dark:text-#c9d1d9"
      ><Menu
    /></el-icon>
    <el-icon
      @click="onToggleSystemRole"
      class="text-6 ml-30px mr-auto color-[#24292f] dark:text-#c9d1d9"
      ><IconSystemRole
    /></el-icon>

    <div>
      <el-button
        class="sm-w-10 w-2 sm:ml-4 border-rd-1/2"
        type="danger"
        size="small"
        @click="onScreenshot"
        :loading="screenshotLoading"
        :disabled="generateLoading || !currentMessage?.history.length"
      >
        <el-icon class="text-3 sm:text-5" v-if="!screenshotLoading"><CameraFilled /></el-icon>
      </el-button>
      <el-button
        class="sm-w-10 w-2 ml-2 sm:ml-4 border-rd-1/2"
        type="success"
        size="small"
        @click="onShare"
        :disabled="generateLoading || !currentMessage?.history.length"
      >
        <el-icon class="text-3 sm:text-5"><IconShare /></el-icon>
      </el-button>
    </div>
    <el-drawer v-model="showPannel" size="85%" :with-header="false">
      <div class="w-full h-full flex">
        <MenuPannel />
        <PannelLeft class="flex-1" />
      </div>
    </el-drawer>
    <el-drawer direction="ltr" v-model="showSystemRole" size="80%" :with-header="false">
      <PromptStore
    /></el-drawer>
  </div>
</template>

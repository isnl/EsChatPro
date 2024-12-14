<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue'
import { useCopyCode } from '@/hooks/useCopyCode'
import usePageActive from '@/hooks/usePageActive'
import { MessageList, PromptStore } from './Sections'
import { LoginModal, MobileHeader, NoticeModal, MenuPannel, HeaderBar } from './components'
import { PannelLeft } from './PannelLeft'
import useIsMobile from '@/hooks/useIsMobile'

import { useLoginStore } from '@/stores/login'
import { useChatStore } from '@/stores/chat'
import { useNoticeStore } from '@/stores/notice'

useCopyCode()
usePageActive()

const { isMobile } = useIsMobile()
const loginStore = useLoginStore()
const chatStore = useChatStore()
const noticeStore = useNoticeStore()

onBeforeMount(() => {
  chatStore.init()
})
onMounted(() => {})
</script>

<template>
  <LoginModal />
  <main class="w-full h-full box-border bg-#f4f8fd dark:bg-dark flex" id="wrapper">
    <MenuPannel v-if="!isMobile && loginStore.isLogin" />

    <div class="flex-1 h-full p-0 flex flex-col sm:p-15px overflow-hidden">
      <HeaderBar v-if="noticeStore.noticeInfo && !isMobile && loginStore.isLogin" />
      <div class="w-full flex flex-1 overflow-hidden">
        <div
          v-if="loginStore.isLogin"
          class="bg-#fff w-80 lg-block hidden overflow-hidden border-rd-10px dark:bg-#333"
        >
          <PannelLeft />
        </div>
        <div class="w-full sm:w-auto flex-1 flex flex-col">
          <MobileHeader />
          <div class="flex-1 flex overflow-hidden">
            <PromptStore v-if="!isMobile" />
            <MessageList />
          </div>
        </div>
      </div>
    </div>
  </main>
  <NoticeModal />
</template>

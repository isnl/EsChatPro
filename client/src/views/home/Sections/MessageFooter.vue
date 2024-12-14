<script setup lang="ts">
import IconExpand from '@/components/icons/IconExpand.vue'
import IconShare from '@/components/icons/IconShare.vue'
import NormalTitle from '@/components/NormalTitle.vue'
import ModelPicker from '@/components/ModelPicker.vue'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { uuid } from '@/utils'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useScreenshotStore } from '@/stores/screenshot'
import useIsMobile from '@/hooks/useIsMobile'
import { onShare } from '@/hooks/useShare'
import useShortcutKeys from '@/hooks/useShortcutKeys'

useShortcutKeys()

const screenshotStore = useScreenshotStore()
const { onScreenshot } = screenshotStore
const { screenshotLoading, screenshotUrl, screenshotModalVisible } = storeToRefs(screenshotStore)

const chatStore = useChatStore()
const { isMobile } = useIsMobile()

const { cleanMessage, addMessage, generateAssistantMsg, setExpandInputDialogVisible } = chatStore
const { prompt, currentMessage, currentRecord, generateLoading, expandInputDialogVisible } =
  storeToRefs(chatStore)

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const keyword = ref('')
const keywordRef = ref<HTMLInputElement>()
const expandKeywordRef = ref<HTMLInputElement>()

const schemaDrawerVisible = ref(false)

/**
 * 发送消息
 */
const handleSendMsg = () => {
  if (!keyword.value || generateLoading.value) return
  addMessage({
    id: uuid(),
    content: keyword.value,
    role: 'user',
    time: moment().format('YYYY-MM-DD HH:mm:ss')
  })
  generateAssistantMsg(keyword.value)
  keyword.value = ''
}
const onKeyDown = (event: KeyboardEvent, expand?: boolean) => {
  if (event.shiftKey && event.key === 'Enter') {
  } else {
    if (event.key === 'Enter') {
      if (expand) {
        setExpandInputDialogVisible(false)
        keywordRef.value?.focus()
      }
      handleSendMsg()
      event.preventDefault() // 阻止浏览器默认的换行操作
      return false
    }
  }
}
const handleSchemaSendMsg = () => {
  if (generateLoading.value) return
  let content = ''
  // 每个schema映射里都有值的情况下
  if (currentRecord.value?.systemRole?.jsonSchema?.every((schema) => schema.value)) {
    currentRecord.value?.systemRole?.jsonSchema?.forEach((schema) => {
      content += `${schema.key}: ${schema.value}\n`
    })
  }
  addMessage({
    id: uuid(),
    content,
    role: 'user',
    time: moment().format('YYYY-MM-DD HH:mm:ss')
  })
  generateAssistantMsg(content)
  currentRecord.value?.systemRole?.jsonSchema?.forEach((schema) => (schema.value = ''))
  schemaDrawerVisible.value = false
}

watch(
  () => chatStore.prompt,
  () => {
    keyword.value = prompt.value
    keywordRef.value?.focus()
  }
)
const btnSize = computed(() => {
  return isMobile.value ? 'small' : 'large'
})
const onExpandIconClick = () => {
  setExpandInputDialogVisible(true)
}
const onExpandInputDialogOpened = () => {
  expandKeywordRef.value?.focus()
}
const onExpandInputDialogClose = () => {
  keywordRef.value?.focus()
}
const onToggleSchema = () => {
  schemaDrawerVisible.value = !schemaDrawerVisible.value
}
</script>

<template>
  <footer class="sm-p4 p-2 p-b-6 btl b-t-gray-100" :class="isMobile ? 'mobileFooter' : 'pcFooter'">
    <div class="w-full h-full max-w-screen-xl m-auto flex items-center">
      <el-button
        class="mr-2 sm:mr-4"
        type="danger"
        circle
        size="large"
        :disabled="generateLoading || !currentMessage?.history.length"
        @click="cleanMessage"
      >
        <el-icon><Delete /></el-icon>
      </el-button>
      <div class="flex-1 relative footerInput">
        <el-input
          ref="keywordRef"
          v-model="keyword"
          :placeholder="`说点什么吧......${
            isMobile ? '' : '( 1.Enter = 发送   2.Shift + Enter = 换行 )'
          }`"
          type="textarea"
          :autosize="{
            minRows: isMobile ? 1.5 : 1.7,
            maxRows: isMobile ? 1.5 : 1.7
          }"
          resize="none"
          :autofocus="true"
          :show-word-limit="isMobile ? false : true"
          :maxlength="userInfo.max_length || 1000"
          @keydown="onKeyDown"
        >
        </el-input>
        <el-tooltip content="展开" placement="top" v-if="!isMobile">
          <el-icon
            class="text-#777 absolute right-34 top-2 text-4 cursor-pointer"
            @click="onExpandIconClick"
          >
            <IconExpand />
          </el-icon>
        </el-tooltip>
        <el-button
          class="absolute right-1 sm:top-50% top-1 sm:mt--1.25rem sm-w-30 w-20 ml-2 sm:ml-4 sm:h-41px h-34px"
          :size="btnSize"
          type="primary"
          :disabled="!keyword || generateLoading"
          @click="handleSendMsg"
        >
          <el-icon class="text-4 sm:text-5"><Promotion /></el-icon>
        </el-button>
      </div>

      <el-button
        v-if="
          currentRecord?.systemRole &&
          currentRecord?.systemRole.isSchema &&
          currentRecord?.systemRole.jsonSchema?.length
        "
        class="sm-w-10 w-2 ml-2 sm:ml-4"
        type="warning"
        :size="btnSize"
        @click="onToggleSchema"
        :disabled="generateLoading"
      >
        <el-icon class="text-3 sm:text-5"><Cpu /></el-icon>
      </el-button>

      <!-- 移动端分享和截屏放上面 -->
      <template v-if="!isMobile">
        <el-tooltip content="链接分享" placement="top">
          <el-button
            class="sm-w-10 w-2 ml-2 sm:ml-4"
            type="success"
            :size="btnSize"
            @click="onShare"
            :disabled="generateLoading || !currentMessage?.history.length"
          >
            <el-icon class="text-3 sm:text-5"><IconShare /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="截图分享" placement="top">
          <el-button
            class="sm-w-10 w-2 sm:ml-4"
            type="danger"
            :size="btnSize"
            @click="onScreenshot"
            :loading="screenshotLoading"
            :disabled="generateLoading || !currentMessage?.history.length"
          >
            <el-icon class="text-3 sm:text-5" v-if="!screenshotLoading"><CameraFilled /></el-icon>
          </el-button>
        </el-tooltip>
      </template>
    </div>

    <el-dialog
      v-model="expandInputDialogVisible"
      @close="onExpandInputDialogClose"
      @opened="onExpandInputDialogOpened"
      title="展开编辑"
      width="60%"
      align-center
    >
      <el-input
        ref="expandKeywordRef"
        v-model="keyword"
        :placeholder="`说点什么吧......${
          isMobile ? '' : '( 1.Enter = 发送   2.Shift + Enter = 换行 )'
        }`"
        :rows="20"
        type="textarea"
        resize="none"
        :autofocus="true"
        :show-word-limit="true"
        :maxlength="userInfo.max_length || 1000"
        @keydown="(e) => onKeyDown(e, true)"
      >
      </el-input>
    </el-dialog>

    <el-drawer
      :close-on-click-modal="false"
      v-model="schemaDrawerVisible"
      title="Schema编辑"
      direction="rtl"
    >
      <el-alert
        :title="
          currentRecord?.systemRole?.description
            ? currentRecord?.systemRole?.description
            : currentRecord?.systemRole?.title
        "
        class="mb-20px"
        type="success"
        :closable="false"
      />
      <NormalTitle title="Schema可视化" class="mb-20px" />
      <div
        v-for="(schema, index) in currentRecord?.systemRole?.jsonSchema"
        :key="schema.key"
        class="w-full flex flex-col gap-10px my-10px"
      >
        <div class="flex items-center">
          <span>{{ schema.key }}（{{ schema.description }}）：</span>
        </div>
        <el-input placeholder="请输入" v-model="schema.value" />
      </div>
      <el-button class="w-full my-20px" type="primary" @click="handleSchemaSendMsg"
        ><el-icon class="text-3 sm:text-5 mr-5px"><Promotion /></el-icon>发送</el-button
      >
    </el-drawer>

    <el-dialog
      :title="isMobile ? '长按保存图片' : '右键复制或保存图片'"
      class="w-90% sm:w-80%"
      align-center
      v-model="screenshotModalVisible"
    >
      <el-scrollbar class="w-full fc h-120">
        <img :src="screenshotUrl" class="w-full h-auto" />
      </el-scrollbar>
    </el-dialog>
  </footer>
  <ModelPicker />
</template>
<style lang="less">
.pcFooter {
  .footerInput {
    .el-textarea__inner {
      padding-right: 12rem;
    }
    .el-textarea .el-input__count {
      right: 8rem;
    }
    .el-textarea__inner {
      padding-right: 12rem;
      // 隐藏滚动条
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .el-drawer__header {
    margin-bottom: 0;
  }
}
.mobileFooter {
  .el-textarea__inner {
    padding-right: 5.2rem;
  }
}
</style>

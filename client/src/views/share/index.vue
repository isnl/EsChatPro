<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { service } from '@/service'
import type { MessageHistory } from '@/stores/chat'
import { useClipboard, useTitle } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { ResponseText } from '@/components'

interface ShareInfo {
  title: string
  content: MessageHistory[]
}

const route = useRoute()
const router = useRouter()
const { copy } = useClipboard({ legacy: true })
const title = useTitle()
const { id } = route.params
const pwd = route.query.password

const err = ref(false)
const passwordModal = ref(false)
const password = ref(pwd ? (pwd as string) : '')
const inputRef = ref<HTMLInputElement>()
const verifyLoading = ref(false)
const shareInfo = ref<ShareInfo>()

const getShareInfo = async () => {
  try {
    const res: any = await service.get(`share/${id}`, {
      password: password.value ? password.value : ''
    })
    if (res.data) {
      passwordModal.value = false
      shareInfo.value = res.data
      title.value = res.data.title
    } else {
      if (password.value) {
        ElMessage.closeAll()
        ElMessage.error('密码错误')
      }
      passwordModal.value = true
    }
    verifyLoading.value = false
  } catch (error) {
    err.value = true
    verifyLoading.value = false
  }
}
const handleClose = () => {
  passwordModal.value = false
  password.value = ''
}
const onVerifyPassword = () => {
  verifyLoading.value = true
  getShareInfo()
}
const onOpen = () => {
  inputRef.value?.focus()
}
const onUserCopy = (content: string) => {
  copy(content)
  ElMessage.closeAll()
  ElMessage.success('复制成功')
}
const goHome = () => {
  router.push('/')
}
onBeforeMount(() => {
  getShareInfo()
})
</script>
<template>
  <main class="sm-w-280 w-full h-full mx-auto pb-20 relative overflow-hidden">
    <el-row class="flex justify-center">
      <el-col :sm="24" :lg="12" v-if="err">
        <el-result icon="error" title="404" sub-title="页面丢失啦，去首页看看吧">
          <template #extra>
            <el-button type="primary" @click="goHome">返回首页</el-button>
          </template>
        </el-result>
      </el-col>
    </el-row>
    <el-scrollbar height="100%" ref="scrollbarRef" class="flex-1" v-if="shareInfo">
      <div
        class="w-full max-w-screen-xl lg:p-x-4 sm:p-x-4 m-auto flex-1 p-y-4 p-x-3 flex flex-col justify-between"
        ref="innerRef"
      >
        <div class="flex flex-col flex-1">
          <div v-for="(item, index) in shareInfo.content" :key="index" class="relative">
            <div v-if="item.role === 'user'" class="flex m-b-6 overflow-hidden flex-row-reverse">
              <div class="ml-2 basis-10 flex-shrink-0 flex flex-col justify-between">
                <el-avatar class="text-xl flex items-center">Q</el-avatar>
                <el-icon
                  @click="onUserCopy(item.content)"
                  class="text-[#aaaaaa] cursor-pointer text-md hover:text-[#333] mb-1"
                  ><CopyDocument
                /></el-icon>
              </div>
              <div class="overflow-hidden flex flex-col items-end">
                <span class="text-xs text-[#b4bbc4] text-left">{{ item.time }}</span>
                <div class="flex flex-row-reverse">
                  <div
                    class="text-black text-wrap min-w-[20px] rounded-md p-3 bg-[#d2f9d1] dark:bg-[#2f2f32] mt-2"
                  >
                    <div
                      class="whitespace-pre-wrap text-sm text-[#2f2f32] dark-text-[#b4bbc4]"
                      v-html="item.content"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="item.role === 'assistant' || item.role === 'error'"
              class="flex m-b-6 overflow-hidden"
            >
              <div
                class="mr-2 basis-10 flex-shrink-0 flex flex-col justify-between items-end m-b-1"
              >
                <el-avatar class="text-xl flex items-center">A</el-avatar>
                <el-icon
                  @click="onUserCopy(item.content)"
                  class="text-[#aaaaaa] cursor-pointer text-md hover:text-[#333]"
                  ><CopyDocument
                /></el-icon>
              </div>
              <div class="overflow-hidden flex flex-col">
                <span class="text-xs text-[#b4bbc4] text-left">{{ item.time }}</span>
                <div class="flex">
                  <div
                    class="flex text-black text-wrap min-w-[20px] rounded-md p-3 bg-[#f4f6f8] dark:bg-[#2f2f32] mt-2"
                  >
                    <ResponseText class="flex-1" :text="item.content" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <el-dialog
      class="shareDialog w-80"
      v-model="passwordModal"
      align-center
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="访问密码验证"
      :before-close="handleClose"
      @opened="onOpen"
    >
      <div flex items-center>
        <el-input
          ref="inputRef"
          placeholder="请输入访问密码"
          maxlength="4"
          v-model="password"
          :autofocus="true"
          @keyup.enter="onVerifyPassword"
        ></el-input>
        <el-button class="flex-1" type="primary" @click="onVerifyPassword" :loading="verifyLoading"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <div
      v-if="shareInfo"
      class="w-full absolute left-0 bottom-0 flex justify-center items-center py-5 shadow-[0_-1px_10px_rgba(0,0,0,0.1)]"
    >
      <el-button class="w-60 h-10" type="primary" round @click="goHome">去首页</el-button>
    </div>
  </main>
</template>
<style>
.shareDialog .el-input {
  --el-input-border-radius: 4px 0 0 4px;
}
.shareDialog .el-button {
  --el-border-radius-base: 0 4px 4px 0;
}
</style>

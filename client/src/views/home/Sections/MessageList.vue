<script setup lang="ts">
import { ref, watch, onMounted, reactive } from 'vue'
import { ResponseText } from '@/components'
import { ElMessage, ElScrollbar } from 'element-plus'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { useDark, useClipboard } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { MessageFooter, CancelResponse, GuideList, ModelChangeButton } from './'

const chatStore = useChatStore()
const { copy } = useClipboard({ legacy: true })
const { deleteMessage, reGenerateAssistantMsg, reEditAssistantMsg } = chatStore

const isDark = useDark()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const { currentRecord, currentMessage } = storeToRefs(chatStore)

const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()


onMounted(() => {
  if (!innerRef.value) return
  scrollbarRef.value!.setScrollTop(innerRef.value.clientHeight)
})

watch(
  () => currentMessage.value?.history,
  (history) => {
    if (!innerRef.value) return
    scrollbarRef.value!.setScrollTop(innerRef.value.clientHeight)
  },
  { deep: true, flush: 'post' }
)

const onUserCopy = (content: string) => {
  copy(content)
  ElMessage.closeAll()
  ElMessage.success('复制成功')
}

const onCloseSystemRole = () => {
  chatStore.cleanCurrentSystemRole()
}
</script>

<template>
  <div class="flex flex-col flex-1 overflow-hidden relative bg-#fff border-rd-10px dark:bg-#333">
    <!-- 当有系统角色  但是对话内容为空的时候 -->
    <div
      class="w-full lg:p-x-4 sm:p-x-4 m-auto p-y-4 p-x-3"
      v-if="currentRecord?.systemRole && !chatStore.currentMessage?.history.length"
    >
      <el-alert
        :title="
          `System: ` +
          (currentRecord?.systemRole.description
            ? currentRecord?.systemRole.description
            : currentRecord?.systemRole.title)
        "
        type="success"
        :closable="false"
        @close="onCloseSystemRole"
      />
    </div>
    <el-scrollbar height="100%" ref="scrollbarRef" class="flex-1 h-full" view-class="min-h-full">
      <div
        class="w-full min-h-full max-w-screen-xl m-auto flex-1 flex flex-col justify-between"
        ref="innerRef"
      >
        <GuideList v-if="!chatStore.currentMessage?.history.length" />
        <div
          v-else
          id="msgList"
          class="min-h-full flex flex-col flex-1 bg-[#fff] dark:bg-#333 lg:p-x-4 sm:p-x-4 p-y-4 p-x-3"
        >
          <div class="w-full lg:p-x-4 sm:p-x-4 m-auto p-y-4 p-x-3" v-if="currentRecord?.systemRole">
            <el-alert
              :title="
                `System: ` +
                (currentRecord?.systemRole.description
                  ? currentRecord?.systemRole.description
                  : currentRecord?.systemRole.title)
              "
              type="success"
              :closable="false"
              @close="onCloseSystemRole"
            />
          </div>
          <div v-for="(item, index) in currentMessage?.history" :key="index" class="relative">
            <div v-if="item.role === 'user'" class="flex m-b-6 overflow-hidden flex-row-reverse">
              <div class="ml-2 basis-10 flex-shrink-0 flex flex-col justify-between">
                <el-avatar class="text-xl flex items-center">Q</el-avatar>
                <div class="flex text-md mb-1 d2image-ignore">
                  <el-icon
                    @click="onUserCopy(item.content)"
                    class="text-[#aaaaaa] cursor-pointer hover:text-[#333]"
                    ><CopyDocument
                  /></el-icon>
                  <el-icon
                    @click="reEditAssistantMsg(item, index)"
                    class="text-[#aaaaaa] cursor-pointer hover:text-[#333] ml-5px"
                    ><Edit
                  /></el-icon>
                </div>
              </div>
              <div class="overflow-hidden flex flex-col items-end">
                <span class="text-xs text-[#b4bbc4] text-left">{{ item.time }}</span>
                <div class="flex flex-row-reverse">
                  <div
                    class="text-black text-wrap min-w-[20px] rounded-md p-3 bg-[#d2f9d1] dark:bg-[#2f2f32] mt-2"
                  >
                    <div class="whitespace-pre-wrap text-sm text-[#2f2f32] dark-text-[#b4bbc4]">
                      {{ item.content }}
                    </div>
                  </div>
                  <!-- actions-最后一条user数据则显示重新获取数据的按钮 -->
                  <div class="flex flex-col gap-2 w-4 h-10 mr-3 mt-auto">
                    <el-icon
                      @click="reGenerateAssistantMsg(item, index)"
                      class="text-[#aaaaaa] cursor-pointer text-md hover:text-[#333] d2image-ignore"
                      ><RefreshRight
                    /></el-icon>
                    <el-icon
                      @click="deleteMessage(index)"
                      class="text-[#aaaaaa] cursor-pointer text-md hover:text-[#333] d2image-ignore"
                      ><Delete
                    /></el-icon>
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
                  class="text-[#aaaaaa] cursor-pointer text-md hover:text-[#333] d2image-ignore"
                  ><CopyDocument
                /></el-icon>
              </div>
              <div class="overflow-hidden flex flex-col">
                <span class="text-xs text-[#b4bbc4] text-left">{{ item.time }}</span>
                <div class="flex">
                  <div
                    class="flex text-black text-wrap min-w-[20px] rounded-md p-3 bg-[#f4f6f8] dark:bg-[#2f2f32] mt-2"
                  >
                    <ResponseText
                      class="flex-1"
                      :text="item.content"
                      :loading="!item.content ? true : false"
                    />
                  </div>
                  <div class="flex flex-col gap-2 w-4 h-10 ml-3 mt-auto">
                    <el-icon
                      @click="reGenerateAssistantMsg(item, index)"
                      class="text-[#aaaaaa] cursor-pointer text-md hover:text-[#333] d2image-ignore"
                      ><RefreshLeft
                    /></el-icon>
                    <el-icon
                      @click="deleteMessage(index)"
                      class="text-[#aaaaaa] cursor-pointer text-md hover:text-[#333] d2image-ignore"
                      ><Delete
                    /></el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <CancelResponse />
    <MessageFooter />
    <ModelChangeButton />
  </div>
</template>

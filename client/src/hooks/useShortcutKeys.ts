import { useActiveElement, useMagicKeys, whenever } from '@vueuse/core'
import { computed, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import { useModelStore } from '@/stores/model'
import { useScreenshotStore } from '@/stores/screenshot'
import { onShare } from '@/hooks/useShare'

export default function useShortcutKeys() {
  const keys = useMagicKeys()
  const chatStore = useChatStore()
  const modelStore = useModelStore()
  const screenshotStore = useScreenshotStore()
  const activeElement = useActiveElement()
  const notUsingInput = computed(
    () => activeElement.value?.tagName !== 'INPUT' && activeElement.value?.tagName !== 'TEXTAREA'
  )

  const { onScreenshot } = screenshotStore

  const { cleanMessage, setExpandInputDialogVisible } = chatStore
  const { currentMessage, generateLoading } = storeToRefs(chatStore)

  // 清空当前会话内容
  // const shiftD = keys['Shift+D']
  const shiftD = keys['Shift+D']
  watch(shiftD, (v) => {
    if (v && notUsingInput.value) {
      if (generateLoading.value || !currentMessage.value?.history.length) {
        return
      }
      cleanMessage()
    }
  })

  // 展开编辑
  const shiftF = keys['Shift+F']
  watch(shiftF, (v) => {
    if (v && notUsingInput.value) {
      setExpandInputDialogVisible(true)
    }
  })
  // 分享
  const shiftS = keys['Shift+S']
  watch(shiftS, (v) => {
    if (v && notUsingInput.value) {
      if (generateLoading.value || !currentMessage.value?.history.length) {
        return
      }
      onShare()
    }
  })

  // 截图分享
  const shiftI = keys['Shift+I']
  watch(shiftI, (v) => {
    if (v && notUsingInput.value) {
      onScreenshot()
    }
  })

  // 打开模型切换
  const shiftM = keys['Shift+M']
  watch(shiftM, (v) => {
    if (v && notUsingInput.value) {
      modelStore.setVisible(true)
    }
  })
}

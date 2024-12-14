import { onMounted, onUpdated, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { ElMessage } from 'element-plus'
/**
 * 复制文本
 * @param options
 */
export function copyText(options: { text: string; origin?: boolean }) {
  const props = { origin: true, ...options }

  let input: HTMLInputElement | HTMLTextAreaElement

  if (props.origin) input = document.createElement('textarea')
  else input = document.createElement('input')

  input.setAttribute('readonly', 'readonly')
  input.value = props.text
  document.body.appendChild(input)
  input.select()
  if (document.execCommand('copy')) document.execCommand('copy')
  document.body.removeChild(input)
}

export function useCopyCode() {
  function copyCodeBlock() {
    const codeBlockWrapper = document.querySelectorAll('.code-block-wrapper')
    codeBlockWrapper.forEach((wrapper) => {
      const copyBtn = wrapper.querySelector('.code-block-header__copy')
      const codeBlock = wrapper.querySelector('.code-block-body')
      if (copyBtn && codeBlock) {
        copyBtn.addEventListener('click', () => {
          if (navigator.clipboard?.writeText)
            navigator.clipboard.writeText(codeBlock.textContent ?? '')
          else copyText({ text: codeBlock.textContent ?? '', origin: true })
          // 复制成功提示
          ElMessage.closeAll()
          ElMessage.success('复制成功')
        })
      }
    })
  }

  const chatStore = useChatStore()
  onMounted(() => copyCodeBlock())

  onUpdated(() => copyCodeBlock())

  watch(
    () => chatStore.generateLoading,
    (val) => {
      if (!val) {
        copyCodeBlock()
      }
    }
  )
}

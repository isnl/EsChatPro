import { ref } from 'vue'

export default function useScreenshot() {
  const screenshotLoading = ref(false)
  const screenshotUrl = ref('')
  const screenshotModalVisible = ref(false)
  const onScreenshot = () => {
    screenshotLoading.value = true
    const el: any = document.getElementById('msgList')
    const width = el.clientWidth
    const height = el.clientHeight
    const filter = function (node: HTMLElement) {
      return !(node && node.classList && Array.from(node.classList).includes('d2image-ignore'))
    }
    // @ts-ignore
    domtoimage
      .toJpeg(el, {
        width,
        height,
        quality: 1,
        filter
      })
      .then(function (dataUrl: string) {
        screenshotUrl.value = dataUrl
        screenshotModalVisible.value = true
        screenshotLoading.value = false
      })
      .catch((err) => {
        screenshotLoading.value = false
      })
  }

  return {
    screenshotLoading,
    screenshotUrl,
    screenshotModalVisible,
    onScreenshot
  }
}

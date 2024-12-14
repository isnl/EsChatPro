import { defineStore } from 'pinia'

export const useScreenshotStore = defineStore('screenshotStore', {
  state: () => ({
    screenshotLoading: false,
    screenshotModalVisible: false,
    screenshotUrl: ''
  }),
  actions: {
    onScreenshot() {
      this.screenshotLoading = true
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
        .then((dataUrl: string) => {
          this.screenshotUrl = dataUrl
          this.screenshotModalVisible = true
          this.screenshotLoading = false
        })
        .catch((err) => {
          this.screenshotLoading = false
        })
    }
  }
})

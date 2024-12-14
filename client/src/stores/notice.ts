import { service } from '@/service'
import isEmpty from 'lodash/isEmpty'
import { defineStore } from 'pinia'

export interface Notice {
  _id: string
  title: string
  content: string
}
export const useNoticeStore = defineStore('noticeStore', {
  state: () => ({
    noticeInfo: {} as Notice,
    visible: false
  }),
  actions: {
    setVisible(val: boolean) {
      this.visible = val
    },
    setNotice(val: Notice) {
      this.noticeInfo = val
    },
    async getLatestNotice() {
      const res = await service.get('notice?latest=true')
      if (res.data) {
        if (isEmpty(this.noticeInfo) || this.noticeInfo?._id !== res.data._id) {
          this.visible = true
        }
        this.noticeInfo = res.data
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['noticeInfo'],
        storage: localStorage
      }
    ]
  }
})

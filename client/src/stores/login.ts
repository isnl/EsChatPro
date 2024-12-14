import { defineStore } from 'pinia'

export const useLoginStore = defineStore('loginStore', {
  state: () => ({
    visible: false,
    isLogin: false
  }),
  actions: {
    setVisible(val: boolean) {
      this.visible = val
    },
    setIsLogin(val: boolean) {
      this.isLogin = val
    }
  }
})

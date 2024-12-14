import { defineStore } from 'pinia'

export const useHomeStore = defineStore('homeStore', {
  state: () => ({
    menuExpand: true
  }),
  actions: {
    setMenuExpand(val: boolean) {
      this.menuExpand = val
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['menuExpand'],
        storage: localStorage
      }
    ]
  }
})

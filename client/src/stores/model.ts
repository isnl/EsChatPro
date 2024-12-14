import type { IModel } from '@/types'
import { defineStore } from 'pinia'
import isEmpty from 'lodash/isEmpty'

export const useModelStore = defineStore('modelStore', {
  state: () => ({
    modelList: [] as IModel[],
    currentModel: {} as IModel,
    visible: false
  }),
  actions: {
    setVisible(val: boolean) {
      this.visible = val
    },
    setModelList(list: IModel[]) {
      this.modelList = list
      if (isEmpty(this.currentModel)) {
        this.currentModel = list[0]
      } else {
        // 如果某个模型隐藏了，则默认选中第一个
        const modelInfo = this.modelList.find((item) => item._id === this.currentModel._id)
        if (!modelInfo) {
          this.currentModel = list[0]
        }
      }
    },
    setCurrentModel(val: IModel) {
      this.currentModel = val
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['modelList', 'currentModel'],
        storage: localStorage
      }
    ]
  }
})

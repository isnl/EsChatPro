import { defineStore } from 'pinia'
import { useRouterStore } from '@/stores/router'
import { useModelStore } from '@/stores/model'
import service from '@/service'
import pick from 'lodash/pick'
import omit from 'lodash/omit'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userInfo: {
      avatar: '',
      name: '',
      daily_limit: 0,
      current: 0,
      _id: ''
    } as UserInfo,
    vipDialogVisible: false
  }),
  actions: {
    async getUserInfo() {
      const res = await service.get('user')
      const { modelList } = pick(res.data, 'modelList')
      const modelStore = useModelStore()
      modelStore.setModelList(modelList)
      this.userInfo = omit(res.data, 'modelList') as UserInfo
      if (this.isAdministrators) {
        const routerStore = useRouterStore()
        await routerStore.addRoutes()
      }
      return this.isAdministrators
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    setVipDialogVisible(visible: boolean) {
      this.vipDialogVisible = visible
    }
  },
  getters: {
    isVip: (state) => state.userInfo.vipInfo,
    isAdministrators: (state) => state.userInfo.role === 1
  }
})
export interface UserInfo {
  avatar: string
  name: string
  daily_limit: number
  current: number
  max_length?: number
  remark?: string
  role?: number
  _id: string
  openId: string
  vipInfo?: {
    startTime: string
    endTime: string
  }
}

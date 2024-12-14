import { defineStore } from 'pinia'
import moment from 'moment'
import type { SystemRoleItem } from '@/types'
import { isDev, randomString, uuid } from '@/utils'
import { useTokenStore } from '@/stores/token'
import { useUserStore } from '@/stores/user'
import { useModelStore } from '@/stores/model'
import { ElMessage } from 'element-plus'
import { BASE_URL } from '@/service/axios'

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    version: 0,
    chatInfo: {
      messages: [],
      record: [],
      active: null
    } as ChatInfo,
    generateLoading: false,
    abortController: null as AbortController | null,
    prompt: '',
    expandInputDialogVisible: false,
    roleTabKey: 'PlatformRole'
  }),
  actions: {
    setRoleTabKey(key: 'PlatformRole' | 'upload' | 'diy') {
      this.roleTabKey = key
    },
    /**
     * 初始化
     */
    init() {
      if (!this.chatInfo.active) {
        this.addRecord()
      }
    },
    setActive(id: string) {
      this.chatInfo.active = id
    },
    addRecord(name?: string) {
      const id = uuid()
      this.chatInfo.active = id
      const str = randomString(6)
      this.chatInfo.record.push({
        id,
        name: name ? name : str + '-新对话'
      })
      this.chatInfo.messages.push({
        id,
        history: []
      })
    },
    deleteRecord(id: string) {
      const recordIndex = this.chatInfo.record.findIndex((item) => item.id === id)
      this.chatInfo.record.splice(recordIndex, 1)
      const messageIndex = this.chatInfo.messages.findIndex((item) => item.id === id)
      this.chatInfo.messages.splice(messageIndex, 1)
      this.chatInfo.active = this.chatInfo.record[0]?.id || null
    },
    updateRecord(id: string, name: string) {
      const index = this.chatInfo.record.findIndex((item) => item.id === id)
      this.chatInfo.record[index].name = name
    },
    /**
     * 系统角色内容更新后，同步更新对话记录中的数据
     * @param systemRole
     */
    updateRecordList(systemRole: SystemRoleItem) {
      this.chatInfo.record = this.chatInfo.record.map((item) => {
        if (item.systemRole && item.systemRole._id === systemRole._id) {
          return { ...item, systemRole }
        } else {
          return { ...item }
        }
      })
    },
    deleteRecordBySystemRoleId(systemRoleId: number | string) {
      this.chatInfo.record.forEach((item) => {
        if (item.systemRole && item.systemRole._id === systemRoleId) {
          delete item.systemRole
        }
      })
    },
    getCurrentMessage() {
      const { active, messages } = this.chatInfo
      return messages.find((item) => item.id === active)
    },
    addMessage(message: MessageHistory) {
      const currentMessage = this.getCurrentMessage()
      if (currentMessage) {
        // 默认以第一条用户消息命名record  长度限制30
        if (!currentMessage.history.length && !this.currentRecord?.systemRole) {
          this.currentRecord!.name = message.content.substring(0, 30)
        }
        currentMessage.history.push(message)
      }
    },
    updateMessage(params: UpdateItem) {
      const { id, word, parentMessageId, role, time } = params
      const currentMessage = this.getCurrentMessage()
      let msgInfo = currentMessage?.history.find((item) => item.id === id)
      if (msgInfo) {
        msgInfo.content += word
        msgInfo.role = role || msgInfo.role
        msgInfo.time = time || msgInfo.time
        if (parentMessageId) {
          msgInfo.parentMessageId = parentMessageId
        }
      }
    },
    getParentMessageId() {
      const currentMessage = this.getCurrentMessage()
      const msg = JSON.parse(JSON.stringify(currentMessage?.history))
        .reverse()
        .find((item: MessageHistory) => item.role === 'assistant')
      if (msg) {
        return { parentMessageId: msg.parentMessageId }
      } else {
        return {}
      }
    },
    getSystemMessageInfo() {
      if (this.currentRecord?.systemRole) {
        return {
          systemMessage: this.currentRecord?.systemRole._id
        }
      } else {
        return {}
      }
    },
    cleanMessage() {
      const currentMessage = this.getCurrentMessage()
      currentMessage!.history = []
    },
    setGenerateLoading(value: boolean) {
      this.generateLoading = value
    },
    async generateAssistantMsg(keyword: string) {
      const tokenStore = useTokenStore()
      const userStore = useUserStore()
      const modelStore = useModelStore()
      const chatURL = `${BASE_URL}chat`
      const id = uuid()
      const parentMessageInfo = this.getParentMessageId()
      const systemMessageInfo = this.getSystemMessageInfo()

      try {
        this.abortController = new AbortController()
        this.setGenerateLoading(true)
        this.addMessage({
          id,
          keyword,
          content: '',
          role: 'assistant',
          time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        const response = await fetch(chatURL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenStore.token}`
          },
          method: 'POST',
          body: JSON.stringify({
            message: keyword,
            ...parentMessageInfo,
            ...systemMessageInfo,
            modelId: modelStore.currentModel._id
          }),
          signal: this.abortController.signal
        })
        if (!response.ok) {
          const res = await response.json()
          if (res.code === 10002) {
            const str = `今日服务调用次数已达上限，成为会员立享如下特权：\n\n每日99次调用额度及 10,000 字超长文本输入上限、自定义角色等\n\n[获取免费会员](https://mp.weixin.qq.com/s/bTYYcRcxHgIsaGfvLQV6Eg)`
            throw new Error(str)
          } else {
            throw new Error(
              (res.message || 'Error') +
                '\n\n如遇当前模型错误，请在页面下方点击切换模型按钮，我们提供多个模型供您选择！'
            )
          }
        }
        const data = response.body
        if (!data) throw new Error('No data')

        const reader = data.getReader()
        const decoder = new TextDecoder('utf-8')
        let done = false

        while (!done) {
          const { value, done: readerDone } = await reader.read()
          if (value) {
            const char = await decoder.decode(value)
            try {
              const list = char.split('\n').filter((item) => item)
              list.forEach((item) => {
                const obj = JSON.parse(item)
                this.updateMessage({
                  id,
                  word: obj.delta,
                  parentMessageId: obj.id
                })
              })
            } catch (error: any) {
              console.log('error:', error.message)
            }
          }
          done = readerDone
        }
        userStore.getUserInfo()
        this.setGenerateLoading(false)
      } catch (error: any) {
        if (error['name'] === 'AbortError') return
        this.updateMessage({
          id,
          word: error.message,
          role: 'error',
          time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        userStore.getUserInfo()
        this.setGenerateLoading(false)
      }
    },
    /**
     * 重新生成的时候，如果当前MessageHistory中无keyword(兼容旧数据)，则获取上面的user的keyword
     */
    getPrevKeyword() {
      const currentMessage = this.getCurrentMessage()
      const msg = JSON.parse(JSON.stringify(currentMessage?.history))
        .reverse()
        .find((item: MessageHistory) => item.role === 'user')
      if (msg) {
        return msg.content
      } else {
        return ''
      }
    },
    /**
     * 重新生成
     * @param item
     * @param index
     */
    reGenerateAssistantMsg(item: MessageHistory, index: number) {
      const currentMessage = this.getCurrentMessage()
      if (item.role === 'user') {
        currentMessage!.history = currentMessage!.history.slice(0, index + 1)
        this.generateAssistantMsg(item.content)
      } else {
        currentMessage!.history = currentMessage!.history.slice(0, index)
        const { keyword } = item
        if (keyword) {
          this.generateAssistantMsg(keyword)
        } else {
          this.generateAssistantMsg(this.getPrevKeyword())
        }
      }
    },
    /**
     * 重新编辑当前用户消息
     */
    reEditAssistantMsg(item: MessageHistory, index: number) {
      this.setPrompt(item.content!)
      const currentMessage = this.getCurrentMessage()
      currentMessage!.history = currentMessage!.history.slice(0, index)
    },
    /**
     * 删除message
     * 如果有systemRole，只删除当前index对应的数据
     * @param index
     */
    deleteMessage(index: number) {
      const currentMessage = this.getCurrentMessage()
      if (this.currentRecord?.systemRole) {
        currentMessage!.history.splice(index, 1)
      } else {
        currentMessage!.history = currentMessage!.history.slice(0, index)
      }
    },
    // 停止响应
    abort() {
      this.abortController?.abort()
      this.setGenerateLoading(false)
      this.abortController = null
      const userStore = useUserStore()
      userStore.getUserInfo()
    },
    setPrompt(value: string) {
      this.prompt = value
    },
    /**
     * 新建会话，并设置系统角色
     * @param systemRole
     */
    setSystemRole(systemRole: SystemRoleItem) {
      const { title } = systemRole
      this.addRecord(`System - ${title}`)
      this.currentRecord!.systemRole = systemRole
    },
    cleanCurrentSystemRole() {
      delete this.currentRecord!.systemRole
    },
    /**
     * 设置同步数据
     */
    setSyncData({ version, chatInfo }: { version: number; chatInfo: ChatInfo }) {
      if (version > this.version) {
        this.version = version
        this.chatInfo = chatInfo
        const timeFormat = moment(version).format('YYYY-MM-DD HH:mm:ss')
        ElMessage.success('数据同步成功，同步时间为：' + timeFormat)
      } else if (this.version > version) {
        const timeFormat = moment(this.version).format('YYYY-MM-DD HH:mm:ss')
        ElMessage.warning('同步失败，当前版本已为较高版本：' + timeFormat)
      }
    },
    setExpandInputDialogVisible(visible: boolean) {
      this.expandInputDialogVisible = visible
    }
  },
  getters: {
    currentMessage: (state) => {
      return state.chatInfo.messages.find((item) => item.id === state.chatInfo.active)
    },
    currentRecord: (state) => {
      return state.chatInfo.record.find((item) => item.id === state.chatInfo.active)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['chatInfo', 'version', 'roleTabKey'],
        storage: localStorage
      }
    ]
  }
})

export interface MessageItem {
  id: string
  history: MessageHistory[]
}

export interface MessageHistory {
  id: string
  parentMessageId?: string
  keyword?: string
  role: 'user' | 'assistant' | 'error'
  time: string
  content: string
}

export interface RecordItem {
  id: string
  name: string
  systemRole?: SystemRoleItem
}

export interface UpdateItem {
  id: string
  parentMessageId?: string
  keyword?: string
  word: string
  role?: 'user' | 'assistant' | 'error'
  time?: string
}

export interface ChatInfo {
  messages: MessageItem[]
  record: RecordItem[]
  active: string | null
}

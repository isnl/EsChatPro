import service from '@/service'
import type { SystemRoleItem } from '@/types'
import { useChatStore } from '@/stores/chat'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'

export const useSystemRoleHooks = (url: string) => {
  const chatStore = useChatStore()
  const { currentRecord } = storeToRefs(chatStore)
  const keyword = ref('')

  const systemRoleList = ref<SystemRoleItem[]>([])
  const filterRoleList = ref<SystemRoleItem[]>([])

  const formVisible = ref(false)
  const editInfo = ref<SystemRoleItem>({} as SystemRoleItem)

  onBeforeMount(() => {
    getList()
  })

  const onSelect = (value: SystemRoleItem) => {
    if (value._id === currentRecord?.value!.systemRole?._id) return
    const existInfo = chatStore.chatInfo.record.find((item) => item.systemRole?._id === value._id)
    const message = existInfo
      ? `已经有 ${value.title} 角色的对话记录，是否切换到对话记录？`
      : `是否以 ${value.title} 的角色创建新的对话记录？`
    ElMessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      if (chatStore.generateLoading) return
      if (existInfo) {
        chatStore.setActive(existInfo.id)
      } else {
        chatStore.setSystemRole(value)
      }
    })
  }

  const getList = async () => {
    const res = await service.get(url)
    systemRoleList.value = res.data
    filterRoleList.value = res.data
  }
  const onSearch = (value: string) => {
    filterRoleList.value = systemRoleList.value.filter((item) => item.title.includes(value))
  }
  const onCreateSystemRole = () => {
    editInfo.value = {} as SystemRoleItem
    formVisible.value = true
  }
  const onUpdated = async (systemRole?: SystemRoleItem) => {
    await getList()
    if (systemRole) {
      chatStore.updateRecordList(systemRole)
    }
    onSearch(keyword.value)
  }
  const onEditRole = (e: Event, item: SystemRoleItem) => {
    e.stopPropagation()
    editInfo.value = item
    formVisible.value = true
  }
  const deleteRole = async (id: number) => {
    await service.delete(`system_role/${id}`)
    ElMessage.success('删除成功')
    await getList()
    chatStore.deleteRecordBySystemRoleId(id)
  }

  return {
    keyword,
    filterRoleList,
    currentRecord,
    formVisible,
    editInfo,
    onSelect,
    onSearch,
    onCreateSystemRole,
    onUpdated,
    onEditRole,
    deleteRole
  }
}

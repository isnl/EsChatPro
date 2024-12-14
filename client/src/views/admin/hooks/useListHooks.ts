import service from '@/service'
import { ElMessage } from 'element-plus'
import { onBeforeMount, ref, watch } from 'vue'
interface Options {
  url: string
  deleteUrl?: string
  // formParams是键值对
  formParams?: any
  isGetDataOnBeforeMount?: boolean // 是否在onBeforeMount生命周期获取数据, 默认值为true
}
export function useListHooks<T>({
  url,
  deleteUrl,
  formParams,
  isGetDataOnBeforeMount = true
}: Options) {
  const listLoading = ref(false)
  const list = ref<T[]>([])
  const total = ref(0)
  const params = ref(formParams ? formParams : {})

  const getList = async () => {
    listLoading.value = true
    const res = await service.get(url, { ...params.value })
    list.value = res.data.list
    total.value = res.data.total
    listLoading.value = false
  }

  const onPageChange = (page: number) => {
    setParams({ ...params.value, page })
  }

  const onDeleteRecord = async (id: string) => {
    await service.delete(`${deleteUrl}/${id}`)
    ElMessage.success('删除成功')
    getList()
  }

  const setParams = (p: any, autoSearch = true) => {
    params.value = p
    if (autoSearch) {
      getList()
    }
  }

  onBeforeMount(() => {
    if (isGetDataOnBeforeMount) {
      getList()
    }
  })

  return {
    listLoading,
    list,
    total,
    params,
    setParams,
    onDeleteRecord,
    onPageChange,
    getList
  }
}

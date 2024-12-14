<script lang="ts" setup>
import { ref } from 'vue'
import { useListHooks } from '../hooks/useListHooks'
import FormDialog from './FormDialog.vue'
import { service } from '@/service'
import { ElMessage } from 'element-plus'
export interface IModel {
  _id: string
  name: string
  model: string
  description: string
  usageCount: number
  sort: number
  isBetter: boolean
  apiKey: string
  apiBaseUrl: string
}

const { listLoading, list, getList, onDeleteRecord } = useListHooks<IModel>({
  url: 'admin/model',
  deleteUrl: 'admin/model',
  formParams: {}
})

const editInfo = ref<IModel>({} as IModel)
const formDialogVisible = ref(false)
const onEdit = (row: IModel) => {
  editInfo.value = row
  formDialogVisible.value = true
}
const onOpenCreate = () => {
  editInfo.value = {} as IModel
  formDialogVisible.value = true
}
const onChangeEnable = (val: boolean, id: string) => {
  service.put(`admin/model/${id}`, { enable: val }).then((res) => {
    ElMessage.success('修改成功')
    getList()
  })
}
</script>
<template>
  <div>
    <div class="w-full flex items-center py-2 sm:flex-row flex-col">
      <div class="">
        <el-button type="primary" @click="onOpenCreate">新建模型</el-button>
      </div>
    </div>
    <el-table :data="list" class="w-full min-h-60" :loading="listLoading">
      <el-table-column prop="name" label="模型名称" width="180" />
      <el-table-column prop="model" label="模型" width="150" />
      <el-table-column prop="description" label="描述" width="300">
        <template #default="{ row }">
          <div class="ellipsis">{{ row.description }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="usageCount" label="调用量" width="80" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="isBetter" label="是否推荐" width="100">
        <template #default="{ row }">
          <div class="ellipsis" :class="row.isBetter ? 'text-green-500' : 'text-red-500'">
            {{ row.isBetter ? '推荐' : '' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="apiKey" label="apiKey">
        <template #default="{ row }">
          <div class="ellipsis">{{ row.apiKey }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="apiBaseUrl" label="apiBaseUrl">
        <template #default="{ row }">
          <div class="ellipsis">{{ row.apiBaseUrl }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="enable" width="120">
        <template #default="{ row }">
          <el-switch
            :model-value="row.enable"
            @change="(val) => onChangeEnable(val, row._id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
          <el-popconfirm
            title="删除后不可恢复，确定删除吗?"
            :width="200"
            @confirm="onDeleteRecord(row._id)"
            confirm-button-type="danger"
            confirm-button-text="确定"
            cancel-button-text="取消"
          >
            <template #reference>
              <el-button link type="danger" size="small"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <FormDialog v-model="formDialogVisible" :editInfo="editInfo" @onCreatedOrUpdated="getList" />
</template>

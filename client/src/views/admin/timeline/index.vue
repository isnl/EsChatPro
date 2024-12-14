<script lang="ts" setup>
import { ref } from 'vue'
import { useListHooks } from '../hooks/useListHooks'
import FormDialog from './FormDialog.vue'
interface TimelineInfo {
  _id: string
  content: string
  time: string
}
const { listLoading, list, getList, onDeleteRecord } = useListHooks<TimelineInfo>({
  url: 'timeline',
  deleteUrl: 'admin/timeline',
  formParams: {
    size: 999
  }
})

const editInfo = ref<TimelineInfo>({} as TimelineInfo)
const formDialogVisible = ref(false)
const onEdit = (row: TimelineInfo) => {
  editInfo.value = row
  formDialogVisible.value = true
}
const onOpenCreate = () => {
  editInfo.value = {} as TimelineInfo
  formDialogVisible.value = true
}
</script>
<template>
  <div>
    <div class="w-full flex items-center py-2 sm:flex-row flex-col">
      <div class="">
        <el-button type="primary" @click="onOpenCreate">新建更新记录</el-button>
      </div>
    </div>
    <el-table :data="list" class="w-full min-h-60" :loading="listLoading">
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="time" label="日期" width="200">
        <template #default="{ row }">
          <div class="ellipsis">{{ row.time }}</div>
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

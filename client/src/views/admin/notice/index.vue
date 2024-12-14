<script lang="ts" setup>
import { ref } from 'vue'
import { useListHooks } from '../hooks/useListHooks'
import FormDialog from './FormDialog.vue'
import IconVip from '@/components/icons/IconVip.vue'
import { copy } from '@/hooks/useCopy'
import moment from 'moment'
import { ElMessageBox } from 'element-plus'
interface NoticeInfo {
  _id: string
  title: string
  content: string
  createdAt: string
}
const { listLoading, list, total, getList, onPageChange } = useListHooks<NoticeInfo>({
  url: 'notice',
  formParams: {}
})

const editInfo = ref<NoticeInfo>({} as NoticeInfo)
const formDialogVisible = ref(false)
const onEdit = (row: NoticeInfo) => {
  editInfo.value = row
  formDialogVisible.value = true
}
const onPreview = (row: NoticeInfo) => {
  ElMessageBox.alert(row.content, row.title, {
    dangerouslyUseHTMLString: true,
    showConfirmButton: false,
    customClass: 'w-160 max-w-none'
  })
}
const onOpenCreate = () => {
  editInfo.value = {} as NoticeInfo
  formDialogVisible.value = true
}
const onCreatedOrUpdated = () => {
  getList()
}
</script>
<template>
  <div>
    <div class="w-full flex items-center py-2 sm:flex-row flex-col">
      <div class="">
        <el-button type="primary" @click="onOpenCreate">新建公告</el-button>
      </div>
    </div>
    <el-table :data="list" class="w-full min-h-60" :loading="listLoading">
      <el-table-column prop="title" label="标题" width="300" />
      <el-table-column prop="content" label="内容">
        <template #default="{ row }">
          <div class="ellipsis">{{ row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="200">
        <template #default="{ row }">
          <div class="ellipsis">{{ moment(row.createdAt).format('YYYY-MM-DD HH:mm') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="onPreview(row)">预览</el-button>
          <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="py-4 flex justify-end">
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="onPageChange"
      />
    </div>
  </div>

  <FormDialog
    v-model="formDialogVisible"
    :editInfo="editInfo"
    @onCreatedOrUpdated="onCreatedOrUpdated"
  />
</template>

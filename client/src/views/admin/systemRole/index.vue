<script lang="ts" setup>
import { useListHooks } from '../hooks/useListHooks'
import { getStatusTip } from '@/utils'
import moment from 'moment'
import { ElMessageBox } from 'element-plus'
const { listLoading, list, total, onPageChange } = useListHooks({
  url: 'admin/system_role',
  formParams: {}
})
const onEdit = (id: string) => {}
const onPreview = (row) => {
  ElMessageBox.alert(row.content, row.title, {
    dangerouslyUseHTMLString: true,
    showConfirmButton: false,
    customClass: 'w-160 max-w-none'
  })
}
</script>
<template>
  <div>
    <div class="w-full flex items-center py-2 sm:flex-row flex-col"></div>
    <el-table :data="list" class="w-full min-h-60" :loading="listLoading">
      <el-table-column prop="title" label="标题" width="300" />
      <el-table-column prop="content" label="内容">
        <template #default="{ row }">
          <div class="ellipsis">{{ row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="150">
        <template #default="{ row }">
          {{ moment(row.createdAt).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="usageCount" label="调用总量" width="100" />
      <el-table-column prop="status" label="状态" width="150">
        <template #default="{ row }">
          <el-text :type="getStatusTip(row.status).color">
            {{ getStatusTip(row.status).text }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="onPreview(row)">预览</el-button>
          <el-button link type="primary" size="small" @click="onEdit(row.openId)">编辑</el-button>
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
</template>

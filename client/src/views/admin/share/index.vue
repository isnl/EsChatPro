<script lang="ts" setup>
import { ref } from 'vue'
import { useListHooks } from '../hooks/useListHooks'
import moment from 'moment'
import FormDialog from './FormDialog.vue'
import { getStatusMap, getStatusTip, isDev } from '@/utils'
import { BASE_URL } from '@/service/axios'

export interface ShareInfo {
  _id?: string
  title: string
  status: number
  type: string
  tag: string
  create_time: string
}

const { listLoading, list, total, params, setParams, getList, onPageChange } =
  useListHooks<ShareInfo>({
    url: 'admin/share',
    formParams: {
      status: 2
    }
  })

const statusMap = getStatusMap()

const formDialogVisible = ref(false)
const editInfo = ref<ShareInfo>({} as ShareInfo)

const onExamine = (row: ShareInfo) => {}
const onEdit = (row: ShareInfo) => {
  editInfo.value = row
  formDialogVisible.value = true
}
const onChangeStatus = (value: number) => {
  setParams({ status: value })
}

const onStatusEdited = () => {
  getList()
}
const locationOrigin = location.origin
</script>
<template>
  <div>
    <div class="w-full flex items-center py-2 sm:flex-row flex-col">
      <div class="w-full sm:w-auto mb-2 sm:mb-0">
        <span>分享状态：</span>
        <el-select
          v-model="params.status"
          placeholder="请选择分享状态"
          clearable
          @change="onChangeStatus"
        >
          <el-option
            :key="item.value"
            :value="item.value"
            :label="item.label"
            v-for="item in statusMap"
          />
        </el-select>
      </div>
    </div>
    <el-table :data="list" class="w-full min-h-60" :loading="listLoading">
      <el-table-column prop="title" label="标题" width="300">
        <template #default="{ row }">
          <el-link
            target="_blank"
            type="primary"
            size="small"
            :href="`${BASE_URL}shareStatic/${row._id}.html`"
            class="ellipsis"
            v-if="row.status === 2"
            >{{ row.title }}</el-link
          >
          <el-link
            v-else
            target="_blank"
            type="primary"
            size="small"
            :href="`${locationOrigin}/#/share/${row._id}?password=${row.password}`"
            class="ellipsis"
            >{{ row.title }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间">
        <template #default="{ row }">
          {{ moment(row.create_time).format('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="分类"></el-table-column>
      <el-table-column prop="tag" label="标签"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-text :type="getStatusTip(row.status).color">
            {{ getStatusTip(row.status).text }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <template v-if="row.status === 1">
            <el-link type="primary" size="small" @click="onEdit(row)">审核</el-link>
            <el-divider direction="vertical" />
          </template>
          <el-link
            target="_blank"
            type="primary"
            size="small"
            :href="`${locationOrigin}/#/share/${row._id}?password=${row.password}`"
            >预览</el-link
          >
          <el-divider direction="vertical" />
          <el-link type="primary" size="small" @click="onEdit(row)">编辑</el-link>
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
    @onCreatedOrUpdated="onStatusEdited"
  />
</template>

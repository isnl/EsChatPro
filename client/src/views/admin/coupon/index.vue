<script lang="ts" setup>
import { ref, watch } from 'vue'
import moment from 'moment'
import { useListHooks } from '../hooks/useListHooks'
import UserInfoDialog from '../user/UserInfoDialog.vue'
import FormDialog from './FormDialog.vue'
import useIsMobile from '@/hooks/useIsMobile'
import { copy } from '@/hooks/useCopy'

const { list, total, setParams, onPageChange, getList } = useListHooks({
  url: 'admin/coupon'
})
const { isMobile } = useIsMobile()

const COUPON_TYPE = [1, 3, 7, 30, 90, 180, 365]
const userId = ref('')
const userInfoVisible = ref(false)
const formDialogVisible = ref(false)

const couponType = ref()
const couponStatus = ref()
const remark = ref('')

const openUserInfo = (id: string) => {
  userId.value = id
  userInfoVisible.value = true
}

watch([() => couponType.value, () => couponStatus.value, () => remark.value], () => {
  const params = {
    type: couponType.value ? couponType.value : undefined,
    isUsed: couponStatus.value ? couponStatus.value === 'used' : undefined,
    remark: remark.value ? remark.value : undefined
  }
  setParams({ ...params })
})
const onOpenCreate = () => {
  formDialogVisible.value = true
}
const onCouponCreated = () => {
  formDialogVisible.value = false
  getList()
}
const onCopyCode = (code: string) => {
  copy(code)
}
</script>
<template>
  <div>
    <div class="w-full flex items-center py-2 sm:flex-row flex-col">
      <div class="w-full sm:w-auto mb-2 sm:mb-0">
        <span>卡密类型：</span>
        <el-select v-model="couponType" placeholder="请选择卡密类型" clearable>
          <el-option v-for="item in COUPON_TYPE" :key="item" :label="item + '天'" :value="item" />
        </el-select>
      </div>
      <div class="sm:ml-6 w-full sm:w-auto mb-2 sm:mb-0">
        <span>卡密状态：</span>
        <el-select v-model="couponStatus" placeholder="请选择卡密状态" clearable>
          <el-option key="notUsed" label="未使用" value="notUsed" />
          <el-option key="used" label="已使用" value="used" />
        </el-select>
      </div>
      <div class="flex items-center ml-6 w-full sm:w-auto mb-2 sm:mb-0">
        <span class="whitespace-nowrap">备注：</span>
        <el-input placeholder="请输入备注" v-model="remark"></el-input>
      </div>
      <div class="ml-10">
        <el-button type="primary" @click="onOpenCreate">批量生成卡密</el-button>
      </div>
    </div>
    <el-table :data="list" class="w-full min-h-60">
      <el-table-column prop="code" label="卡密">
        <template #default="{ row }">
          <el-link type="primary" @click="onCopyCode(row.code)">
            {{ row.code }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="{ row }"> {{ row.type }}天 </template>
      </el-table-column>
      <el-table-column prop="openId" label="状态" width="80px">
        <template #default="{ row }">
          <el-link target="_blank" type="danger" v-if="row.openId"> 已使用 </el-link>
          <span v-else>未使用</span>
        </template>
      </el-table-column>
      <el-table-column prop="openId" label="用户ID" width="300px">
        <template #default="{ row }">
          <div class="flex items-center" v-if="row.openId">
            <el-link target="_blank" type="success" @click="openUserInfo(row.openId)">
              {{ row.openId }}
            </el-link>
            <el-icon
              @click="copy(row.openId)"
              class="ml-2 text-[#aaaaaa] cursor-pointer text-md hover:text-[#333]"
              ><CopyDocument
            /></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createAt" label="创建时间" v-if="!isMobile">
        <template #default="{ row }">
          {{ moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="updateAt" label="使用时间" v-if="!isMobile">
        <template #default="{ row }">
          <span v-if="row.openId">
            {{ moment(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template #default="{ row }">
          {{ row.remark }}
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

  <FormDialog v-model="formDialogVisible" @onCreated="onCouponCreated" />

  <UserInfoDialog v-model="userInfoVisible" :userId="userId" />
</template>

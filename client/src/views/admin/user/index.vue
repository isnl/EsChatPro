<script lang="ts" setup>
import { ref } from 'vue'
import { useListHooks } from '../hooks/useListHooks'
import IconVip from '@/components/icons/IconVip.vue'
import UserInfoDialog from './UserInfoDialog.vue'
import OpenVipDialog from './OpenVipDialog.vue'
import { copy } from '@/hooks/useCopy'
import moment from 'moment'
const { listLoading, list, total, params, setParams, getList, onPageChange } = useListHooks({
  url: 'admin/user',
  formParams: {
    name: '',
    remark: '',
    openId: ''
  }
})

const userId = ref('')
const userInfoVisible = ref(false)
const openVipVisible = ref(false)
const openUserInfo = (id: string) => {
  userId.value = id
  userInfoVisible.value = true
}
const onOpenVipDialog = (id: string) => {
  userId.value = id
  openVipVisible.value = true
}

const onCouponUsed = () => {
  openVipVisible.value = false
  getList()
}
const onChange = (key: string, value: string) => {
  setParams({ ...params.value, [key]: value }, false)
}
const resetForm = () => {
  setParams({
    name: '',
    remark: ''
  })
}
</script>
<template>
  <div>
    <div class="w-full flex items-center py-2">
      <div class="flex items-center">
        <span class="whitespace-nowrap">昵称：</span>
        <el-input
          placeholder="请输入昵称"
          :model-value="params.name"
          @keyup.enter="getList"
          @input="(val: string) => onChange('name', val)"
        />
      </div>
      <div class="flex items-center ml-6">
        <span class="whitespace-nowrap">备注：</span>
        <el-input
          placeholder="请输入备注"
          :model-value="params.remark"
          @keyup.enter="getList"
          @input="(val: string) => onChange('remark', val)"
        />
      </div>
      <div class="flex items-center ml-6">
        <span class="whitespace-nowrap">openId：</span>
        <el-input
          placeholder="请输入openId"
          :model-value="params.openId"
          @keyup.enter="getList"
          @input="(val: string) => onChange('openId', val)"
        />
      </div>
      <div class="flex items-center ml-6">
        <el-button type="default" @click="resetForm">重置</el-button>
      </div>
    </div>
    <el-table :data="list" class="w-full min-h-60" :loading="listLoading">
      <el-table-column prop="avatar" label="头像" width="100px">
        <template #default="scope">
          <img class="w-30px h-30px b-rd-[50%]" :src="`/avatar/${scope.row.avatar}.svg`" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="昵称" width="240px" />
      <el-table-column prop="remark" label="备注" width="100px" />
      <el-table-column prop="openId" label="openId">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-link target="_blank" type="primary" @click="openUserInfo(row.openId)">
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
      <el-table-column prop="create_time" label="注册时间" width="180px" />
      <el-table-column prop="vipInfo" label="是否会员" width="100px">
        <template #default="{ row }">
          <el-popover
            placement="top"
            title="会员信息"
            trigger="hover"
            v-if="row.vipInfo"
            :width="400"
          >
            <template #reference>
              <el-icon
                class="cursor-pointer text-8 text-#aaa"
                :class="{ 'text-red-5': moment().isBefore(moment(row.vipInfo.endTime)) }"
                ><IconVip
              /></el-icon>
            </template>
            <div class="flex flex-col">
              <span>
                有效期：{{ moment(row.vipInfo.startTime).format('YYYY-MM-DD') }} -
                {{ moment(row.vipInfo.endTime).format('YYYY-MM-DD') }}
              </span>
              <div>
                <span>卡券：</span>
                <el-link type="primary" @click="copy(row.vipInfo.couponCode)">{{
                  row.vipInfo.couponCode
                }}</el-link>
              </div>
            </div>
          </el-popover>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="success" size="small" @click="onOpenVipDialog(row.openId)"
            >开会员</el-button
          >
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

  <UserInfoDialog v-model="userInfoVisible" :userId="userId" />

  <OpenVipDialog v-model="openVipVisible" :userId="userId" @onCouponUsed="onCouponUsed" />
</template>

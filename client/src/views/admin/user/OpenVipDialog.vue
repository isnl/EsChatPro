<script lang="ts" setup>
import { ref, watch } from 'vue'
import moment from 'moment'
import { useListHooks } from '../hooks/useListHooks'
import service from '@/service'
import { ElMessage } from 'element-plus'
const { list, total, setParams, getList, onPageChange } = useListHooks({
  url: 'admin/coupon',
  formParams: { isUsed: false },
  isGetDataOnBeforeMount: false
})

const props = defineProps({
  userId: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'onCouponUsed'])

const COUPON_TYPE = [1, 3, 7, 30, 90, 180, 365]

const couponType = ref()
const loading = ref(false)

const onClose = () => {
  emit('update:modelValue', false)
}

watch(
  () => couponType.value,
  () => {
    const params = {
      type: couponType.value ? couponType.value : undefined,
      isUsed: false
    }
    setParams({ ...params })
  }
)

watch(
  () => props.modelValue,
  () => {
    getList()
  }
)

const onUseCoupon = async (couponInfo: any) => {
  const { code, type } = couponInfo
  const params = {
    openId: props.userId,
    couponCode: code,
    couponType: type
  }
  loading.value = true
  await service.post('admin/useCoupon', params)
  loading.value = false
  ElMessage.success('使用成功')
  emit('onCouponUsed')
}
</script>
<template>
  <el-dialog :modelValue="modelValue" title="开通会员" width="40%" @close="onClose" align-center>
    <div class="w-full flex items-center py-2">
      <div>
        <span>卡密类型：</span>
        <el-select v-model="couponType" placeholder="请选择卡密类型" clearable>
          <el-option v-for="item in COUPON_TYPE" :key="item" :label="item + '天'" :value="item" />
        </el-select>
      </div>
    </div>
    <el-table :data="list" class="w-full min-h-60">
      <el-table-column prop="code" label="卡密" width="240px" />
      <el-table-column prop="type" label="卡密类型">
        <template #default="{ row }"> {{ row.type }}天 </template>
      </el-table-column>
      <el-table-column prop="createAt" label="创建日期">
        <template #default="{ row }">
          {{ moment(row.createAt).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template #default="{ row }">
          {{ row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-popconfirm
            title="确定对此用户使用卡密吗?"
            :width="200"
            @confirm="onUseCoupon(row)"
            confirm-button-type="warning"
            confirm-button-text="确定"
            cancel-button-text="取消"
          >
            <template #reference>
              <el-button link type="primary" size="small" :disabled="!!row.openId">使用</el-button>
            </template>
          </el-popconfirm>
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
  </el-dialog>
</template>

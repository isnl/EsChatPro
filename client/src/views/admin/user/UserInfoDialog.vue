<script lang="ts" setup>
import service from '@/service'
import type { UserInfo } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import { ref, watch } from 'vue'

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
const emit = defineEmits(['update:modelValue'])

const dataSource = ref<any>([])
const userInfo = ref<UserInfo>({} as UserInfo)

const onClose = () => {
  emit('update:modelValue', false)
}

watch(
  () => props.userId && props.modelValue,
  (newVal, oldVal) => {
    if (newVal) {
      getUserInfo()
    }
  }
)
const getUserInfo = async () => {
  const res = await service.get(`/admin/user/${props.userId}`)
  dataSource.value = res.usCalls
  userInfo.value = res.userInfo
}
const onPreviewHistory = (history: string[]) => {
  const historyStr = history.join('，')
  ElMessageBox.alert(historyStr, '调用记录', {
    showConfirmButton: false,
    customClass: 'w-160 max-w-none'
  })
}
const userLabel = `text-xs mb-2`
</script>
<template>
  <el-dialog :modelValue="modelValue" title="用户详情" width="30%" @close="onClose" align-center>
    <!-- echarts render -->
    <div class="fc">
      <div class="flex-1 flex flex-col items-center">
        <div
          class="b-rd-[50%] bg-gray-200 flex w-18 h-18 p-2 cursor-pointer relative hover-animate-spin"
        >
          <img class="w-full h-full b-rd-[50%]" :src="`/avatar/${userInfo.avatar}.svg`" />
        </div>
        <div class="flex flex-col mt-5">
          <div :class="userLabel">
            <span>昵称：</span>
            <span>{{ userInfo.name }}</span>
          </div>
          <div v-if="userInfo.remark" :class="userLabel">
            <span>备注：</span>
            <span>{{ userInfo.remark }}</span>
          </div>
          <div :class="userLabel">
            <span>日调用量：</span>
            <span>{{ userInfo.daily_limit }}</span>
          </div>
          <div :class="userLabel">
            <span>输入上限：</span>
            <span>{{ userInfo.max_length }}</span>
          </div>
        </div>
      </div>
      <el-table :data="dataSource" height="300" class="w-360px">
        <el-table-column prop="date" label="日期" width="120px"></el-table-column>
        <el-table-column prop="count" label="调用量" width="100px"></el-table-column>
        <el-table-column label="操作" width="80px">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="onPreviewHistory(row.history)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

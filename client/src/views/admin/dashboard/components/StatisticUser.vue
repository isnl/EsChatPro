<script lang="ts" setup>
import { ref, watch } from 'vue'
import GoodTitle from '@/components/GoodTitle.vue'
import UserInfoDialog from '../../user/UserInfoDialog.vue'
import IconVip from '@/components/icons/IconVip.vue'
import { copy } from '@/hooks/useCopy'
import moment from 'moment'
import { useListHooks } from '@/views/admin/hooks/useListHooks'
interface UserCallsInfo {
  _id: string
  user_id: string
  count: string
}
const { listLoading, list, setParams, total, onPageChange } = useListHooks<UserCallsInfo>({
  url: 'admin/statistics/calls/user',
  formParams: {
    size: 10
  }
})

const dateRange = ref<Date[]>([])
const userId = ref('')
const userInfoVisible = ref(false)
const openUserInfo = (id: string) => {
  userId.value = id
  userInfoVisible.value = true
}

watch(
  () => dateRange.value,
  () => {
    if (dateRange.value.length) {
      const [startTime, endTime] = dateRange.value
      setParams({
        startTime,
        endTime
      })
    }
  }
)
</script>
<template>
  <div class="w-120">
    <GoodTitle title="按日期筛选" />
    <div>
      <div class="w-full flex items-center py-2 sm:flex-row flex-col">
        <div class="w-full flex fc">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
          <span class="px-5 font-bold">All：{{ total }}</span>
        </div>
      </div>
      <el-table :data="list" class="w-full min-h-60" :loading="listLoading">
        <el-table-column prop="user_id" label="用户ID" width="300">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-link target="_blank" type="primary" @click="openUserInfo(row.user_id)">
                {{ row.user_id }}
              </el-link>
              <el-icon
                @click="copy(row.user_id)"
                class="ml-2 text-[#aaaaaa] cursor-pointer text-md hover:text-[#333]"
                ><CopyDocument
              /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="调用量" />
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
      </el-table>
      <div class="py-4 flex justify-end">
        <el-pagination
          small
          background
          :page-size="10"
          layout="prev, pager, next"
          :total="total"
          @current-change="onPageChange"
        />
      </div>
    </div>
  </div>

  <UserInfoDialog v-model="userInfoVisible" :userId="userId" />
</template>

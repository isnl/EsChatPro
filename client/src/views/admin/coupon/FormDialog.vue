<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import service from '@/service'
import { useClipboard } from '@vueuse/core'
const { copy } = useClipboard({ legacy: true })

export interface RuleForm {
  count: number
  type: number
  remark: string
}

const COUPON_TYPE = [1, 3, 7, 30, 90, 180, 365]

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'onCreated'])

const loading = ref(false)
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive<RuleForm>({
  count: 10,
  type: 30,
  remark: ''
})

const resetFields = () => {
  ruleFormRef.value?.resetFields()
  ruleForm.count = 10
  ruleForm.type = 30
  ruleForm.remark = ''
}
const submitForm = async () => {
  loading.value = true
  const params = {
    ...ruleForm
  }
  service
    .post('admin/couponGenerate', params)
    .then((res) => {
      loading.value = false
      copy(res.data.list.join('\n'))
      ElMessage.success('生成卡密并复制成功')
      emit('onCreated')
      resetFields()
    })
    .catch((err) => {
      loading.value = false
    })
}

const onClose = () => {
  emit('update:modelValue')
  resetFields()
}
</script>
<template>
  <el-dialog
    :modelValue="modelValue"
    title="批量生成卡密"
    class="w-90% sm:w-500px"
    @close="onClose"
    align-center
  >
    <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px">
      <el-form-item label="生成数量" prop="title">
        <el-input-number v-model="ruleForm.count" :min="1" :max="100" />
      </el-form-item>
      <el-form-item label="卡密类型" prop="title">
        <el-select v-model="ruleForm.type" placeholder="请选择卡密类型">
          <el-option v-for="item in COUPON_TYPE" :key="item" :label="item + '天'" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="title">
        <el-input v-model="ruleForm.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

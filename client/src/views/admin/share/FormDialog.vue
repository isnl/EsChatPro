<script lang="ts" setup>
import isEmpty from 'lodash/isEmpty'
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import service from '@/service'
import { getStatusMap } from '@/utils'

export interface RuleForm {
  _id?: string
  status: number
  reason: string
}

const statusMap = getStatusMap()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editInfo: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue', 'onCreatedOrUpdated'])

const loading = ref(false)

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive<RuleForm>({
  status: 0,
  reason: ''
})

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      ruleForm.status = props.editInfo.status
      ruleForm.reason = props.editInfo.reason
    }
  }
)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      const params = {
        ...ruleForm
      }
      service
        .put(`admin/share/${props.editInfo._id}`, params)
        .then((res) => {
          loading.value = false
          ElMessage.success('操作成功')
          emit('update:modelValue')
          ruleFormRef.value?.resetFields()
          emit('onCreatedOrUpdated')
        })
        .catch((err) => {
          loading.value = false
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const onClose = () => {
  emit('update:modelValue')
  ruleFormRef.value?.resetFields()
}
</script>
<template>
  <el-dialog
    :modelValue="modelValue"
    title="分享管理"
    width="40%"
    @close="onClose"
    align-center
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" label-width="80px">
      <el-form-item label="状态" prop="title" class="fc">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="item.value" size="large" v-for="item in statusMap">{{
            item.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="拒绝原因" prop="content" v-if="ruleForm.status === 3">
        <el-input
          type="textarea"
          class="w-full"
          :rows="5"
          v-model="ruleForm.reason"
          resize="none"
          :show-word-limit="true"
          placeholder="请输入拒绝原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

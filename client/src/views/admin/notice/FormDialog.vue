<script lang="ts" setup>
import isEmpty from 'lodash/isEmpty'
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import service from '@/service'

export interface RuleForm {
  _id?: string
  title: string
  content: string
}

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

const isCreate = computed(() => isEmpty(props.editInfo))
const title = computed(() => (isCreate.value ? '新建公告' : '编辑公告'))
const loading = ref(false)

const ruleFormRef = ref<FormInstance>()

const defaultState = {
  title: '',
  content: ''
}
const ruleForm = ref<RuleForm>({ ...defaultState })
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
})

watch(
  () => props.editInfo,
  () => {
    if (!isCreate.value) {
      const { _id, title, content } = props.editInfo
      ruleForm.value = {
        _id,
        title,
        content
      }
    }
  }
)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      const action = isCreate.value ? 'post' : 'put'
      const params = {
        ...ruleForm.value
      }
      const url = isCreate.value ? 'admin/notice' : `admin/notice/${props.editInfo._id}`
      service[action](url, params)
        .then((res) => {
          loading.value = false
          ElMessage.success('操作成功')
          emit('update:modelValue')
          ruleFormRef.value?.resetFields()
          resetRuleForm()
          emit('onCreatedOrUpdated', !isCreate.value ? params : undefined)
        })
        .catch((err) => {
          loading.value = false
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}
const onPreview = () => {
  ElMessageBox.alert(ruleForm.value.content, ruleForm.value.title, {
    dangerouslyUseHTMLString: true,
    showConfirmButton: false,
    customClass: 'w-160 max-w-none'
  })
}
const resetRuleForm = () => {
  ruleForm.value = { ...defaultState }
}

const onClose = () => {
  emit('update:modelValue')
  ruleFormRef.value?.resetFields()
  resetRuleForm()
}
</script>
<template>
  <el-dialog
    :modelValue="modelValue"
    :title="title"
    width="40%"
    @close="onClose"
    align-center
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title" maxlength="20" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          type="textarea"
          class="w-full"
          :rows="5"
          v-model="ruleForm.content"
          resize="none"
          :show-word-limit="true"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button
          type="warning"
          @click="onPreview"
          :disabled="!(ruleForm.title && ruleForm.content)"
          >预览</el-button
        >
        <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

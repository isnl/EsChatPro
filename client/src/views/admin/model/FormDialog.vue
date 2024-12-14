<script lang="ts" setup>
import isEmpty from 'lodash/isEmpty'
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import service from '@/service'

export interface RuleForm {
  _id?: string
  name: string
  model: string
  description: string
  sort: number
  isBetter: boolean
  apiKey: string
  apiBaseUrl: string
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
const title = computed(() => (isCreate.value ? '新建模型' : '编辑模型'))
const loading = ref(false)

const ruleFormRef = ref<FormInstance>()

const defaultState = {
  name: '',
  model: '',
  description: '',
  sort: 0,
  isBetter: false,
  apiKey: '',
  apiBaseUrl: ''
}
const ruleForm = ref<RuleForm>({
  ...defaultState
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  model: [{ required: true, message: '请输入模型', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur', type: 'number' }],
  isBetter: [{ required: true, message: '请选择是否推荐', trigger: 'change' }],
  apiKey: [{ required: true, message: '请输入apiKey', trigger: 'blur' }],
  apiBaseUrl: [{ required: true, message: '请输入apiBaseUrl', trigger: 'blur' }]
})

watch(
  () => props.editInfo,
  () => {
    if (!isCreate.value) {
      const { _id, name, model, description, sort, isBetter, apiKey, apiBaseUrl } = props.editInfo
      ruleForm.value = {
        _id,
        name,
        model,
        description,
        sort,
        isBetter,
        apiKey,
        apiBaseUrl
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
      const url = isCreate.value ? 'admin/model' : `admin/model/${props.editInfo._id}`
      service[action](url, params)
        .then((res) => {
          loading.value = false
          ElMessage.success('操作成功')
          emit('update:modelValue')
          ruleFormRef.value?.resetFields()
          resetRuleForm()
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
const resetRuleForm = () => {
  ruleForm.value = {
    ...defaultState
  }
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
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入模型名称" />
      </el-form-item>
      <el-form-item label="模型" prop="model">
        <el-input v-model="ruleForm.model" placeholder="请输入模型" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="ruleForm.sort" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="是否推荐" prop="isBetter">
        <el-switch v-model="ruleForm.isBetter" />
      </el-form-item>
      <el-form-item label="apiKey" prop="apiKey">
        <el-input v-model="ruleForm.apiKey" placeholder="请输入apiKey" />
      </el-form-item>
      <el-form-item label="apiBaseUrl" prop="apiBaseUrl">
        <el-input v-model="ruleForm.apiBaseUrl" placeholder="请输入apiBaseUrl" />
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

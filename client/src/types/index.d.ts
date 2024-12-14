export interface SystemRoleSchema {
  key: string
  description: string
  value?: string
}

export interface SystemRoleItem {
  _id?: string
  title: string
  content: string
  context: boolean
  description: string
  isSchema: boolean
  jsonSchema?: SystemRoleSchema[]
}

export interface IModel {
  _id: string
  name: string
  model: string
  description: string
  usageCount: number
  sort: number
  isBetter: boolean
}

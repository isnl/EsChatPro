export type IModelType = "gpt" | "deepseek" | "tyqw";

export interface IModel {
  _id: string;
  name: string;
  model: string;
  description: string;
  usageCount: number;
  sort: number;
  isBetter: boolean;
  apiKey: string;
  apiBaseUrl: string;
}

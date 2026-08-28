import { Schema, model, type InferSchemaType } from 'mongoose';

const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export type SettingDoc = InferSchemaType<typeof settingSchema> & { _id: unknown };
export const SettingModel = model('Setting', settingSchema);

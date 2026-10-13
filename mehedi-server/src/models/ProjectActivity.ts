import { Schema, model, type InferSchemaType } from "mongoose";

const projectActivitySchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    kind: { type: String, enum: ["created", "updated", "note"], required: true },
    content: { type: String, required: true, trim: true },
    authorName: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);
projectActivitySchema.index({ orderId: 1, createdAt: -1 });

export type ProjectActivityDoc = InferSchemaType<typeof projectActivitySchema> & {
  _id: unknown;
};
export const ProjectActivityModel = model("ProjectActivity", projectActivitySchema);

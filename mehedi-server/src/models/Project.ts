import { Schema, Types, model, type InferSchemaType } from 'mongoose';

const linksSchema = new Schema(
  {
    live: String,
    repo: String,
    figma: String,
    staging: String,
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    clientId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    serviceType: { type: String, required: true, index: true },
    category: { type: String, default: 'other', index: true },
    description: String,
    stack: { type: [String], default: [] },
    budget: Number,
    cost: Number,
    currency: { type: String, default: 'USD' },
    startDate: Date,
    dueDate: Date,
    links: { type: linksSchema, default: {} },
    coverImage: String,
    status: { type: String, default: 'planning', index: true },
    internalNotes: String,
    publishedToPortfolio: { type: Boolean, default: false, index: true },
    caseStudy: String,
  },
  { timestamps: true },
);

export type ProjectDoc = InferSchemaType<typeof projectSchema> & { _id: unknown };
export const ProjectModel = model('Project', projectSchema);

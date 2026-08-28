import { Schema, model, type InferSchemaType } from 'mongoose';

const emailEntrySchema = new Schema(
  {
    address: { type: String, required: true, lowercase: true, trim: true },
    label: { type: String, trim: true },
    primary: { type: Boolean, default: false },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    role: { type: String, enum: ['admin', 'client'], required: true, index: true },
    name: { type: String, required: true, trim: true },
    emails: {
      type: [emailEntrySchema],
      required: true,
      validate: [(v: unknown[]) => v.length > 0, 'At least one email is required'],
    },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    address: { type: String, trim: true },
    timezone: { type: String, trim: true },
    country: { type: String, trim: true },
    source: { type: String },
    avatar: { type: String },
    notes: { type: String },
    passwordHash: { type: String },
    inviteToken: { type: String, index: true, sparse: true },
    inviteTokenExpires: { type: Date },
    active: { type: Boolean, default: true, index: true },
    lastLoginAt: { type: Date },
    lastActivityAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

userSchema.index({ 'emails.address': 1 }, { unique: true });

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: unknown };
export const UserModel = model('User', userSchema);

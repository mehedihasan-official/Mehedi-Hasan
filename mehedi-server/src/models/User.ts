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
    role: { type: String, enum: ['admin', 'client', 'user'], required: true, index: true },
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
    firebaseUid: { type: String, index: true, sparse: true, unique: true },
    active: { type: Boolean, default: true, index: true },
    // A blocked user keeps their record (so the email stays recognized and
    // rejected) but can no longer log in or register again.
    blocked: { type: Boolean, default: false, index: true },
    lastLoginAt: { type: Date },
    lastActivityAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

userSchema.index({ 'emails.address': 1 }, { unique: true });

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: unknown };
export const UserModel = model('User', userSchema);

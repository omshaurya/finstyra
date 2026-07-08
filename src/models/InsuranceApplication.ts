import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInsuranceApplication extends Document {
  userId: mongoose.Types.ObjectId;
  planId: string;
  provider: string;
  flag: string;
  country: string;
  planName: string;
  category: string;
  estimatedPremium: number;
  coverageAmount: number;
  currencySymbol: string;
  status: 'saved' | 'submitted' | 'under_review' | 'active';
  createdAt: Date;
}

const schema = new Schema<IInsuranceApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: { type: String, required: true },
    provider: String, flag: String, country: String, planName: String, category: String,
    estimatedPremium: Number, coverageAmount: Number, currencySymbol: String,
    status: { type: String, enum: ['saved', 'submitted', 'under_review', 'active'], default: 'submitted' },
  },
  { timestamps: true }
);

schema.index({ userId: 1, planId: 1 }, { unique: true });

const InsuranceApplication: Model<IInsuranceApplication> =
  (mongoose.models.InsuranceApplication as Model<IInsuranceApplication>) ||
  mongoose.model<IInsuranceApplication>('InsuranceApplication', schema);

export default InsuranceApplication;

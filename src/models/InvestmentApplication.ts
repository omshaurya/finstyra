import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvestmentApplication extends Document {
  userId: mongoose.Types.ObjectId;
  productId: string;
  provider: string;
  flag: string;
  country: string;
  productName: string;
  category: string;
  projectedReturn: number;
  initialInvestment: number;
  monthlyContribution: number;
  projectedValue: number;
  currencySymbol: string;
  status: 'saved' | 'submitted' | 'open' | 'funded';
  createdAt: Date;
}

const schema = new Schema<IInvestmentApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: String, required: true },
    provider: String, flag: String, country: String, productName: String, category: String,
    projectedReturn: Number, initialInvestment: Number, monthlyContribution: Number, projectedValue: Number, currencySymbol: String,
    status: { type: String, enum: ['saved', 'submitted', 'open', 'funded'], default: 'submitted' },
  },
  { timestamps: true }
);

schema.index({ userId: 1, productId: 1 }, { unique: true });

const InvestmentApplication: Model<IInvestmentApplication> =
  (mongoose.models.InvestmentApplication as Model<IInvestmentApplication>) ||
  mongoose.model<IInvestmentApplication>('InvestmentApplication', schema);

export default InvestmentApplication;

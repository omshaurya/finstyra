import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvestmentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  phone: string;
  dateOfBirth: string;
  country: string;
  nationality: string;
  residency: 'us' | 'eu' | 'other';
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  employmentStatus: string;
  annualIncome: number;
  goal: string;                  // Retirement | Build Wealth | Passive Income | ...
  riskTolerance: string;         // Conservative | Moderate | Aggressive
  experienceLevel: string;
  initialInvestment: number;
  monthlyContribution: number;
  timeHorizonYears: number;
  existingPortfolio: number;
  govIdType: string;
  govIdNumber: string;
}

const schema = new Schema<IInvestmentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phone: String, dateOfBirth: String, country: String, nationality: String,
    residency: { type: String, enum: ['us', 'eu', 'other'], default: 'other' },
    addressLine1: String, city: String, state: String, postalCode: String,
    employmentStatus: String, annualIncome: Number,
    goal: String, riskTolerance: String, experienceLevel: String,
    initialInvestment: Number, monthlyContribution: Number, timeHorizonYears: Number, existingPortfolio: Number,
    govIdType: String, govIdNumber: String,
  },
  { timestamps: true }
);

const InvestmentProfile: Model<IInvestmentProfile> =
  (mongoose.models.InvestmentProfile as Model<IInvestmentProfile>) ||
  mongoose.model<IInvestmentProfile>('InvestmentProfile', schema);

export default InvestmentProfile;

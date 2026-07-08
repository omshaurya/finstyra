import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILoanProfile extends Document {
  userId: mongoose.Types.ObjectId;
  // Contact & personal
  phone: string;
  dateOfBirth: string;
  country: string;
  nationality: string;
  maritalStatus: string;
  dependents: number;
  // Residency & address
  residency: 'us' | 'eu' | 'other';
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  yearsAtAddress: number;
  housingStatus: string;
  // Government / KYC documents
  govIdType: string;
  govIdNumber: string;
  taxIdNumber: string;
  // Employment & finances
  employmentStatus: string;
  employerName: string;
  annualIncome: number;
  monthlyExpenses: number;
  creditScoreRange: string;
  existingMonthlyDebt: number;
  // Loan need
  loanPurpose: string;
  desiredAmount: number;
  desiredTermMonths: number;
}

const loanProfileSchema = new Schema<ILoanProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phone: String,
    dateOfBirth: String,
    country: String,
    nationality: String,
    maritalStatus: String,
    dependents: Number,
    residency: { type: String, enum: ['us', 'eu', 'other'], default: 'other' },
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    yearsAtAddress: Number,
    housingStatus: String,
    govIdType: String,
    govIdNumber: String,
    taxIdNumber: String,
    employmentStatus: String,
    employerName: String,
    annualIncome: Number,
    monthlyExpenses: Number,
    creditScoreRange: String,
    existingMonthlyDebt: Number,
    loanPurpose: String,
    desiredAmount: Number,
    desiredTermMonths: Number,
  },
  { timestamps: true }
);

const LoanProfile: Model<ILoanProfile> =
  (mongoose.models.LoanProfile as Model<ILoanProfile>) ||
  mongoose.model<ILoanProfile>('LoanProfile', loanProfileSchema);

export default LoanProfile;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILoanApplication extends Document {
  userId: mongoose.Types.ObjectId;
  loanId: string;
  bank: string;
  flag: string;
  country: string;
  productName: string;
  category: string;
  offeredRate: number;
  amount: number;
  termMonths: number;
  monthlyPayment: number;
  currencySymbol: string;
  status: 'saved' | 'submitted' | 'under_review' | 'approved';
  createdAt: Date;
}

const loanApplicationSchema = new Schema<ILoanApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    loanId: { type: String, required: true },
    bank: String,
    flag: String,
    country: String,
    productName: String,
    category: String,
    offeredRate: Number,
    amount: Number,
    termMonths: Number,
    monthlyPayment: Number,
    currencySymbol: String,
    status: { type: String, enum: ['saved', 'submitted', 'under_review', 'approved'], default: 'submitted' },
  },
  { timestamps: true }
);

// One application per user per loan product
loanApplicationSchema.index({ userId: 1, loanId: 1 }, { unique: true });

const LoanApplication: Model<ILoanApplication> =
  (mongoose.models.LoanApplication as Model<ILoanApplication>) ||
  mongoose.model<ILoanApplication>('LoanApplication', loanApplicationSchema);

export default LoanApplication;

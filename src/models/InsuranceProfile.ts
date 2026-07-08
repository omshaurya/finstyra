import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInsuranceProfile extends Document {
  userId: mongoose.Types.ObjectId;
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  country: string;
  nationality: string;
  residency: 'us' | 'eu' | 'other';
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  smoker: boolean;
  preExistingConditions: string;
  occupation: string;
  coverageType: string;      // Health | Life Cover | Auto | Home | Travel
  coverageAmount: number;
  dependents: number;
  riskFactors: string;       // low | medium | high
  govIdType: string;
  govIdNumber: string;
}

const schema = new Schema<IInsuranceProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phone: String, dateOfBirth: String, age: Number, gender: String,
    country: String, nationality: String,
    residency: { type: String, enum: ['us', 'eu', 'other'], default: 'other' },
    addressLine1: String, city: String, state: String, postalCode: String,
    smoker: Boolean, preExistingConditions: String, occupation: String,
    coverageType: String, coverageAmount: Number, dependents: Number, riskFactors: String,
    govIdType: String, govIdNumber: String,
  },
  { timestamps: true }
);

const InsuranceProfile: Model<IInsuranceProfile> =
  (mongoose.models.InsuranceProfile as Model<IInsuranceProfile>) ||
  mongoose.model<IInsuranceProfile>('InsuranceProfile', schema);

export default InsuranceProfile;

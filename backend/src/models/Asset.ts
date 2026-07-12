import mongoose, { Schema, Document } from 'mongoose';

export interface IAsset extends Document {
  tag: string;
  name: string;
  categoryId: mongoose.Types.ObjectId;
  serialNumber: string;
  acquisitionDate: Date;
  acquisitionCost: number;
  condition: string;
  location: string;
  status: 'Available' | 'Allocated' | 'Reserved' | 'Under Maintenance' | 'Lost' | 'Retired' | 'Disposed';
  isShared: boolean;
}

const AssetSchema: Schema = new Schema({
  tag: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'AssetCategory', required: true },
  serialNumber: { type: String },
  acquisitionDate: { type: Date, required: true },
  acquisitionCost: { type: Number, required: true },
  condition: { type: String, required: true },
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed'],
    default: 'Available'
  },
  isShared: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IAsset>('Asset', AssetSchema);

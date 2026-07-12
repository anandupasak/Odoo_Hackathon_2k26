import mongoose, { Schema, Document } from 'mongoose';

export interface IAssetCategory extends Document {
  name: string;
  optionalFields: string[];
}

const AssetCategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  optionalFields: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model<IAssetCategory>('AssetCategory', AssetCategorySchema);

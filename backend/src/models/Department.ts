import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  headId: mongoose.Types.ObjectId | null;
  parentId: mongoose.Types.ObjectId | null;
  status: 'Active' | 'Inactive';
}

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  headId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  parentId: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, {
  timestamps: true
});

export default mongoose.model<IDepartment>('Department', DepartmentSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'Admin' | 'Asset Manager' | 'Department Head' | 'Employee';
  departmentId: mongoose.Types.ObjectId | null;
  status: 'Active' | 'Inactive';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Asset Manager', 'Department Head', 'Employee'],
    required: true 
  },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);

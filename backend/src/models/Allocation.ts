import mongoose, { Schema, Document } from 'mongoose';

export interface IAllocation extends Document {
  assetId: mongoose.Types.ObjectId;
  assigneeId: mongoose.Types.ObjectId; // User or Department
  assigneeType: 'User' | 'Department';
  startDate: Date;
  expectedReturnDate: Date | null;
  status: 'Active' | 'Returned' | 'Transfer Pending';
  returnNotes?: string;
}

const AllocationSchema: Schema = new Schema({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  assigneeId: { type: Schema.Types.ObjectId, required: true, refPath: 'assigneeType' },
  assigneeType: { type: String, required: true, enum: ['User', 'Department'] },
  startDate: { type: Date, required: true },
  expectedReturnDate: { type: Date, default: null },
  status: { type: String, enum: ['Active', 'Returned', 'Transfer Pending'], required: true },
  returnNotes: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IAllocation>('Allocation', AllocationSchema);

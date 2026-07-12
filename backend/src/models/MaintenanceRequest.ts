import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenanceRequest extends Document {
  assetId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  issueDescription: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Technician Assigned' | 'In Progress' | 'Resolved';
  dateRaised: Date;
  dateResolved?: Date;
}

const MaintenanceRequestSchema: Schema = new Schema({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  issueDescription: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Technician Assigned', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  dateRaised: { type: Date, default: Date.now },
  dateResolved: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IMaintenanceRequest>('MaintenanceRequest', MaintenanceRequestSchema);

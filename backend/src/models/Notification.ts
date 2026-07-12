import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  type: 'Alert' | 'Approval' | 'Booking';
  read: boolean;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Alert', 'Approval', 'Booking'], required: true },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<INotification>('Notification', NotificationSchema);

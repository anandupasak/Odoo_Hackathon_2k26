import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  assetId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
}

const BookingSchema: Schema = new Schema({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  }
}, {
  timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);

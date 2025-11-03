import { Schema, model, models, Document, Types, Model } from 'mongoose';
import { OrderStatus, IOrder } from '../types.ts';

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    index: true,
  },
    gemachId: { type: Schema.Types.ObjectId, ref: 'Gemach', required: true },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Fix: Explicitly cast `this._id` to `Types.ObjectId` to resolve `toHexString` error.
OrderSchema.virtual('id').get(function(){
    return (this._id as Types.ObjectId).toHexString();
});


// Fix: Correctly type the exported model to prevent query method errors
export default (models.Order as Model<IOrder>) || model<IOrder>('Order', OrderSchema);
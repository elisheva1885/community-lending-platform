import { Schema, model, models, Document, Model, Types } from 'mongoose';
import { IItem, IDamageLog } from '../types';

const DamageLogSchema = new Schema<IDamageLog>({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    reportedBy: { type: String, required: true }, // Should be a user name
});

const ItemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: [true, 'Please provide an item name.'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
    trim: true,
    index: true,
  },
  inventoryCount: {
    type: Number,
    required: [true, 'Please provide the inventory count.'],
    min: [0, 'Inventory count cannot be negative.'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL.'],
  },
  damageLog: [DamageLogSchema],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Fix: Explicitly cast `this._id` to `Types.ObjectId` to resolve `toHexString` error.
ItemSchema.virtual('id').get(function(){
    return (this._id as Types.ObjectId).toHexString();
});


// Fix: Correctly type the exported model to prevent query method errors
export default (models.Item as Model<IItem>) || model<IItem>('Item', ItemSchema);
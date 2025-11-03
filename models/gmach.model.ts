import { Schema, model, models, Model } from 'mongoose';
import type { IGemach } from '../types';

const GemachSchema = new Schema<IGemach>({
  name: { type: String, required: [true, 'Please provide a gemach name.'] },
  address: { type: String, required: [true, 'Please provide an address.'] },
  phone: { type: String },
  email: { type: String },
  managerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

export default (models.Gemach as Model<IGemach>) || model<IGemach>('Gemach', GemachSchema);

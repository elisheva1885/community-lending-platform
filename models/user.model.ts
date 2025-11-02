import { Schema, model, models, Document, Model } from 'mongoose';
import { Role, IUser } from '../types.ts';

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address.'],
  },
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number.'],
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER,
  },
  hashedPassword: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
  gemachIds: [{ type: Schema.Types.ObjectId, ref: 'Gemach' }],
}, {
  timestamps: true,
});

// Fix: Correctly type the exported model to prevent query method errors
export default (models.User as Model<IUser>) || model<IUser>('User', UserSchema);
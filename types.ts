import { Document, Types } from 'mongoose';
// Fix: Add imports for next-auth module augmentation
import 'next-auth';
import 'next-auth/jwt';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  RETURNED = 'Returned',
  CANCELLED = 'Cancelled',
}

// The primary User interface for the application
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
}

export interface DamageLog {
  _id?: string;
  date: string; // Using string for serialization
  description: string;
  reportedBy: string;
}

export interface Item {
  id:string;
  name: string;
  category: string;
  inventoryCount: number;
  imageUrl: string;
  damageLog: DamageLog[];
}

export interface Order {
  id: string;
  userId: string | User; // Can be populated
  itemId: string | Item; // Can be populated
  pickupDate: string; // Using string for serialization
  returnDate: string; // Using string for serialization
  status: OrderStatus;
  createdAt: string; // Using string for serialization
}

// Mongoose Document interfaces
export interface IUser extends Document {
  email: string;
  name: string;
  phone: string;
  role: Role;
  hashedPassword?: string;
}

export interface IDamageLog extends Document {
    date: Date;
    description: string;
    reportedBy: string;
}

export interface IItem extends Document {
  id: string; // virtual getter
  name: string;
  category: string;
  inventoryCount: number;
  imageUrl: string;
  damageLog: IDamageLog[];
}

export interface IOrder extends Document {
  id: string; // virtual getter
  userId: Types.ObjectId;
  itemId: Types.ObjectId;
  pickupDate: Date;
  returnDate: Date;
  status: OrderStatus;
}

// Fix: Add module augmentation for next-auth to include custom session properties.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User {
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}

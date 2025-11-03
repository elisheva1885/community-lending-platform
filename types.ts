// types.ts
import { Document, Types } from 'mongoose';
import 'next-auth';
import 'next-auth/jwt';

//////////////////////
// ENUMS
//////////////////////
export const Role = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type Role = typeof Role[keyof typeof Role];

export const OrderStatus = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled',
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

//////////////////////
// MAIN INTERFACES
//////////////////////

// User interface for app usage
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
}

// DamageLog
export interface DamageLog {
  _id?: string;
  date: string; // serialized
  description: string;
  reportedBy: string;
}

// Item
export interface Item {
  id: string;
  name: string;
  category: string;
  inventoryCount: number;
  imageUrl: string;
  damageLog: DamageLog[];
}

// Order
export interface Order {
  id: string;
  userId: string | User; // can be populated
  itemId: string | Item; // can be populated
  pickupDate: string; // serialized
  returnDate: string; // serialized
  status: OrderStatus;
  createdAt: string;
}

// Gemach
export interface Gemach {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  managerId: number | Types.ObjectId;
}

//////////////////////
// MONGOOSE DOCUMENT INTERFACES
//////////////////////

// User document
export interface IUser extends Document {
  email: string;
  name: string;
  phone: string;
  role: Role;
  hashedPassword?: string;
  gemachIds?: Types.ObjectId[]; // אופציונלי, עבור ניהול מספר גמ"חים
}

// DamageLog document
export interface IDamageLog extends Document {
  date: Date;
  description: string;
  reportedBy: string;
}

// Item document
export interface IItem extends Document {
  id: string; // virtual
  name: string;
  category: string;
  inventoryCount: number;
  imageUrl: string;
  damageLog: IDamageLog[];
  gemachId: Types.ObjectId;
}

// Order document
export interface IOrder extends Document {
  id: string; // virtual
  userId: Types.ObjectId;
  itemId: Types.ObjectId;
  pickupDate: Date;
  returnDate: Date;
  status: OrderStatus;
  gemachId: Types.ObjectId;
}

// Gemach document
export interface IGemach extends Document {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  managerId: Types.ObjectId;
}

//////////////////////
// NEXT-AUTH AUGMENTATION
//////////////////////
// הסרה של השורה הזו:
// import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      name?: string;
      email?: string;
    };
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

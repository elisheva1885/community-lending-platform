import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/user.model';
import bcrypt from 'bcryptjs';
import { IUser, Role } from '../../../../types';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { name, email, phone, password } = await req.json();

    // Basic validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const newUser: IUser = {
      name,
      email,
      phone,
      role: Role.USER, // default role
      hashedPassword,
    };

    const createdUser = await User.create(newUser);

    // Return minimal user info (do NOT return password)
    const userResponse = {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone,
      role: createdUser.role,
    };

    return NextResponse.json({ user: userResponse }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error during registration' }, { status: 500 });
  }
}

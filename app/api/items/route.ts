import dbConnect from '../../../lib/dbConnect';
import Item from '../../../models/item.model';
import { Role } from '../../../types';
import { getAuthenticatedUser } from '../../../lib/authUtils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import Gemach from '../../../models/gmach.model';


// GET all items (publicly accessible)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const items = await Item.find({}).sort({ createdAt: -1 });
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST a new item (Admin only)
export async function POST(req: Request) {
  // 1️⃣ שליפת הסשן הנוכחי דרך NextAuth
  const session = await getServerSession(authOptions);

  // 2️⃣ בדיקת הרשאה – רק מנהלים יכולים להוסיף פריטים
  if (!session || session.user.role !== Role.ADMIN) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const gemach = await Gemach.findOne({ managerId: userId });
  if (!gemach) {
    return NextResponse.json({ error: 'No Gemach found for this manager' }, { status: 404 });
  }

  try {
    // 3️⃣ התחברות למסד הנתונים
    await dbConnect();

    // 4️⃣ קריאת הנתונים מהבקשה
    const body = await req.json();

    // 5️⃣ יצירת פריט חדש במסד הנתונים
    const newItem = await Item.create({
      ...body,
      gemachId: gemach._id, // חובה להוסיף את זה
    });
    // 6️⃣ החזרת התוצאה
    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // 7️⃣ טיפול בשגיאות
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

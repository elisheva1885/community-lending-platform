import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; // הנתיב ל־auth שלך
import GemachModel from '../../../models/gmach.model';
import { Role } from '../../../types';
import dbConnect from '../../../lib/dbConnect';
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 🔹 שליפת הסשן הנוכחי
    const session = await getServerSession(authOptions);

    // 🔹 בדיקת הרשאה – רק ADMIN יכול להוסיף
    if (!session || session.user.role !== Role.ADMIN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 🔹 קריאה ל־body
    const body = await req.json();
    const { name, address, phone, email } = body;

    if (!name || !address) {
      return new Response(JSON.stringify({ error: 'Name and address are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await dbConnect();

    // 🔹 יצירת הגמח עם managerId = המשתמש הנוכחי
    const newGemach = await GemachModel.create({
      name,
      address,
      phone,
      email,
      managerId: new Types.ObjectId(session.user.id), // כאן מזהה המשתמש מהסשן
    });

    return new Response(JSON.stringify(newGemach), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

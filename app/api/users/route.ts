import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user.model';
import { Role } from '../../../types';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// GET all users (Admin only)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.role !== Role.ADMIN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await dbConnect();
    // Exclude password hash from the result
    const users = await User.find({}).select('-hashedPassword').sort({ createdAt: -1 });

    // Convert mongoose documents to plain objects and clean fields
    const plainUsers = users.map(u => {
      const obj = u.toObject({ getters: true, virtuals: true });
      obj.id = obj._id.toString();
      delete obj._id;
      delete obj.__v;
      return obj;
    });

    return new Response(JSON.stringify(plainUsers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user.model';
import { getAuthenticatedUser } from '../../../lib/authUtils';
import { Role } from '../../../types';

// GET all users (Admin only)
export async function GET(req: Request) {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== Role.ADMIN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await dbConnect();
    // Exclude password hash from the result
    const users = await User.find({}).select('-hashedPassword').sort({ createdAt: -1 });
    
    // Mongoose documents need to be converted to plain objects before sending
    const plainUsers = users.map(u => {
        const obj = u.toObject({getters: true, virtuals: true});
        // ensure id is a string
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

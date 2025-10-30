import dbConnect from '../../../lib/dbConnect';
import Item from '../../../models/item.model';
import { Role } from '../../../types';
import { getAuthenticatedUser } from '../../../lib/authUtils';

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
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== Role.ADMIN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await dbConnect();
    const body = await req.json();
    const newItem = await Item.create(body);
    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

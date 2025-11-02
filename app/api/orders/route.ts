import dbConnect from '../../../lib/dbConnect';
import Order from '../../../models/order.model';
import Item from '../../../models/item.model';
import { getAuthenticatedUser } from '../../../lib/authUtils';
import { Role } from '../../../types';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/route';

// GET orders (all for Admin, user's own for User)
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const user = session?.user;
  // const user = getAuthenticatedUser(req);
  if(!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    await dbConnect();
    const query = user.role === Role.ADMIN ? {} : { userId: user.id };
    const orders = await Order.find(query)
      .populate('itemId', 'name imageUrl')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

// POST a new order
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  } if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await dbConnect();
    const { itemId, pickupDate, returnDate } = await req.json();

    if (!itemId || !pickupDate || !returnDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
    }

    // Check for conflicting orders
    const conflictingOrders = await Order.countDocuments({
      itemId,
      status: { $in: ['Pending', 'Active'] },
      pickupDate: { $lt: new Date(returnDate) },
      returnDate: { $gt: new Date(pickupDate) },
    });

    if (conflictingOrders >= item.inventoryCount) {
      return new Response(JSON.stringify({ error: 'Item not available for the selected dates' }), { status: 409 });
    }

    const newOrderData = {
      userId: user.id,
      itemId,
      pickupDate: new Date(pickupDate),
      returnDate: new Date(returnDate),
    };

    const newOrder = await Order.create(newOrderData);
    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

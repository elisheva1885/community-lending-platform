import dbConnect from '../../../../lib/dbConnect';
import Order from '../../../../models/order.model';
import { getAuthenticatedUser } from '../../../../lib/authUtils';
import { Role } from '../../../../types';

function getIDFromURL(url: string): string | null {
    const parts = url.split('/');
    return parts.pop() || null;
}

// PUT (update) an order by ID (Admin only) - primarily for status changes
export async function PUT(req: Request) {
    const user = getAuthenticatedUser(req);
    if (!user || user.role !== Role.ADMIN) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    
    const id = getIDFromURL(req.url);
    if (!id) return new Response(JSON.stringify({ error: 'Missing order ID' }), { status: 400 });

    try {
        await dbConnect();
        const body = await req.json();
        
        const { status } = body;
        if (!status) {
            return new Response(JSON.stringify({ error: 'Status is required for update' }), { status: 400 });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedOrder), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}

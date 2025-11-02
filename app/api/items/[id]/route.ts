import dbConnect from '../../../../lib/dbConnect';
import Item from '../../../../models/item.model';
import { getAuthenticatedUser } from '../../../../lib/authUtils';
import { Role } from '../../../../types';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// This function is a workaround to get path params in this environment
function getIDFromURL(url: string): string | null {
    const parts = url.split('/');
    return parts.pop() || null;
}

// GET a single item by ID (public)
export async function GET(req: Request) {
    const id = getIDFromURL(req.url);
    if (!id) return new Response(JSON.stringify({ error: 'Missing item ID' }), { status: 400 });

    try {
        await dbConnect();
        const item = await Item.findById(id);
        if (!item) {
            return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(item), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}

// PUT (update) an item by ID (Admin only)
export async function PUT(req: Request) {
     const session = await getServerSession(authOptions);
    
      // 2️⃣ בדיקת הרשאה – רק מנהלים יכולים להוסיף פריטים
      if (!session || session.user.role !== Role.ADMIN) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    const id = getIDFromURL(req.url);
    if (!id) return new Response(JSON.stringify({ error: 'Missing item ID' }), { status: 400 });

    try {
        await dbConnect();
        const body = await req.json();
        const updatedItem = await Item.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updatedItem) {
            return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(updatedItem), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}

// DELETE an item by ID (Admin only)
export async function DELETE(req: Request) {
     const session = await getServerSession(authOptions);
    
      // 2️⃣ בדיקת הרשאה – רק מנהלים יכולים להוסיף פריטים
      if (!session || session.user.role !== Role.ADMIN) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    
    const id = getIDFromURL(req.url);
    if (!id) return new Response(JSON.stringify({ error: 'Missing item ID' }), { status: 400 });
    
    try {
        await dbConnect();
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ message: 'Item deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}

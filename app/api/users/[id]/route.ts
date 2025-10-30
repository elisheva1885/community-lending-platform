import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/user.model';
import { getAuthenticatedUser } from '../../../../lib/authUtils';
import { Role } from '../../../../types';

function getIDFromURL(url: string): string | null {
    const parts = url.split('/');
    return parts.pop() || null;
}

// PUT (update) a user by ID (Admin only) - for role changes
export async function PUT(req: Request) {
    const user = getAuthenticatedUser(req);
    if (!user || user.role !== Role.ADMIN) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const idToUpdate = getIDFromURL(req.url);
    if (!idToUpdate) return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 });

    // Prevent admin from changing their own role
    if (user.id === idToUpdate) {
        return new Response(JSON.stringify({ error: 'Cannot change your own role' }), { status: 403 });
    }

    try {
        await dbConnect();
        const { role } = await req.json();

        if (!role || !Object.values(Role).includes(role)) {
            return new Response(JSON.stringify({ error: 'Invalid role provided' }), { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            idToUpdate,
            { role },
            { new: true, runValidators: true }
        ).select('-hashedPassword');

        if (!updatedUser) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedUser.toObject({getters: true, virtuals: true})), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}

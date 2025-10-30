import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user.model';
import bcrypt from 'bcryptjs';
import { User as UserInterface } from '../../../types';

// This is a simplified "JWT" creator.
// In a production app, you would use a library like 'jose' or 'jsonwebtoken' to create a signed JWT.
function createToken(user: UserInterface): string {
    const payload = JSON.stringify(user);
    return btoa(payload); // Base64 encode the payload
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
        }

        const user = await User.findOne({ email });

        if (user && user.hashedPassword && bcrypt.compareSync(password, user.hashedPassword)) {
            const userPayload: UserInterface = {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
            };

            const token = createToken(userPayload);
            
            return new Response(JSON.stringify({ token, user: userPayload }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Server error during login' }), { status: 500 });
    }
}

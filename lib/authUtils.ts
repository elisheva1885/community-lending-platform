import { User } from '../types';

// This is a simplified "JWT" decoder for our base64-encoded token.
// In a production app, you would use a library like 'jose' or 'jsonwebtoken' to verify a real JWT signature.
function decodeToken(token: string): User | null {
    try {
        const payload = JSON.parse(atob(token));
        // Basic validation
        if (payload && payload.id && payload.role && payload.name) {
            return payload as User;
        }
        return null;
    } catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
}


export function getAuthenticatedUser(req: Request): User | null {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return null;
        }
        return decodeToken(token);
    } catch (error) {
        return null;
    }
}

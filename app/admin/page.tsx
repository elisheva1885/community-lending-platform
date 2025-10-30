import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Role } from "../../types";
import AdminTabs from "./AdminTabs";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
        redirect('/login?callbackUrl=/admin');
    }

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">לוח ניהול</h1>
                <p className="text-gray-600">ניהול פריטים, הזמנות ומשתמשים במערכת.</p>
            </div>
            <AdminTabs />
        </div>
    );
}

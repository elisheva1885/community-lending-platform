'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import AdminTabs from '../app/admin/AdminTabs';

export default function AdminDashboard() {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <p>טוען...</p>;
    }

    if (!isAuthenticated || user?.role !== Role.ADMIN) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login?callbackUrl=/admin';
        }
        return <p>אין לך הרשאה לגשת לעמוד זה. מועבר לדף הכניסה...</p>;
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

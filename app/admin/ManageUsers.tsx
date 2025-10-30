'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Role } from '../../types';

const roleTranslations: { [key in Role]: string } = {
    [Role.USER]: 'משתמש',
    [Role.ADMIN]: 'מנהל',
};

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser, authFetch } = useAuth();

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await authFetch('/api/users');
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch users');
            }
            const data: User[] = await res.json();
            setUsers(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId: string, newRole: Role) => {
        try {
            const response = await authFetch(`/api/users/${userId}`, {
                method: 'PUT',
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update role');
            }
            
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
        } catch (err) {
            alert(`Error: ${(err as Error).message}`);
            fetchUsers();
        }
    };

    if (isLoading) return <p>טוען משתמשים...</p>;
    if (error) return <p className="text-red-500">שגיאה: {error}</p>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">אימייל</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">טלפון</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">הרשאה</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                                    disabled={user.id === currentUser?.id}
                                    className="p-1.5 text-xs font-semibold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    {Object.values(Role).map(role => (
                                        <option key={role} value={role}>
                                            {roleTranslations[role]}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;

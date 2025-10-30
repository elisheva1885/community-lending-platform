'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Order, OrderStatus, User, Item } from '../../types';
import { useAuth } from '../../context/AuthContext';

const statusStyles: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    [OrderStatus.ACTIVE]: 'bg-blue-100 text-blue-800 border-blue-300',
    [OrderStatus.RETURNED]: 'bg-green-100 text-green-800 border-green-300',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-300',
};

const statusTranslations: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'ממתינה לאישור',
    [OrderStatus.ACTIVE]: 'פעילה',
    [OrderStatus.RETURNED]: 'הוחזרה',
    [OrderStatus.CANCELLED]: 'בוטלה',
};

const ManageOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const { authFetch } = useAuth();

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await authFetch('/api/orders');
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data: Order[] = await res.json();
            setOrders(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        try {
            const response = await authFetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );

        } catch (err) {
            setError((err as Error).message);
            fetchOrders();
        }
    };
    
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const user = order.userId as User;
            const item = order.itemId as Item;
            
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesSearch =
                (user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return matchesStatus && matchesSearch;
        });
    }, [orders, searchTerm, statusFilter]);

    if (isLoading) return <p>טוען הזמנות...</p>;
    if (error) return <p className="text-red-500">שגיאה: {error}</p>;

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="חיפוש לפי שם לקוח או מוצר..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="all">כל הסטטוסים</option>
                    {Object.values(OrderStatus).map(status => (
                        <option key={status} value={status}>{statusTranslations[status]}</option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מוצר</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">לקוח</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך איסוף</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך החזרה</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map(order => {
                            const item = order.itemId as Item;
                            const user = order.userId as User;
                            return (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.pickupDate).toLocaleDateString('he-IL')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.returnDate).toLocaleDateString('he-IL')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                            className={`p-1.5 text-xs font-semibold rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusStyles[order.status]}`}
                                        >
                                            {Object.values(OrderStatus).map(status => (
                                                <option key={status} value={status}>
                                                    {statusTranslations[status]}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;

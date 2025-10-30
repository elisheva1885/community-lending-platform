'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { Order, OrderStatus } from "../types";

const statusStyles: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.ACTIVE]: 'bg-blue-100 text-blue-800',
    [OrderStatus.RETURNED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

const statusTranslations: { [key in OrderStatus]: string } = {
    [OrderStatus.PENDING]: 'ממתינה לאישור',
    [OrderStatus.ACTIVE]: 'פעילה',
    [OrderStatus.RETURNED]: 'הוחזרה',
    [OrderStatus.CANCELLED]: 'בוטלה',
};

export default function MyOrdersPage() {
    const { isAuthenticated, isLoading: isAuthLoading, authFetch } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (isAuthLoading) {
            return; // Wait for auth state to be determined
        }
        if (!isAuthenticated) {
            window.location.href = '/login?callbackUrl=/my-orders';
            return;
        }

        const fetchOrders = async () => {
            setIsLoadingData(true);
            try {
                const res = await authFetch('/api/orders');
                if (!res.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, isAuthLoading, authFetch]);

    if (isAuthLoading || isLoadingData) {
        return <div className="text-center p-8">טוען הזמנות...</div>;
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">ההזמנות שלי</h1>
            {orders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">מוצר</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תאריך איסוף</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תאריך החזרה</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">סטטוס</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(order => {
                                const item = order.itemId as any; // The API populates this
                                return (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={item?.imageUrl} alt={item?.name} />
                                                </div>
                                                <div className="mr-4">
                                                    <div className="text-sm font-medium text-gray-900">{item?.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.pickupDate).toLocaleDateString('he-IL')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.returnDate).toLocaleDateString('he-IL')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[order.status]}`}>
                                                {statusTranslations[order.status]}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-8">עדיין לא ביצעת הזמנות.</p>
            )}
        </div>
    );
}

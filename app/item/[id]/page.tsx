'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Item } from '../../../types';
import OrderForm from './OrderForm';

export default function ItemDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [item, setItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchItem = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/items/${id}`);
                if (!res.ok) {
                   throw new Error('Item not found');
                }
                const data = await res.json();
                setItem(data);
            } catch (error) {
                console.error(error);
                setItem(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (isLoading) {
        return <div className="text-center p-8">טוען פרטי פריט...</div>;
    }

    if (!item) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600">שגיאה</h2>
            <p className="text-gray-600 mt-2">הפריט המבוקש לא נמצא.</p>
        </div>;
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={item.imageUrl} alt={item.name} className="w-full h-auto rounded-lg object-cover aspect-square" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
                    <p className="text-lg text-gray-500 mb-4">{item.category}</p>
                    <div className="border-t pt-4 mt-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">פרטים והזמנה</h2>
                        <OrderForm item={item} />
                    </div>
                </div>
            </div>
        </div>
    );
}

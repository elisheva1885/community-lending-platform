'use client';

import React, { useState } from 'react';
import { Item, OrderStatus } from '../../../types';
import { useSession } from 'next-auth/react';

const OrderForm: React.FC<{ item: Item }> = ({ item }) => {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const user = session?.user;
    const today = new Date().toISOString().split('T')[0];
    const [pickupDate, setPickupDate] = useState(today);
    const [returnDate, setReturnDate] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedReturnDate = e.target.value;
        if (selectedReturnDate >= pickupDate) {
            setReturnDate(selectedReturnDate);
        } else {
            setReturnDate('');
            alert('תאריך ההחזרה חייב להיות מאוחר או שווה לתאריך האיסוף.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !user) return;
        setIsLoading(true);
        setMessage(null);
        const token = session?.user?.token; // אם אתה מחזיר accessToken ב־JWT callback
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                itemId: item.id,
                userId: user?.id,
                pickupDate,
                returnDate,
                status: OrderStatus.PENDING,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage({ type: 'success', text: 'ההזמנה בוצעה בהצלחה! ניתן לראות אותה בעמוד "ההזמנות שלי".' });
        } else {
            setMessage({ type: 'error', text: data.error || 'שגיאה בביצוע ההזמנה. הפריט כנראה לא זמין בתאריכים אלו.' });
        }
        setIsLoading(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 text-yellow-700">
                <p>
                    עליך <a href="/login" className="font-bold underline">להתחבר</a> כדי לבצע הזמנה.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">תאריך איסוף</label>
                <input
                    type="date"
                    id="pickupDate"
                    value={pickupDate}
                    min={today}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">תאריך החזרה</label>
                <input
                    type="date"
                    id="returnDate"
                    value={returnDate}
                    min={pickupDate}
                    onChange={handleReturnDateChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !returnDate}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
                {isLoading ? 'שולח בקשה...' : 'הזמן עכשיו'}
            </button>
            {message && (
                <div className={`mt-4 text-center p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
        </form>
    );
};

export default OrderForm;

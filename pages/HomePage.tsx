import React from 'react';
import ItemList from '../app/ItemList';

export default function HomePage() {
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">קטלוג מוצרים</h1>
                <p className="text-gray-600">מצאו את הפריט שאתם צריכים והזמינו בקלות.</p>
            </div>
            <ItemList />
        </div>
    );
}

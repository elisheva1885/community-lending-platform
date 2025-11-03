'use client';
import { useState } from 'react';
import AddGemachPage from './add-gemach-form/page';
import ItemList from './ItemList';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">קטלוג מוצרים</h1>
        <p className="text-gray-600">מצאו את הפריט שאתם צריכים והזמינו בקלות.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add New Gemach
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)} // סוגר בלחיצה על הרקע
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // מונע סגירה כשמקליקים בתוך המודל
          >
            <AddGemachPage onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      <ItemList />
    </div>
  );
}

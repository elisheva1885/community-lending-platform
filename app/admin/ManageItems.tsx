'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Item } from '../../types';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '../../components/Icons';
import ItemFormModal from './ItemFormModal';
import { useAuth } from '../../context/AuthContext';

const ManageItems: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const { authFetch } = useAuth();

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await authFetch('/api/items');
            if (!res.ok) throw new Error('Failed to fetch items');
            const data = await res.json();
            setItems(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleOpenModal = (item: Item | null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    const handleSave = async (itemData: Omit<Item, 'id' | 'damageLog'>) => {
        const url = currentItem ? `/api/items/${currentItem.id}` : '/api/items';
        const method = currentItem ? 'PUT' : 'POST';

        try {
            const response = await authFetch(url, {
                method,
                body: JSON.stringify(itemData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save item');
            }
            
            handleCloseModal();
            await fetchItems(); // Refresh list

        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        }
    };
    
    const handleDelete = async (itemId: string) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
            try {
                const response = await authFetch(`/api/items/${itemId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete item');
                await fetchItems(); // Refresh list
            } catch (error) {
                alert(`Error: ${(error as Error).message}`);
            }
        }
    };

    if (isLoading) return <p>טוען פריטים...</p>;
    if (error) return <p className="text-red-500">שגיאה: {error}</p>;

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => handleOpenModal(null)}
                    className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    <PlusCircleIcon className="h-5 w-5 ml-2" />
                    הוסף פריט חדש
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">תמונה</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">קטגוריה</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">כמות במלאי</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded-full object-cover"/>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.inventoryCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900">
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <ItemFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    item={currentItem}
                />
            )}
        </div>
    );
};

export default ManageItems;

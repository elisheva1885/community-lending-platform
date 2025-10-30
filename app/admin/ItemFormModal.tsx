'use client';

import React, { useState, useEffect } from 'react';
import { Item } from '../../types';

interface ItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (itemData: Omit<Item, 'id' | 'damageLog'>) => void;
    item: Item | null;
}

type FormData = Omit<Item, 'id' | 'damageLog'>;

const ItemFormModal: React.FC<ItemFormModalProps> = ({ isOpen, onClose, onSave, item }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        category: '',
        inventoryCount: 1,
        imageUrl: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                category: item.category,
                inventoryCount: item.inventoryCount,
                imageUrl: item.imageUrl,
            });
        } else {
            setFormData({ name: '', category: '', inventoryCount: 1, imageUrl: '' });
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSave(formData);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-4">{item ? 'עריכת פריט' : 'הוספת פריט חדש'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">שם הפריט</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">קטגוריה</label>
                        <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="inventoryCount" className="block text-sm font-medium text-gray-700">כמות במלאי</label>
                        <input type="number" name="inventoryCount" id="inventoryCount" value={formData.inventoryCount} onChange={handleChange} required min="0" className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">כתובת תמונה (URL)</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">ביטול</button>
                        <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isLoading ? 'שומר...' : 'שמור'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemFormModal;

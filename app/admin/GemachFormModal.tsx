'use client';

import React, { useState, useEffect } from 'react';
import { IGemach } from '../../types';

interface GemachFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (gemachData: Omit<IGemach, 'id'> & { managerId: string }) => void;
    gemach: IGemach | null;
}

type FormData = Omit<IGemach, 'id'>;

const GemachFormModal: React.FC<GemachFormModalProps> = ({ isOpen, onClose, onSave, gemach }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        address: '',
        phone: '',
        email: '',
        managerId: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (gemach) {
            setFormData({
                name: gemach.name,
                address: gemach.address,
                phone: gemach.phone || '',
                email: gemach.email || '',
                managerId: typeof gemach.managerId === 'string'
                    ? gemach.managerId
                    : gemach.managerId._id,  // אם זה אובייקט משתמש, קח את ה־_id
            });
        } else {
            setFormData({ name: '', address: '', phone: '', email: '', managerId: '' });
        }
    }, [gemach]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = {
            ...formData,
            managerId: typeof formData.managerId === 'string'
                ? formData.managerId
                : formData.managerId._id, // במקרה שהוא אובייקט
        };

        await onSave(payload);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-4">
                    {gemach ? 'עריכת גמ"ח' : 'הוספת גמ"ח חדש'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            שם הגמ"ח
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            כתובת
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            טלפון
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            אימייל
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
                            מזהה מנהל (managerId)
                        </label>
                        <input
                            type="text"
                            name="managerId"
                            id="managerId"
                            value={formData.managerId}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full p-2 border rounded-md"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                        >
                            {isLoading ? 'שומר...' : 'שמור'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GemachFormModal;

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { IGemach } from '../../types';
import GemachFormModal from './GemachFormModal';

const ManageGemachim: React.FC = () => {
    const [gemachim, setGemachim] = useState<IGemach[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGemach, setCurrentGemach] = useState<IGemach | null>(null);
    const { authFetch } = useAuth();

    const fetchGemachim = async () => {
        setIsLoading(true);
        try {
            const res = await authFetch('/api/gemach');
            if (!res.ok) throw new Error('Failed to fetch gemachim');
            const data = await res.json();
            setGemachim(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGemachim();
    }, []);

    const handleOpenModal = (gemach: IGemach | null) => {
        setCurrentGemach(gemach);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentGemach(null);
    };

    const handleSave = async (gemachData: Omit<IGemach, 'id'>) => {
        const url = currentGemach ? `/api/gemachim` : '/api/gemachim';
        const method = currentGemach ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                body: JSON.stringify(gemachData),
            });
            if (!response.ok) throw new Error('Failed to save gemach');
            handleCloseModal();
            await fetchGemachim();
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק גמ"ח זה?')) {
            try {
                const res = await authFetch(`/api/gemachim/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete gemach');
                await fetchGemachim();
            } catch (error) {
                alert(`Error: ${(error as Error).message}`);
            }
        }
    };

    if (isLoading) return <p>טוען גמ"חים...</p>;
    if (error) return <p className="text-red-500">שגיאה: {error}</p>;

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => handleOpenModal(null)}
                    className="flex items-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    <PlusCircleIcon className="h-5 w-5 ml-2" />
                    הוסף גמ"ח חדש
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">כתובת</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">טלפון</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מייל</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {gemachim.map(g => (
                            <tr key={g._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{g.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{g.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{g.phone || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{g.email || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => handleOpenModal(g)} className="text-indigo-600 hover:text-indigo-900">
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleDelete(g._id)} className="text-red-600 hover:text-red-900">
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
                <GemachFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    gemach={currentGemach}
                />
            )}
        </div>
    );
};

export default ManageGemachim;

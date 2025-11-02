'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Item } from '../types';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';
import { useSession } from 'next-auth/react';

const ItemList: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN';

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/items');
                if (!res.ok) {
                    throw new Error('Failed to fetch items');
                }
                const data = await res.json();
                setItems(data);
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, []);

    const categories = useMemo(() => {
        if (!items) return ['all'];
        const allCategories = items.map(item => item.category);
        return ['all', ...Array.from(new Set(allCategories))];
    }, [items]);

    const filteredItems = useMemo(() => {
        if (!items) return [];
        return items.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [items, searchTerm, selectedCategory]);

    if (isLoading) {
        return <p className="text-center text-gray-500 col-span-full">טוען פריטים...</p>;
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="חיפוש לפי שם פריט..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Search items"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Filter by category"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'כל הקטגוריות' : cat}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <ItemCard key={item.id} item={item} isAdmin={isAdmin}/>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">לא נמצאו פריטים התואמים את החיפוש.</p>
                )}
            </div>
        </>
    );
};

export default ItemList;

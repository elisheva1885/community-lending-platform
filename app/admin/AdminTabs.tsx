'use client';

import React, { useState } from 'react';
import ManageItems from './ManageItems';
import ManageOrders from './ManageOrders';
import ManageUsers from './ManageUsers';

type Tab = 'items' | 'orders' | 'users';

const AdminTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('items');

    const renderContent = () => {
        switch (activeTab) {
            case 'items':
                return <ManageItems />;
            case 'orders':
                return <ManageOrders />;
            case 'users':
                return <ManageUsers />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('items')}
                        className={`${
                            activeTab === 'items'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        ניהול פריטים
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`${
                            activeTab === 'orders'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        ניהול הזמנות
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`${
                            activeTab === 'users'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        ניהול משתמשים
                    </button>
                </nav>
            </div>
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminTabs;
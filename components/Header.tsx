import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { BoxIcon, UserCircleIcon, LogoutIcon, ShieldCheckIcon } from './Icons';

const Header: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="flex items-center text-indigo-600 hover:text-indigo-800 transition">
                            <BoxIcon className="h-8 w-8" />
                            <span className="ml-3 text-2xl font-bold">גמ"ח 2.0</span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && user ? (
                            <>
                                <span className="text-gray-600">שלום, {user.name}</span>
                                <a href="/my-orders" className="text-gray-500 hover:text-indigo-600 transition">ההזמנות שלי</a>
                                {user.role === Role.ADMIN && (
                                    <a href="/admin" className="flex items-center text-gray-500 hover:text-indigo-600 transition">
                                        <ShieldCheckIcon className="h-5 w-5 mr-1" />
                                        <span>ניהול</span>
                                    </a>
                                )}
                                <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700 transition">
                                    <LogoutIcon className="h-5 w-5 mr-1" />
                                    <span>התנתק</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <a href="/login" className="flex items-center text-gray-500 hover:text-indigo-600 transition">
                                    <UserCircleIcon className="h-5 w-5 mr-1" />
                                    <span>כניסה / הרשמה</span>
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

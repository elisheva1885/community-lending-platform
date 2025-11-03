'use client';
import React, { useState, useEffect } from 'react';
import { IGemach } from '../../types';

interface User {
  _id: string;
  name: string;
  email: string;
}

type GemachInput = {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  managerId: string;
};

interface GemachFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gemachData: GemachInput) => Promise<void> | void;
  gemach: IGemach | null;
}

const GemachFormModal: React.FC<GemachFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  gemach,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [managerId, setManagerId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  // שליפת המשתמשים לרשימת המנהלים
  useEffect(() => {
    const fetchUsers = async () => {
      setIsFetchingUsers(true);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch {
        setError('שגיאה בשליפת רשימת המשתמשים');
      } finally {
        setIsFetchingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // מילוי השדות בעת עריכה
  useEffect(() => {
    if (gemach) {
      setName(gemach.name);
      setAddress(gemach.address);
      setPhone(gemach.phone || '');
      setEmail(gemach.email || '');
      setManagerId(
        typeof gemach.managerId === 'string'
          ? gemach.managerId
          : gemach.managerId._id.toString()
      );
    } else {
      setName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setManagerId('');
    }
  }, [gemach]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSave({
        name,
        address,
        phone,
        email,
        managerId,
      });
    } catch {
      setError('שגיאה בשמירת הנתונים');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {gemach ? 'עריכת גמ"ח' : 'הוספת גמ"ח חדש'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="שם הגמח\"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="כתובת"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="tel"
            placeholder="טלפון"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <div>
            <label className="block font-medium mb-1">מנהל גמ"ח</label>
            {isFetchingUsers ? (
              <p className="text-gray-500 text-sm">טוען רשימת משתמשים...</p>
            ) : (
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                required
                className="border p-2 w-full rounded"
              >
                <option value="">בחר מנהל</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isLoading ? 'שומר...' : gemach ? 'שמור שינויים' : 'הוסף גמ"ח'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GemachFormModal;

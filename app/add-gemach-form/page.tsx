// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface AddGemachPageProps {
//   onClose: () => void;
// }

// export default function AddGemachPage({ onClose }: AddGemachPageProps) {
//   const [name, setName] = useState('');
//   const [address, setAddress] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const res = await fetch('/api/gemach', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, address, phone, email }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || 'Something went wrong.');
//       } else {
//         setSuccess('Gemach added successfully!');
//         setName('');
//         setAddress('');
//         setPhone('');
//         setEmail('');
//         onClose(); // סוגר את המודל אחרי הוספה
//       }
//     } catch {
//       setError('Server error. Try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4 text-center">Add New Gemach</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           className="border p-2 w-full rounded"
//         />
//         <input
//           type="text"
//           placeholder="Address"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           required
//           className="border p-2 w-full rounded"
//         />
//         <input
//           type="text"
//           placeholder="Phone"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="border p-2 w-full rounded"
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border p-2 w-full rounded"
//         />
//         {error && <p className="text-red-600 text-center">{error}</p>}
//         {success && <p className="text-green-600 text-center">{success}</p>}
//         <div className="flex justify-end space-x-2">
//           <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400"
//           >
//             {isLoading ? 'Adding...' : 'Add Gemach'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AddGemachPageProps {
  onClose: () => void;
}

export default function AddGemachPage({ onClose }: AddGemachPageProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [managerId, setManagerId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  const router = useRouter();

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      setIsFetchingUsers(true);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setIsFetchingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/gemach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, phone, email, managerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setSuccess('Gemach added successfully!');
        setName('');
        setAddress('');
        setPhone('');
        setEmail('');
        setManagerId('');
        onClose(); // close modal after adding
      }
    } catch {
      setError('Server error. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">Add New Gemach</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <div>
          <label className="block font-medium mb-1">Gemach Manager</label>
          {isFetchingUsers ? (
            <p className="text-gray-500">Loading users...</p>
          ) : (
            <select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              required
              className="border p-2 w-full rounded"
            >
              <option value="">Select a manager</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          )}
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? 'Adding...' : 'Add Gemach'}
          </button>
        </div>
      </form>
    </div>
  );
}

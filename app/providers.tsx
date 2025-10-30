'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SessionProvider>{children}</SessionProvider>;

    </AuthProvider>
  )
}

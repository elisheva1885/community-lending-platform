import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'גמ"ח 2.0 - מערכת ניהול מלאי',
  description: 'מערכת דיגיטלית לניהול מלאי של גמ"ח המאפשרת לקהל הרחב לבצע הזמנות אונליין, ולמנהלים לעקוב ולנהל את הפריטים וההשאלות בזמן אמת.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

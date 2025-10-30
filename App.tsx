
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ItemDetailPage from './pages/ItemDetailPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);
    // Handle link clicks
    const handleLinkClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor && anchor.href && anchor.target !== '_blank') {
            const url = new URL(anchor.href);
            if (url.origin === window.location.origin) {
                e.preventDefault();
                window.history.pushState({}, '', anchor.href);
                onLocationChange();
            }
        }
    };
    document.addEventListener('click', handleLinkClick);


    return () => {
      window.removeEventListener('popstate', onLocationChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const renderPage = () => {
    if (path === '/') {
      return <HomePage />;
    }
    if (path === '/login') {
      return <LoginPage />;
    }
    if (path.startsWith('/item/')) {
        const id = path.split('/')[2];
        return <ItemDetailPage id={id} />;
    }
    if (path === '/my-orders') {
        return <MyOrdersPage />;
    }
    if (path === '/admin') {
        return <AdminDashboard />;
    }
    return <HomePage />; // Fallback to home page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;

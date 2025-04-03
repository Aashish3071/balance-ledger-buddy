
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Wallet } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Wallet Tracker</h1>
          </div>
          <nav className="space-x-4">
            <Link 
              to="/" 
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link 
              to="/transactions" 
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                location.pathname === '/transactions' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="h-4 w-4 mr-1" />
              Transactions
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          Wallet Balance & Transactions Tracker &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout;

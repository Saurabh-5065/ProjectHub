// src/components/layout/MainLayout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Search, Bell, Moon, UserCircle, Menu, X } from 'lucide-react';

// --- AppHeader Component ---
interface AppHeaderProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b bg-white shadow-sm sticky top-0 z-20">
      <div className="flex items-center">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 -ml-2 mr-2 text-gray-600 hover:text-gray-900 focus:outline-none rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-xs hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            id="global-search"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Header Icons */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <Moon size={20} />
        </button>

        <div className="relative">
          <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <Bell size={20} />
          </button>
          <span className="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </div>

        <button className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full">
          <UserCircle size={28} className="text-gray-500 hover:text-gray-700" />
        </button>
      </div>
    </header>
  );
};

// --- Main Layout ---
export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileMenuOpen} />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-25 bg-black/50 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader
          onToggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {/* 🔥 Renders child routes like /dashboard, /projects etc. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

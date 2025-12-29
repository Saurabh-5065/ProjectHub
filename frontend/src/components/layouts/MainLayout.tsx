// src/components/layout/MainLayout.tsx

import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Bell, UserCircle, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

/* ================= AppHeader ================= */

interface AppHeaderProps {
  onToggleMobileMenu: () => void
  isMobileMenuOpen: boolean
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b shadow-sm">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Menu Button */}
        <div className="flex items-center">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {/* Notification dot */}
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* User */}
          <Link to="/profile">
          <button
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="User menu"
          >
            <UserCircle size={30} className="text-gray-600 hover:text-gray-800" />
          </button>
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ================= MainLayout ================= */

export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () =>
    setIsMobileMenuOpen((prev) => !prev)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileMenuOpen} />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          onToggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

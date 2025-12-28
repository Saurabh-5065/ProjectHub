// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import React from 'react';

import {
  LayoutDashboard,
  FolderKanban,
  PlusSquare,
  ListChecks,
  Users,
  CalendarDays,
  MessageSquare,
  Bell,
  LineChart,
  Settings,
  HelpCircle,
  LogOut,
  Briefcase,
} from 'lucide-react';

import type { NavItem } from '../../types';
import { useLogout } from '../../lib/logout'; // ✅ logout hook

const sidebarNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    isActive: true,
  },
  { label: 'My Projects', icon: FolderKanban, href: '/projects' },
  { label: 'Create New Project', icon: PlusSquare, href: '/createProject' },
  { label: 'Tasks', icon: ListChecks, href: '/Tasks' },
  { label: 'Team', icon: Users, href: '/inReview' },
  { label: 'Calendar', icon: CalendarDays, href: '/Calender' },
  { label: 'Messages', icon: MessageSquare, href: '/Message' },
  { label: 'Notifications', icon: Bell, href: '/invitations' },
  { label: 'Reports', icon: LineChart, href: 'Reports' },
];

const sidebarBottomNavItems: NavItem[] = [
  { label: 'Settings', icon: Settings, href: '#' },
  { label: 'Help', icon: HelpCircle, href: '#' },
  { label: 'Logout', icon: LogOut, href: '#' },
];

export interface SidebarProps {
  isMobileOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen }) => {
  const logout = useLogout(); // ✅ Call the custom logout hook

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white flex flex-col h-screen
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:shrink-0
      `}
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="p-6 flex items-center space-x-3 border-b border-gray-700">
        <Briefcase size={32} className="text-indigo-500" />
        <div>
          <h1 className="text-xl font-semibold">ProjectHub</h1>
          <p className="text-xs text-gray-400">Project Management</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto hide-scrollbar">
        <p className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
          Main Navigation
        </p>
        {sidebarNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium
              ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-1 mt-auto">
        {sidebarBottomNavItems.map((item) => {
          if (item.label === 'Logout') {
            return (
              <button
                key={item.label}
                onClick={logout}
                className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
};

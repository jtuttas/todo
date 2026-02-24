import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, CheckSquare, Users, FolderOpen, Tag, LogOut, Menu, ListTodo, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import type { User } from '../types';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface SidebarProps {
  navItems: NavItem[];
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
}

function Sidebar({ navItems, user, onClose, onLogout }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <img src="/todo/logo.png" alt="Logo" className="h-10 object-contain" />
        <button onClick={onClose} className="md:hidden p-1 rounded hover:bg-gray-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              )
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-200">
        <div className="px-3 py-1 text-xs text-gray-500 truncate mb-1">{user?.username} ({user?.role})</div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-accent transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Abmelden</span>
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems: NavItem[] = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/tasks', label: 'Meine Aufgaben', icon: CheckSquare },
    ...(user?.role === 'Abteilungsleiter' || user?.role === 'Administrator' ? [
      { to: '/team/tasks', label: 'Team-Aufgaben', icon: ListTodo },
      { to: '/tasks/new', label: 'Neue Aufgabe', icon: Plus },
      { to: '/projects', label: 'Projekte', icon: FolderOpen },
      { to: '/priorities', label: 'Prioritäten', icon: Tag },
    ] : []),
    ...(user?.role === 'Administrator' ? [
      { to: '/admin/users', label: 'Benutzerverwaltung', icon: Users },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30">
        <Sidebar navItems={navItems} user={user} onClose={() => {}} onLogout={handleLogout} />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 inset-y-0 w-60 bg-white shadow-xl z-50">
            <Sidebar navItems={navItems} user={user} onClose={() => setMobileOpen(false)} onLogout={handleLogout} />
          </aside>
        </div>
      )}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-1 rounded-lg hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <img src="/todo/logo.png" alt="Logo" className="h-8 object-contain" />
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

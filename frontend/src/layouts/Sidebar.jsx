import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { hasRole } = useAuth();

  const menuItems = [
    {
      path: '/',
      icon: LayoutDashboard,
      label: 'Tableau de bord',
      roles: ['Administrateur', 'Medecin', 'Secretaire'],
    },
    {
      path: '/patients',
      icon: Users,
      label: 'Patients',
      roles: ['Administrateur', 'Medecin', 'Secretaire'],
    },
    {
      path: '/rendezvous',
      icon: Calendar,
      label: 'Rendez-vous',
      roles: ['Administrateur', 'Medecin', 'Secretaire'],
    },
  ];

  // Filtrer les items selon les rôles
  const availableItems = menuItems.filter(item =>
    item.roles.some(role => hasRole(role))
  );

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header mobile */}
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {availableItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Version 1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
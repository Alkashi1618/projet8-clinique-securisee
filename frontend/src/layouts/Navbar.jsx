import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';
import Badge from '../components/ui/Badge';

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      'Administrateur': 'danger',
      'Medecin': 'info',
      'Secretaire': 'success',
      'Utilisateur': 'default',
    };
    return variants[role] || 'default';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et menu mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">
                🏥 Gestion Clinique
              </h1>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
                <div className="flex gap-1 justify-end">
                  {user?.roles?.map((role, index) => (
                    <Badge
                      key={index}
                      variant={getRoleBadgeVariant(role)}
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
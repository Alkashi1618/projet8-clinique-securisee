import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ErrorMessage from '../components/common/ErrorMessage';
import { LogIn, Stethoscope } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    // Tentative de connexion
    const result = await login(formData.username, formData.password);

    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Stethoscope className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion Clinique
          </h1>
          <p className="text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Formulaire */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <ErrorMessage
                message={error}
                onClose={() => setError('')}
              />
            )}

            <Input
              label="Nom d'utilisateur"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Entrez votre nom d'utilisateur"
              autoComplete="username"
            />

            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              icon={LogIn}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/* Info comptes démo */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-2">
              Comptes de démonstration
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>👨‍⚕️ Médecin: <code className="bg-gray-100 px-1 rounded">medecin1</code></p>
              <p>👩‍💼 Secrétaire: <code className="bg-gray-100 px-1 rounded">secretaire1</code></p>
              <p>🔑 Mot de passe: <code className="bg-gray-100 px-1 rounded">password123</code></p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2025 Gestion Clinique - Projet Python
        </p>
      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { patientsAPI, rendezvousAPI } from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { formatDate, formatTime } from '../utils/helpers';
import { RDV_STATUS_LABELS, RDV_STATUS_VARIANTS } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalRendezVous: 0,
    rdvPlanifies: 0,
    rdvTermines: 0,
    rdvAnnules: 0,
  });
  const [recentRdv, setRecentRdv] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Charger patients et rendez-vous
      const [patientsRes, rdvRes] = await Promise.all([
        patientsAPI.getAll(),
        rendezvousAPI.getAll(),
      ]);

      const patients = patientsRes.data;
      const rendezvous = rdvRes.data;

      // Calculer les statistiques
      setStats({
        totalPatients: patients.length,
        totalRendezVous: rendezvous.length,
        rdvPlanifies: rendezvous.filter(r => r.statut === 'planifie').length,
        rdvTermines: rendezvous.filter(r => r.statut === 'termine').length,
        rdvAnnules: rendezvous.filter(r => r.statut === 'annule').length,
      });

      // Rendez-vous récents (5 derniers)
      const sorted = [...rendezvous]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setRecentRdv(sorted);

    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Rendez-vous',
      value: stats.totalRendezVous,
      icon: Calendar,
      color: 'bg-purple-500',
      trend: '+8%',
    },
    {
      title: 'Planifiés',
      value: stats.rdvPlanifies,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Terminés',
      value: stats.rdvTermines,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="text-gray-600 mt-1">
          Bienvenue, {user?.username}
        </p>
      </div>

      {error && (
        <ErrorMessage message={error} onClose={() => setError('')} />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                {stat.trend && (
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-xs text-green-500">{stat.trend}</span>
                  </div>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Rendez-vous récents */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Rendez-vous récents
          </h2>
          <button
            onClick={() => navigate('/rendezvous')}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            Voir tout <ArrowRight size={16} />
          </button>
        </div>

        {recentRdv.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucun rendez-vous pour le moment
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Heure
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentRdv.map((rdv) => (
                  <tr
                    key={rdv.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm">
                      {rdv.patient}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatDate(rdv.date)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatTime(rdv.heure)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={RDV_STATUS_VARIANTS[rdv.statut]}>
                        {RDV_STATUS_LABELS[rdv.statut]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carte Patients */}
        <button
          onClick={() => navigate('/patients')}
          className="text-left w-full"
        >
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-lg flex-shrink-0">
                <Users className="text-blue-600" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Gérer les patients
                </h3>
                <p className="text-sm text-gray-600">
                  Ajouter, modifier ou consulter les patients
                </p>
              </div>
              <ArrowRight className="text-gray-400 flex-shrink-0" size={24} />
            </div>
          </Card>
        </button>

        {/* Carte Rendez-vous */}
        <button
          onClick={() => navigate('/rendezvous')}
          className="text-left w-full"
        >
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-lg flex-shrink-0">
                <Calendar className="text-purple-600" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Gérer les rendez-vous
                </h3>
                <p className="text-sm text-gray-600">
                  Planifier et suivre les rendez-vous
                </p>
              </div>
              <ArrowRight className="text-gray-400 flex-shrink-0" size={24} />
            </div>
          </Card>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
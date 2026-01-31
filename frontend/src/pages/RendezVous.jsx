import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { rendezvousAPI, patientsAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RendezVousModal from '../components/rendezvous/RendezVousModal';
import {
  Plus,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { formatDate, formatTime, handleAPIError } from '../utils/helpers';
import {
  RDV_STATUS_LABELS,
  RDV_STATUS_VARIANTS,
  MESSAGES
} from '../utils/constants';

const RendezVous = () => {
  const { hasRole } = useAuth();
  const [rendezvous, setRendezVous] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [filterStatut, setFilterStatut] = useState('all');

  const canEdit = hasRole('Administrateur') || hasRole('Secretaire');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rdvRes, patientsRes] = await Promise.all([
        rendezvousAPI.getAll(),
        patientsAPI.getAll(),
      ]);
      setRendezVous(rdvRes.data);
      setPatients(patientsRes.data);
      setMedecins([]); // À adapter selon votre API
      setError('');
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddRdv = () => {
    setSelectedRdv(null);
    setModalOpen(true);
  };

  const handleEditRdv = (rdv) => {
    setSelectedRdv(rdv);
    setModalOpen(true);
  };

  const handleDeleteRdv = async (rdv) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      return;
    }

    try {
      await rendezvousAPI.delete(rdv.id);
      setSuccess(MESSAGES.SUCCESS.RDV_DELETED);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleAPIError(err));
    }
  };

  const handleUpdateStatut = async (rdv, newStatut) => {
    try {
      await rendezvousAPI.updateStatus(rdv.id, newStatut);
      setSuccess('Statut mis à jour avec succès');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleAPIError(err));
    }
  };

  const handleSubmitRdv = async (data) => {
    try {
      if (selectedRdv) {
        await rendezvousAPI.update(selectedRdv.id, data);
        setSuccess(MESSAGES.SUCCESS.RDV_UPDATED);
      } else {
        await rendezvousAPI.create(data);
        setSuccess(MESSAGES.SUCCESS.RDV_CREATED);
      }
      loadData();
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      throw err;
    }
  };

  const getPatientInfo = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.matricule} - ${patient.nom} ${patient.prenom}` : `Patient #${patientId}`;
  };

  const filteredRendezVous = rendezvous.filter(rdv => {
    if (filterStatut === 'all') return true;
    return rdv.statut === filterStatut;
  });

  // Grouper par date
  const groupedRdv = filteredRendezVous.reduce((acc, rdv) => {
    const date = rdv.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(rdv);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedRdv).sort((a, b) =>
    new Date(b) - new Date(a)
  );

  if (loading) {
    return <LoadingSpinner message="Chargement des rendez-vous..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rendez-vous</h1>
          <p className="text-gray-600 mt-1">
            {rendezvous.length} rendez-vous enregistré{rendezvous.length > 1 ? 's' : ''}
          </p>
        </div>

        {canEdit && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleAddRdv}
          >
            Nouveau rendez-vous
          </Button>
        )}
      </div>

      {/* Messages */}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && (
        <ErrorMessage
          message={success}
          type="success"
          onClose={() => setSuccess('')}
        />
      )}

      {/* Filtres */}
      <Card>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtrer par statut:</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatut('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatut === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({rendezvous.length})
            </button>
            <button
              onClick={() => setFilterStatut('planifie')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatut === 'planifie'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Planifiés ({rendezvous.filter(r => r.statut === 'planifie').length})
            </button>
            <button
              onClick={() => setFilterStatut('termine')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatut === 'termine'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Terminés ({rendezvous.filter(r => r.statut === 'termine').length})
            </button>
            <button
              onClick={() => setFilterStatut('annule')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatut === 'annule'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annulés ({rendezvous.filter(r => r.statut === 'annule').length})
            </button>
          </div>
        </div>
      </Card>

      {/* Liste des rendez-vous */}
      {filteredRendezVous.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              Aucun rendez-vous trouvé
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <Card key={date}>
              <div className="mb-4 pb-3 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  {formatDate(date)}
                </h2>
                <p className="text-sm text-gray-500">
                  {groupedRdv[date].length} rendez-vous
                </p>
              </div>

              <div className="space-y-3">
                {groupedRdv[date]
                  .sort((a, b) => a.heure.localeCompare(b.heure))
                  .map(rdv => (
                    <div
                      key={rdv.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg">
                          <div className="text-center">
                            <p className="text-xl font-bold text-blue-600">
                              {formatTime(rdv.heure)}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {getPatientInfo(rdv.patient)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Dr. Médecin #{rdv.medecin}
                          </p>
                        </div>

                        <Badge variant={RDV_STATUS_VARIANTS[rdv.statut]}>
                          {RDV_STATUS_LABELS[rdv.statut]}
                        </Badge>
                      </div>

                      {canEdit && (
                        <div className="flex gap-2 ml-4">
                          {rdv.statut === 'planifie' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatut(rdv, 'termine')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Marquer comme terminé"
                              >
                                <CheckCircle size={20} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatut(rdv, 'annule')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Annuler"
                              >
                                <XCircle size={20} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEditRdv(rdv)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteRdv(rdv)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <RendezVousModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitRdv}
        rendezvous={selectedRdv}
        patients={patients}
        medecins={medecins}
      />
    </div>
  );
};

export default RendezVous;
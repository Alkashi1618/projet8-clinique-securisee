import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
//import { patientsAPI, authAPI } from '../services/api';
import { patientsAPI, usersAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import PatientModal from '../components/patients/PatientModal';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  Stethoscope
} from 'lucide-react';
import { handleAPIError } from '../utils/helpers';
import { MESSAGES } from '../utils/constants';

const Patients = () => {
  const { hasRole } = useAuth();
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const canEdit = hasRole('Administrateur') || hasRole('Secretaire');

  useEffect(() => {
    loadPatients();
    loadMedecins();
  }, []);

  const loadPatients = async () => {
      try {
          setLoading(true);
          const response = await patientsAPI.getAll();
          setPatients(response.data);
          setError('');
          } catch (err) {
              setError(handleAPIError(err));
              } finally {
                  setLoading(false);
          }

  };

  const loadMedecins = async () => {
      try {
          const response = await usersAPI.getMedecins();
          setMedecins(response.data);
      } catch (err) {
        console.error('Erreur chargement médecins:', err);
      }
  };


  const handleAddPatient = () => {
    setSelectedPatient(null);
    setModalOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const handleDeletePatient = async (patient) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${patient.nom} ${patient.prenom} ?`)) {
      return;
    }

    try {
      await patientsAPI.delete(patient.id);
      setSuccess(MESSAGES.SUCCESS.PATIENT_DELETED);
      loadPatients();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleAPIError(err));
    }
  };

  const handleSubmitPatient = async (data) => {
    try {
      if (selectedPatient) {
        await patientsAPI.update(selectedPatient.id, data);
        setSuccess(MESSAGES.SUCCESS.PATIENT_UPDATED);
      } else {
        await patientsAPI.create(data);
        setSuccess(MESSAGES.SUCCESS.PATIENT_CREATED);
      }
      loadPatients();
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      throw err;
    }
  };

  const filteredPatients = patients.filter(patient => {
    const search = searchTerm.toLowerCase();
    return (
      patient.matricule.toLowerCase().includes(search) ||
      patient.nom.toLowerCase().includes(search) ||
      patient.prenom.toLowerCase().includes(search) ||
      (patient.telephone && patient.telephone.includes(search)) ||
      (patient.email && patient.email.toLowerCase().includes(search))
    );
  });

  if (loading) {
    return <LoadingSpinner message="Chargement des patients..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">
            {patients.length} patient{patients.length > 1 ? 's' : ''} enregistré{patients.length > 1 ? 's' : ''}
          </p>
        </div>

        {canEdit && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleAddPatient}
          >
            Nouveau patient
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

      {/* Recherche */}
      <Card>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher par matricule, nom, prénom, téléphone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Liste des patients */}
      {filteredPatients.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <User className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Aucun patient trouvé' : 'Aucun patient enregistré'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {patient.nom} {patient.prenom}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {patient.matricule}
                      </p>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="space-y-2 text-sm">
                  {patient.telephone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      <span>{patient.telephone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  )}
                  {patient.medecin && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Stethoscope size={16} />
                      <span>Dr. {patient.medecin}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Ajouté le {new Date(patient.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <PatientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitPatient}
        patient={selectedPatient}
        medecins={medecins}
      />
    </div>
  );
};

export default Patients;
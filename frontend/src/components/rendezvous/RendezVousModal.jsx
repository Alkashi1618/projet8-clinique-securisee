import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ErrorMessage from '../common/ErrorMessage';
import { Save, X } from 'lucide-react';

const RendezVousModal = ({
  isOpen,
  onClose,
  onSubmit,
  rendezvous = null,
  patients = [],
  medecins = []
}) => {
  const [formData, setFormData] = useState({
    patient: '',
    medecin: '',
    date: '',
    heure: '',
    statut: 'planifie',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rendezvous) {
      setFormData({
        patient: rendezvous.patient || '',
        medecin: rendezvous.medecin || '',
        date: rendezvous.date || '',
        heure: rendezvous.heure || '',
        statut: rendezvous.statut || 'planifie',
      });
    } else {
      setFormData({
        patient: '',
        medecin: '',
        date: '',
        heure: '',
        statut: 'planifie',
      });
    }
    setErrors({});
  }, [rendezvous, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.patient) {
      newErrors.patient = 'Sélectionnez un patient';
    }
    if (!formData.medecin) {
      newErrors.medecin = 'Sélectionnez un médecin';
    }
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }
    if (!formData.heure) {
      newErrors.heure = "L'heure est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rendezvous ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Patient *
            </label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring
                ${errors.patient ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <option value="">Sélectionner un patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.matricule} - {patient.nom} {patient.prenom}
                </option>
              ))}
            </select>
            {errors.patient && (
              <p className="text-sm text-red-500">{errors.patient}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Médecin *
            </label>
            <select
              name="medecin"
              value={formData.medecin}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring
                ${errors.medecin ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <option value="">Sélectionner un médecin</option>
              {medecins.map((medecin) => (
                <option key={medecin.id} value={medecin.id}>
                  Dr. {medecin.username}
                </option>
              ))}
            </select>
            {errors.medecin && (
              <p className="text-sm text-red-500">{errors.medecin}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date *"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
          />

          <Input
            label="Heure *"
            name="heure"
            type="time"
            value={formData.heure}
            onChange={handleChange}
            error={errors.heure}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring"
          >
            <option value="planifie">Planifié</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            icon={X}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            icon={Save}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RendezVousModal;
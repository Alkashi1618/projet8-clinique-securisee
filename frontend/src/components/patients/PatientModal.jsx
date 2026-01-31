import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ErrorMessage from '../common/ErrorMessage';
import { Save, X } from 'lucide-react';

const PatientModal = ({
  isOpen,
  onClose,
  onSubmit,
  patient = null,
  medecins = []
}) => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    medecin: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        matricule: patient.matricule || '',
        nom: patient.nom || '',
        prenom: patient.prenom || '',
        telephone: patient.telephone || '',
        email: patient.email || '',
        medecin: patient.medecin || '',
      });
    } else {
      setFormData({
        matricule: '',
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        medecin: '',
      });
    }
    setErrors({});
  }, [patient, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    }
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (formData.telephone && !/^[0-9\s\-+]{9,}$/.test(formData.telephone)) {
      newErrors.telephone = 'Numéro de téléphone invalide';
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
      title={patient ? 'Modifier le patient' : 'Nouveau patient'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Matricule *"
            name="matricule"
            value={formData.matricule}
            onChange={handleChange}
            error={errors.matricule}
            placeholder="Ex: PAT001"
            disabled={!!patient}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Médecin traitant
            </label>
            <select
              name="medecin"
              value={formData.medecin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring"
            >
              <option value="">Sélectionner un médecin</option>
              {medecins.map((medecin) => (
                <option key={medecin.id} value={medecin.id}>
                  Dr. {medecin.prenom} {medecin.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom *"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            error={errors.nom}
            placeholder="Ex: Diallo"
          />

          <Input
            label="Prénom *"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            error={errors.prenom}
            placeholder="Ex: Amadou"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            error={errors.telephone}
            placeholder="Ex: +221 77 123 45 67"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Ex: patient@email.com"
          />
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

export default PatientModal;
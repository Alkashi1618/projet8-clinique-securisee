// ====== STATUTS RENDEZ-VOUS ======
export const RDV_STATUS = {
  PLANIFIE: 'planifie',
  ANNULE: 'annule',
  TERMINE: 'termine',
};

export const RDV_STATUS_LABELS = {
  planifie: 'Planifié',
  annule: 'Annulé',
  termine: 'Terminé',
};

export const RDV_STATUS_VARIANTS = {
  planifie: 'info',
  annule: 'danger',
  termine: 'success',
};

// ====== ROLES UTILISATEURS ======
export const USER_ROLES = {
  ADMIN: 'Administrateur',
  MEDECIN: 'Medecin',
  SECRETAIRE: 'Secretaire',
  UTILISATEUR: 'Utilisateur',
};

// ====== MESSAGES ======
export const MESSAGES = {
  SUCCESS: {
    PATIENT_CREATED: 'Patient ajouté avec succès',
    PATIENT_UPDATED: 'Patient modifié avec succès',
    PATIENT_DELETED: 'Patient supprimé avec succès',
    RDV_CREATED: 'Rendez-vous créé avec succès',
    RDV_UPDATED: 'Rendez-vous modifié avec succès',
    RDV_DELETED: 'Rendez-vous supprimé avec succès',
  },
  ERROR: {
    GENERIC: 'Une erreur est survenue',
    NETWORK: 'Erreur de connexion au serveur',
    UNAUTHORIZED: 'Accès non autorisé',
    NOT_FOUND: 'Ressource non trouvée',
  },
};

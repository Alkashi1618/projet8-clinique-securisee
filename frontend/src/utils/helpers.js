// ===== FORMAT DATE =====
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// ===== FORMAT HEURE =====
export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.slice(0, 5);
};

// ===== VALIDATION EMAIL =====
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ===== VALIDATION TELEPHONE =====
export const isValidPhone = (phone) => {
  const regex = /^(\+221|221)?[0-9\s\-]{9,}$/;
  return regex.test(phone);
};

// ===== INITIALS =====
export const getInitials = (nom, prenom) => {
  return `${nom?.[0] || ''}${prenom?.[0] || ''}`.toUpperCase();
};

// ===== GESTION ERREURS API =====
export const handleAPIError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    if (status === 401) return 'Session expirée. Veuillez vous reconnecter.';
    if (status === 403) return 'Permissions insuffisantes.';
    if (status === 404) return 'Ressource non trouvée.';
    if (status === 500) return 'Erreur serveur.';
    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
  }

  if (error.request) {
    return 'Impossible de contacter le serveur.';
  }

  return 'Erreur inattendue.';
};

// ===== DEBOUNCE =====
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

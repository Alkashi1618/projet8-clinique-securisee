# 🏥 Système de Gestion de Clinique

Application complète de gestion d'une clinique développée avec Django REST Framework (backend) et React (frontend).

## 📋 Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [API Endpoints](#api-endpoints)
- [Captures d'écran](#captures-décran)
- [Auteur](#auteur)

## 📖 Description

Ce projet est une application web de gestion de clinique permettant de gérer les patients, les rendez-vous et les utilisateurs (médecins et secrétaires). Il a été développé dans le cadre d'un projet académique pour renforcer les compétences en développement full-stack.

### Objectifs pédagogiques

- Organisation modulaire du code
- Gestion des erreurs et exceptions
- Contrôle des saisies utilisateurs
- Stockage dans une base de données relationnelle (PostgreSQL)
- Mise en place de rôles utilisateurs distincts
- Implémentation d'une API REST
- Interface utilisateur moderne et responsive

## ✨ Fonctionnalités

### Gestion des patients
- ✅ Créer, modifier, supprimer des patients
- ✅ Recherche de patients (matricule, nom, prénom, téléphone, email)
- ✅ Attribution d'un médecin traitant
- ✅ Affichage des informations détaillées

### Gestion des rendez-vous
- ✅ Planifier des rendez-vous
- ✅ Modifier et supprimer des rendez-vous
- ✅ Filtrer par statut (Planifié, Terminé, Annulé)
- ✅ Groupement par date
- ✅ Changement rapide de statut

### Authentification et autorisation
- ✅ Connexion JWT
- ✅ Gestion des rôles (Administrateur, Médecin, Secrétaire)
- ✅ Permissions basées sur les rôles
- ✅ Refresh token automatique

### Interface utilisateur
- ✅ Design moderne et responsive
- ✅ Tableau de bord avec statistiques
- ✅ Navigation intuitive
- ✅ Messages de feedback utilisateur
- ✅ Modals pour les formulaires

## 🛠 Technologies utilisées

### Backend
- **Django 6.0.1** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de données
- **Simple JWT** - Authentification JWT
- **CORS Headers** - Gestion CORS

### Frontend
- **React 19.2.4** - Bibliothèque UI
- **React Router DOM** - Routing
- **Axios** - Client HTTP
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes
- **Context API** - State management

## 📁 Structure du projet

```
projet-clinique/
│
├── backend/                    # Application Django
│   ├── accounts/              # App principale
│   │   ├── migrations/        # Migrations de base de données
│   │   ├── admin.py           # Configuration admin Django
│   │   ├── models.py          # Modèles Patient et RendezVous
│   │   ├── serializers.py     # Sérialiseurs DRF
│   │   ├── views.py           # Vues de l'API
│   │   ├── permissions.py     # Permissions personnalisées
│   │   └── urls.py            # Routes de l'app
│   │
│   ├── backend/               # Configuration du projet
│   │   ├── settings.py        # Paramètres Django
│   │   ├── urls.py            # Routes principales
│   │   └── wsgi.py            # Point d'entrée WSGI
│   │
│   └── manage.py              # Script de gestion Django
│
├── frontend/                  # Application React
│   ├── public/                # Fichiers statiques
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── common/        # Composants communs
│   │   │   ├── patients/      # Composants patients
│   │   │   ├── rendezvous/    # Composants RDV
│   │   │   └── ui/            # Composants UI de base
│   │   │
│   │   ├── contexts/          # Context API (Auth)
│   │   ├── layouts/           # Layouts (Layout, Sidebar, Navbar)
│   │   ├── pages/             # Pages principales
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Patients.jsx
│   │   │   └── RendezVous.jsx
│   │   │
│   │   ├── services/          # Services API
│   │   ├── utils/             # Utilitaires
│   │   ├── App.js             # Composant racine
│   │   └── index.js           # Point d'entrée
│   │
│   ├── package.json           # Dépendances npm
│   └── tailwind.config.js     # Configuration Tailwind
│
└── README.md                  # Ce fichier
```

## 🚀 Installation

### Prérequis

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Cloner le dépôt

```bash
git clone https://github.com/[username]/projet-clinique-python-2025-NomPrenom.git
cd projet-clinique-python-2025-NomPrenom
```

### 2. Configuration du Backend

```bash
# Créer un environnement virtuel
cd backend
python -m venv venv

# Activer l'environnement virtuel
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Installer les dépendances
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary

# Créer la base de données PostgreSQL
# Dans psql :
CREATE DATABASE gest_users;
CREATE USER postgres WITH PASSWORD 'azertyuiop';
GRANT ALL PRIVILEGES ON DATABASE gest_users TO postgres;

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Créer les groupes de rôles
python manage.py shell
>>> from django.contrib.auth.models import Group
>>> Group.objects.create(name='Administrateur')
>>> Group.objects.create(name='Medecin')
>>> Group.objects.create(name='Secretaire')
>>> exit()

# Lancer le serveur
python manage.py runserver
```

### 3. Configuration du Frontend

```bash
# Ouvrir un nouveau terminal
cd frontend

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **Admin Django** : http://localhost:8000/admin

## 📝 Utilisation

### Connexion

Pour tester l'application, créez des utilisateurs de test :

1. Connectez-vous à l'admin Django : http://localhost:8000/admin
2. Créez des utilisateurs et assignez-les aux groupes appropriés

**Comptes de démonstration** :
- **Username** : medecin1 | **Password** : password123 | **Rôle** : Médecin
- **Username** : secretaire1 | **Password** : password123 | **Rôle** : Secrétaire

### Permissions par rôle

| Fonctionnalité | Administrateur | Médecin | Secrétaire |
|----------------|----------------|---------|------------|
| Voir patients | ✅ | ✅ | ✅ |
| Créer patients | ✅ | ❌ | ✅ |
| Modifier patients | ✅ | ❌ | ✅ |
| Supprimer patients | ✅ | ❌ | ✅ |
| Voir rendez-vous | ✅ | ✅ | ✅ |
| Créer rendez-vous | ✅ | ❌ | ✅ |
| Modifier rendez-vous | ✅ | ❌ | ✅ |
| Supprimer rendez-vous | ✅ | ❌ | ✅ |

## 🔌 API Endpoints

### Authentification

```
POST   /api/login/              - Connexion (obtenir les tokens)
POST   /api/token/refresh/      - Rafraîchir le token
GET    /api/me/                 - Informations utilisateur connecté
```

### Patients

```
GET    /api/patients/           - Liste des patients
POST   /api/patients/           - Créer un patient (Admin/Secrétaire)
GET    /api/patients/{id}/      - Détails d'un patient
PUT    /api/patients/{id}/      - Modifier un patient (Admin/Secrétaire)
DELETE /api/patients/{id}/      - Supprimer un patient (Admin/Secrétaire)
```

### Rendez-vous

```
GET    /api/rendezvous/         - Liste des rendez-vous
POST   /api/rendezvous/         - Créer un rendez-vous (Admin/Secrétaire)
PATCH  /api/rendezvous/         - Mettre à jour le statut (Admin/Secrétaire)
DELETE /api/rendezvous/{id}/    - Supprimer un rendez-vous (Admin/Secrétaire)
```

### Exemple de requête

```javascript
// Connexion
POST http://localhost:8000/api/login/
Content-Type: application/json

{
  "username": "secretaire1",
  "password": "password123"
}

// Réponse
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

// Créer un patient
POST http://localhost:8000/api/patients/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "matricule": "PAT001",
  "nom": "Diallo",
  "prenom": "Amadou",
  "telephone": "+221 77 123 45 67",
  "email": "amadou@email.com",
  "medecin": 1
}
```

## 🎨 Captures d'écran

### Page de connexion
Interface de connexion moderne avec validation des champs.

### Tableau de bord
Vue d'ensemble avec statistiques et rendez-vous récents.

### Gestion des patients
Liste des patients avec recherche et actions CRUD.

### Gestion des rendez-vous
Planification et suivi des rendez-vous par date.

## 🧪 Tests

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

## 📦 Dépendances principales

### Backend (`requirements.txt`)
```
Django==6.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
```

### Frontend (`package.json`)
```json
{
  "react": "^19.2.4",
  "react-router-dom": "^6.21.1",
  "axios": "^1.6.5",
  "tailwindcss": "^3.4.19",
  "lucide-react": "^0.563.0"
}
```

## 🔒 Sécurité

- ✅ Authentification JWT avec refresh token
- ✅ Permissions basées sur les rôles
- ✅ Protection CSRF
- ✅ CORS configuré
- ✅ Validation des données côté backend et frontend
- ✅ Mots de passe hashés (Django)

## 🚧 Améliorations futures

- [ ] Historique médical des patients
- [ ] Notifications par email/SMS
- [ ] Calendrier visuel des rendez-vous
- [ ] Export PDF des données
- [ ] Statistiques avancées
- [ ] Application mobile
- [ ] Tests unitaires et d'intégration complets

## 👨‍💻 Auteur

**[Votre Nom]**
- GitHub: [@votreusername](https://github.com/votreusername)
- Email: votre.email@example.com

## 📄 Licence

Ce projet est développé dans un cadre académique.

## 🙏 Remerciements

- Professeur : @diankhitek
- Framework Django et React
- Communauté open source

---

**Note** : Ce projet est réalisé dans le cadre d'un exercice pédagogique. Il peut contenir des simplifications et ne doit pas être utilisé en production sans modifications appropriées.
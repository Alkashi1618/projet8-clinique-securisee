import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import RendezVous from './pages/RendezVous';

// Layout
import Layout from './layouts/Layout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<Login />} />

          {/* Routes protégées */}
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/patients"
            element={
              <Layout>
                <Patients />
              </Layout>
            }
          />
          <Route
            path="/rendezvous"
            element={
              <Layout>
                <RendezVous />
              </Layout>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
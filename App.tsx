
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import RemindersPage from './pages/RemindersPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';
import ServicesPage from './pages/ServicesPage';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:clientId" element={<ClientDetailPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
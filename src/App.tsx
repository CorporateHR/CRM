import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Leads from './pages/Leads';
import Products from './pages/Products';
import Workspace from './pages/Workspace';
import RoleManagement from './pages/RoleManagement';
import UserRoles from './pages/UserRoles';
import Layout from './components/Layout';
import { LeadsProvider } from './context/LeadsContext';
import { ToastProvider } from './context/ToastContext';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <TaskProvider>
          <LeadsProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/products" element={<Products />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/roles" element={<RoleManagement />} />
                <Route path="/user-roles" element={<UserRoles />} />
              </Route>
            </Routes>
          </LeadsProvider>
        </TaskProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
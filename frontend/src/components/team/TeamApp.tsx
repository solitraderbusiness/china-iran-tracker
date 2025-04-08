import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import TeamLogin from './TeamLogin';
import TeamDashboard from './TeamDashboard';
import TeamProjectDetail from './TeamProjectDetail';
import TeamHeader from './TeamHeader';

// Protected route component for team members
const TeamProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isTeamMember } = useAuth();
  
  if (!isAuthenticated || !isTeamMember) {
    return <Navigate to="/team/login" />;
  }
  
  return <>{children}</>;
};

function TeamApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeamHeader />
      <main className="pt-16">
        <Routes>
          <Route path="/login" element={<TeamLogin />} />
          <Route 
            path="/dashboard" 
            element={
              <TeamProtectedRoute>
                <TeamDashboard />
              </TeamProtectedRoute>
            } 
          />
          <Route 
            path="/projects/:projectId" 
            element={
              <TeamProtectedRoute>
                <TeamProjectDetail />
              </TeamProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/team/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}

export default TeamApp;

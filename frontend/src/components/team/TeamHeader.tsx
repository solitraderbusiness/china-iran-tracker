import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TeamHeader = () => {
  const { isAuthenticated, isTeamMember, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/team/login');
  };

  return (
    <header className="bg-indigo-700 shadow fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/team" className="flex items-center">
              <span className="text-xl font-bold text-white">China-Iran Tracker | Team Portal</span>
            </Link>
          </div>
          
          {isAuthenticated && isTeamMember ? (
            <nav className="flex items-center space-x-4">
              <Link to="/team/dashboard" className="text-white hover:text-indigo-200">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-indigo-200"
              >
                Logout
              </button>
            </nav>
          ) : (
            <nav className="flex items-center space-x-4">
              <Link to="/team/login" className="text-white hover:text-indigo-200">
                Team Login
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default TeamHeader;

import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isTeamMember: boolean;
  login: (token: string, isTeam: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isTeamMember, setIsTeamMember] = useState<boolean>(
    localStorage.getItem('isTeam') === 'true'
  );

  const login = (token: string, isTeam: boolean) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isTeam', String(isTeam));
    setToken(token);
    setIsTeamMember(isTeam);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isTeam');
    setToken(null);
    setIsTeamMember(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isTeamMember,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

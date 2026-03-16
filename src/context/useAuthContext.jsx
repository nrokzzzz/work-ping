import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/helpers/httpClient';

const AuthContext = createContext(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [is2FAAuthnticator, setIs2FAAuthnticator] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  const verifySession = async () => {
    try {
      const res = await axiosClient.get('/verify-cookie', { silent: true });
      if (res.data?.data?.twoFactorEnabled) {
        setIs2FAAuthnticator(false);
      }
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    verifySession();
  }, []);

  const login = async () => {
    await verifySession();
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const signUp = async () => {
    await verifySession();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authLoading,
        login,
        signUp,
        logout,
        is2FAAuthnticator,
        setIs2FAAuthnticator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

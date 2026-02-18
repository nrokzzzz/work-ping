import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

const authSessionKey = '_REBACK_AUTH_KEY_';

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const getSession = () => {
    try {
      const fetchedCookie = getCookie(authSessionKey)?.toString();
      if (!fetchedCookie) return undefined;
      return JSON.parse(fetchedCookie);
    } catch (err) {
      console.error('Invalid session cookie');
      return undefined;
    }
  };

  const [user, setUser] = useState(getSession());

  const saveSession = (userData) => {
    setCookie(authSessionKey, JSON.stringify(userData), {
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    setUser(userData);
  };

  const removeSession = () => {
    deleteCookie(authSessionKey);
    setUser(undefined);
    navigate('/auth/sign-in');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,   // ✅ Correct way
        saveSession,
        removeSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

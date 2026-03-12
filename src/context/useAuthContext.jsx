import { deleteCookie, getCookie, setCookie } from 'cookies-next';
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

const authSessionKey = '_REBACK_AUTH_KEY_';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [is2FAAuthnticator,setIs2FAAuthnticator] = useState(true);
  const fetch = async()=>{
    try{
      const res = await axiosClient.get('/verify-cookie');
      if(res.data.twoFactorEnabled){
        setIs2FAAuthnticator(false);
      }
      setIsAuthenticated(true)
      console.log(res);
     
    }catch(error){
      console.log(error)
      setIsAuthenticated(false)
    }
    
  }
  useEffect(()=>{
    fetch();
  },[])

  const login = ()=>{
    fetch()
    setIsAuthenticated(true)
  }

  const logout=()=>{
    setIsAuthenticated(false)
  }

  const signUp=()=>{
    fetch()
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        signUp,
        logout,
        is2FAAuthnticator,
        setIs2FAAuthnticator
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

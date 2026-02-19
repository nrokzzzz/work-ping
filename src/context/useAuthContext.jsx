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

  useEffect(()=>{
    const fetch = async()=>{
      try{
        const res = await axiosClient.get('/verify-cookie');
        if(res.status==200){
          setIsAuthenticated(true)
        }else{
          setIsAuthenticated(false)
        }
      }catch(error){
        console.log(error)
        setIsAuthenticated(false)
      }
      
    }
    fetch();
  },[])

  const login = ()=>{
    setIsAuthenticated(true)
  }

  const logout=()=>{
    setIsAuthenticated(false)
  }

  const signUp=()=>{
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        signUp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DEFAULT_PAGE_TITLE } from '@/context/constants';
import { AuthProvider } from '@/context/useAuthContext';
import { LayoutProvider } from '@/context/useLayoutContext';
import { NotificationProvider } from '@/context/useNotificationContext';
import { HelmetProvider } from 'react-helmet-async';
import { TwoFAProvider } from '@/context/useVerification2FA';
const handleChangeTitle = () => {
  if (document.visibilityState == 'hidden') document.title = 'Please come back 🥺'; else document.title = DEFAULT_PAGE_TITLE;
};
const AppProvidersWrapper = ({
  children
}) => {
  useEffect(() => {
    document.addEventListener('visibilitychange', handleChangeTitle);
    return () => {
      document.removeEventListener('visibilitychange', handleChangeTitle);
    };
  }, []);
  return <HelmetProvider>
    <AuthProvider>
      <TwoFAProvider>
        <LayoutProvider>
          <NotificationProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="light"
            />

          </NotificationProvider>
        </LayoutProvider>
      </TwoFAProvider>  
    </AuthProvider>
  </HelmetProvider>;
};
export default AppProvidersWrapper;
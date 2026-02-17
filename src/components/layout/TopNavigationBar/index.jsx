import { lazy } from 'react';
import { Suspense } from 'react';
import LeftSideBarToggle from './components/LeftSideBarToggle';
import ProfileDropdown from './components/ProfileDropdown';
import SearchBox from './components/SearchBox';
import ThemeCustomizerToggle from './components/ThemeCustomizerToggle';
import ThemeModeToggle from './components/ThemeModeToggle';
import { useState,useEffect } from 'react';
import axiosClient from '@/helpers/httpClient';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const Notifications = lazy(() => import('./components/Notifications'));

const TopNavigationBar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axiosClient.get('/api/admin/test');
        if(res.status === 200){
          setIsMounted(true);
        }
      } catch (error) {
        console.error('AUTH CHECK ERROR 👉', error);
        setIsMounted(false);
      }   
   };
    checkAuthStatus();
  }, []);
  return <header className="topbar">
      <div className="container-xxl">
        <div className="navbar-header">
          <div className="d-flex align-items-center gap-2">
            <LeftSideBarToggle />

            <SearchBox />
          </div>
          <div className="d-flex align-items-center gap-1">
            {/* Toggle Theme Mode */}
            <ThemeModeToggle />

            {/* Apps Dropdown */}
            {/* <Suspense>
              <AppsDropdown />
            </Suspense> */}

            {/* Notification Dropdown */}
            <Suspense>
              <Notifications />
            </Suspense>

            {/* Toggle for Theme Customizer */}
            <ThemeCustomizerToggle />

            {/* Toggle for Activity Stream */}
            {/* <ActivityStreamToggle /> */}

            {/* Admin Profile Dropdown */}
            {
              isMounted ? <ProfileDropdown /> : (
                <Button variant="primary" size="lm" onClick={() =>navigate('/auth/sign-in')}>
                  SignIn
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </header>;
};
export default TopNavigationBar;
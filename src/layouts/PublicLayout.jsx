import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoBox from '@/components/LogoBox';
import ThemeModeToggle from '@/components/layout/TopNavigationBar/components/ThemeModeToggle';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/Preloader';
import { useAuthContext } from '@/context/useAuthContext';

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="wrapper">
      <header className="topbar" style={{ paddingLeft: 0 }}>
        <div className="container-xxl">
          <div className="navbar-header">
            <LogoBox containerClassName="logo-box" />
            <div className="d-flex align-items-center gap-1">
              <ThemeModeToggle />
              {isAuthenticated ? (
                <div className="topbar-item">
                  <Link to="/" className="topbar-button btn btn-sm btn-primary px-3">
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="topbar-item">
                  <Button size="sm" className="px-3" onClick={() => navigate('/auth/sign-in')}>
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="page-content" style={{ marginLeft: 0, paddingLeft: 0, paddingRight: 0 }}>
        <div className="container-xxl py-4">
          <Suspense fallback={<Preloader />}>{children}</Suspense>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;

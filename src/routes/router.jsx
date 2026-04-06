import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import PublicLayout from '@/layouts/PublicLayout';
// import { useAuthContext } from '@/context/useAuthContext';
import { appRoutes, authRoutes, publicRoutes } from '@/routes/index';
import AdminLayout from '@/layouts/AdminLayout';

const PrivateRoute = ({ children }) => {
  // TODO: re-enable auth check when ready
  return children;

  // const { isAuthenticated, authLoading } = useAuthContext();
  // if (authLoading) return null;
  // return isAuthenticated ? children : <Navigate to="/auth/sign-in" replace />;
};

const AppRouter = (props) => {
  return (
    <Routes>
      {(authRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<AuthLayout {...props}>{route.element}</AuthLayout>}
        />
      ))}

      {(publicRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<PublicLayout {...props}>{route.element}</PublicLayout>}
        />
      ))}

      {(appRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={
            <PrivateRoute>
              <AdminLayout {...props}>{route.element}</AdminLayout>
            </PrivateRoute>
          }
        />
      ))}

      {/* Catch-all: redirect any unknown route to sign-up */}
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
};

export default AppRouter;

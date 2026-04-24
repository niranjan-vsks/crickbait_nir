import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfileGate() {
  const { firestoreUser } = useAuth();

  // ProtectedRoute already handles the loading state — by the time we get here,
  // loading is false and user is authenticated.
  if (!firestoreUser?.profileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
}

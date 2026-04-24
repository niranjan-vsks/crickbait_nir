import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminRoute() {
  const { firestoreUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f131f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#313442] border-t-[#f97316] rounded-full animate-spin" />
      </div>
    );
  }

  if (!firestoreUser?.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

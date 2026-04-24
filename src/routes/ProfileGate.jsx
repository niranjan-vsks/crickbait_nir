import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfileGate() {
  const { firestoreUser, loading } = useAuth();

  // Wait for Firestore snapshot before deciding — avoids redirect loop on
  // sign-in when firestoreUser is transiently null before the snapshot resolves
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f131f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#313442] border-t-[#f97316] rounded-full animate-spin" />
      </div>
    );
  }

  if (!firestoreUser?.profileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Outlet />;
}

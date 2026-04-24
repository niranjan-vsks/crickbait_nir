import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import OfflineBanner from './components/ui/OfflineBanner';
import ProtectedRoute from './routes/ProtectedRoute';
import ProfileGate from './routes/ProfileGate';
import AdminRoute from './routes/AdminRoute';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Live from './pages/Live';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import H2H from './pages/H2H';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <OfflineBanner />
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route element={<ProfileGate />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/predict/:matchId" element={<Predict />} />
              <Route path="/live" element={<Live />} />
              <Route path="/ranks" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/h2h" element={<H2H />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

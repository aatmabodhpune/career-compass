import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAssessmentStore } from "./store/assessmentStore";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import Demographics from "./pages/Demographics";
import TestPersonality from "./pages/TestPersonality";
import TestInterest from "./pages/TestInterest";
import TestAptitude from "./pages/TestAptitude";
import Profile from "./pages/Profile";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navbar } from "./components/layout/Navbar";

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { student } = useAuthStore();
  
  const currentPath = location.pathname.split('/')[1] || 'dashboard';
  const activeTab = ['dashboard', 'profile'].includes(currentPath) ? currentPath : 'dashboard';

  const handleTabChange = (tab: string) => {
    navigate(`/${tab === 'dashboard' ? 'dashboard' : tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        userName={student?.name || 'User'} 
      />
      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  const resetSession = useAssessmentStore((s) => s.resetSession);

  useEffect(() => {
    resetSession(); // ALWAYS start fresh on app load
  }, [resetSession]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/demographics" element={<AppLayout><Demographics /></AppLayout>} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/test/personality" element={<AppLayout><TestPersonality /></AppLayout>} />
          <Route path="/test/interest" element={<AppLayout><TestInterest /></AppLayout>} />
          <Route path="/test/aptitude" element={<AppLayout><TestAptitude /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          <Route path="/assessment" element={<AppLayout><Assessment /></AppLayout>} />
          <Route path="/results" element={<AppLayout><Results /></AppLayout>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

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
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="/" element={<Home />} />
          <Route path="/demographics" element={<Demographics />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test/personality" element={<TestPersonality />} />
          <Route path="/test/interest" element={<TestInterest />} />
          <Route path="/test/aptitude" element={<TestAptitude />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

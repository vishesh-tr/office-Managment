import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import Bin from "./Bin/Bin";
import AddUser from "./features/MyTeam/AddUser";
import Leaderboard from "./features/MyTeam/Team";
import ProjectDetails from "./pages/Dashboard/components/ProjectDetails";
import Dashboard from "./pages/Dashboard/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Inbox from "./pages/Inbox/Inbox";
import LoginForm from "./pages/LoginForm";
import ResetPassword from "./pages/ResetPassword";
import SignupForm from "./pages/SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";
import IssuePage from './features/Issue/pages/IssuePage'; 
import AnalyticsDashboard from './pages/AnalysticsDashboard/AnalyticsDashboard';
import AIAssistant from './components/AiAssistant';

export default function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: 'white',
              color: 'black',
              padding: '16px',
              borderRadius: '8px',
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team" element={<Leaderboard />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/bin" element={<Bin />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/chart" element={<AnalyticsDashboard />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/issues" element={<IssuePage projectId="your-project-id" />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HelmetProvider>
  );
}

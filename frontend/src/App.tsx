import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 
import Bin from "./Bin/Bin";
import Leaderboard from "./features/MyTeam/Team";
import AddUser from "./features/MyTeam/AddUser";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignUp";
import ProjectDetails from "./pages/Dashboard/components/ProjectDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Inbox from "./pages/Inbox/Inbox";

export default function App() {
  return (
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
        <Route path="/" element={<LoginForm />} />
        <Route path="/SignUp" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<Leaderboard />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/bin" element={<Bin />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/inbox" element={<Inbox />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

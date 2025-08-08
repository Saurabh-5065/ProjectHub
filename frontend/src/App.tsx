// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from "./context/AuthContext"

import { MainLayout } from "./components/layouts/MainLayout"
import { DashboardOverview } from "./components/dashboard/DashboardOverview"
import { MyProjectsPage } from "./pages/MyProjectPage"
import Tasks from "./pages/Tasks"
import Landing from "./pages/Landing"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import CreateProject from "./pages/CreateProject"
import { ProjectDetail } from "./pages/ProjectDetails";
import { InvitationList } from "./pages/Invitation";

function ProtectedRouteLayout() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing/>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes inside MainLayout */}
          <Route element={<ProtectedRouteLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/projects" element={<MyProjectsPage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/createProject" element={<CreateProject/>} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/invitations" element={<InvitationList/>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
     <Toaster position="top-right" richColors />
    </>
    
  )
}


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Communities from "./pages/dashboard/Communities";
import CommunityDetail from "./pages/dashboard/CommunityDetail";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import Goals from "./pages/dashboard/Goals";
import Analytics from "./pages/dashboard/Analytics";
import Leaderboard from "./pages/dashboard/Leaderboard";
import Notifications from "./pages/dashboard/Notifications";
import PaymentMethods from "./pages/dashboard/PaymentMethods";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import AuthGuard from "./components/auth/AuthGuard";
import InvitationHandler from "./components/community/InvitationHandler";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Dashboard routes with shared layout */}
        <Route element={<AuthGuard redirectTo="/login" />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="communities" element={<Communities />} />
            <Route path="communities/:id" element={<CommunityDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="goals" element={<Goals />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="payment-methods" element={<PaymentMethods />} />
            <Route path="invitations/:token" element={<InvitationHandler />} />
          </Route>
        </Route>
        
        {/* Redirects */}
        <Route path="/communities" element={<Navigate to="/dashboard/communities" replace />} />
        <Route path="/communities/:id" element={<Navigate to="/dashboard/communities/:id" replace />} />
        <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
        <Route path="/invitations/:token" element={<Navigate to="/dashboard/invitations/:token" replace />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

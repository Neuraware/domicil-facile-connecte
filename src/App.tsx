
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// User Pages
import Dashboard from "./pages/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import DocumentValidation from "./pages/admin/DocumentValidation";

const queryClient = new QueryClient();

const isAdmin = (user: any): boolean => {
  return user?.user_metadata?.user_type === 'admin';
};

// Route guards
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!user || !isAdmin(user)) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const TestUsersNotification = () => {
  useEffect(() => {
    setTimeout(() => {
      toast({
        title: "Comptes de test disponibles",
        description: "Admin: admin@test.com / Client: client@test.com (Mot de passe: password123)",
        duration: 10000,
      });
    }, 2000);
  }, []);
  
  return null;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* User Routes (Protected) */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      
      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/documents/:id" element={
        <AdminRoute>
          <DocumentValidation />
        </AdminRoute>
      } />

      {/* Catch-all / 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NotificationsProvider>
          <Toaster />
          <Sonner />
          <TestUsersNotification />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </NotificationsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

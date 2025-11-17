import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Approvals from "./pages/Approvals";
import Settings from "./pages/Settings";
import Accounting from "./pages/Accounting";
import Reports from "./pages/Reports";
import Payroll from "./pages/Payroll";
import Recruitment from "./pages/Recruitment";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import "./i18n/config";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const lang = localStorage.getItem('i18nextLng') || 'en';
    const isRTL = lang === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-dir', isRTL ? 'rtl' : 'ltr');
    
    // Listen for language changes
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('i18nextLng') || 'en';
      const newIsRTL = newLang === 'ar';
      document.documentElement.dir = newIsRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
      document.documentElement.setAttribute('data-dir', newIsRTL ? 'rtl' : 'ltr');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route path="/" element={<Dashboard />} />
                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/accounting" element={<Accounting />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route path="/inventory" element={<ComingSoon moduleName="inventory" />} />
                <Route path="/production" element={<ComingSoon moduleName="production" />} />
                <Route path="/procurement" element={<ComingSoon moduleName="procurement" />} />
                <Route path="/sales" element={<ComingSoon moduleName="sales" />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

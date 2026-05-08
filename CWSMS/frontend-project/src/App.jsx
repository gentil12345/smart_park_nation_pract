import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import CarsPage from "./pages/CarsPage";
import PackagesPage from "./pages/PackagesPage";
import ServicePackagePage from "./pages/ServicePackagePage";
import PaymentPage from "./pages/PaymentPage";
import ReportsPage from "./pages/ReportsPage";

function PrivateRoute({ children }) {
  const { user, checking } = useAuth();
  if (checking) return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user, checking } = useAuth();
  if (checking) return null;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/cars" replace />} />
        <Route path="cars"            element={<CarsPage />} />
        <Route path="packages"        element={<PackagesPage />} />
        <Route path="service-package" element={<ServicePackagePage />} />
        <Route path="payment"         element={<PaymentPage />} />
        <Route path="reports"         element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

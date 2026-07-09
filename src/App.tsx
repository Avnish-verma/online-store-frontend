import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider, useAdmin } from "./context/AdminContext";

// Public Pages
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProductForm from "./pages/admin/ProductForm";
import AdminOffers from "./pages/admin/OffersManager";
import AdminSettings from "./pages/admin/Settings";

// Layouts
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAdmin();
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products/add" element={<AdminProductForm />} />
            <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
            <Route path="/admin/offers" element={<AdminOffers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

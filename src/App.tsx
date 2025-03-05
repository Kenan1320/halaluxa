
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Sellers from "./pages/Sellers";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";

// Dashboard imports
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProductsPage from "./pages/dashboard/ProductsPage";
import AddEditProductPage from "./pages/dashboard/AddEditProductPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import CustomersPage from "./pages/dashboard/CustomersPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/sellers" element={<Sellers />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    
    {/* Protected shopper routes */}
    <Route path="/shop" element={
      <ProtectedRoute requiredRole="shopper">
        <Shop />
      </ProtectedRoute>
    } />
    
    {/* Protected business owner routes */}
    <Route path="/dashboard" element={
      <ProtectedRoute requiredRole="business">
        <DashboardLayout />
      </ProtectedRoute>
    }>
      <Route index element={<DashboardHome />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/new" element={<AddEditProductPage />} />
      <Route path="products/edit/:id" element={<AddEditProductPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="customers" element={<CustomersPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    
    {/* 404 route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { LocationProvider } from "@/context/LocationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthMiddleware from "@/components/auth/AuthMiddleware";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { ensureBusinessAccount } from "@/utils/seedBusinessAccount";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Browse from "./pages/Browse"; 
import Search from "./pages/Search";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import Shops from "./pages/Shops";
import ShopDetail from "./pages/ShopDetail";
import Sellers from "./pages/Sellers";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import SelectShops from "./pages/SelectShops";

// New Pages for Navigation Buttons
import NearbyPage from "./pages/nearby";
import TrendingPage from "./pages/trending";
import PopularSearchesPage from "./pages/popular-searches";
import OrderDeliveryPage from "./pages/order-delivery";
import AffiliatePage from "./pages/affiliate";
import AffiliateProgramPage from "./pages/affiliate-program";

// Dashboard imports
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProductsPage from "./pages/dashboard/ProductsPage";
import AddEditProductPage from "./pages/dashboard/AddEditProductPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import CustomersPage from "./pages/dashboard/CustomersPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import PaymentAccountPage from "./pages/dashboard/PaymentAccountPage";
import UserProfilePage from "./pages/profile/UserProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Initialize the business test account
if (import.meta.env.DEV) {
  ensureBusinessAccount();
}

const AppRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Business users should only see the dashboard interface
  const showNavbar = !user || user.role !== 'business' || 
                    (!location.pathname.startsWith('/dashboard') && 
                     location.pathname !== '/login' && 
                     location.pathname !== '/signup');
  
  return (
    <AuthMiddleware>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/search" element={<Search />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/shop/:shopId" element={<ShopDetail />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/select-shops" element={<SelectShops />} />
        
        {/* New navigation button routes */}
        <Route path="/nearby" element={<NearbyPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/popular-searches" element={<PopularSearchesPage />} />
        <Route path="/order-delivery" element={<OrderDeliveryPage />} />
        <Route path="/affiliate" element={<AffiliatePage />} />
        <Route path="/affiliate-program" element={<AffiliateProgramPage />} />
        
        {/* Protected shopper routes - explicitly disallow business users */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-confirmation" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <OrderConfirmation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <UserProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected business owner routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="business">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<AddEditProductPage />} />
          <Route path="products/edit/:id" element={<AddEditProductPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="payment-account" element={<PaymentAccountPage />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNavbar && <BottomNavigation />}
    </AuthMiddleware>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <CartProvider>
                  <LocationProvider>
                    <AppRoutes />
                  </LocationProvider>
                </CartProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

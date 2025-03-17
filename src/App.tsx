
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
import { ShopProvider } from "@/context/ShopContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthMiddleware from "@/components/auth/AuthMiddleware";
import PageLayout from "@/components/layout/PageLayout";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { ensureBusinessAccount } from "@/utils/seedBusinessAccount";
import AdvancedBottomNav from "@/components/layout/AdvancedBottomNav";
import Services from "@/pages/Services";

// Import pages - to fix build errors
import Index from "@/pages/Index";
import About from "@/pages/About";
import Sellers from "@/pages/Sellers";
import LoginPage from "@/pages/auth/LoginPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import Shop from "@/pages/Shop";
import Browse from "@/pages/Browse";
import Search from "@/pages/Search";
import Shops from "@/pages/Shops";
import ShopDetail from "@/pages/ShopDetail";
import ProductDetail from "@/pages/ProductDetail";
import SelectShops from "@/pages/SelectShops";
import NearbyPage from "@/pages/nearby";
import TrendingPage from "@/pages/trending";
import PopularSearchesPage from "@/pages/popular-searches";
import OrderDeliveryPage from "@/pages/order-delivery";
import AffiliatePage from "@/pages/affiliate";
import AffiliateProgramPage from "@/pages/affiliate-program";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Orders from "@/pages/Orders";
import UserProfilePage from "@/pages/profile/UserProfilePage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import ProductsPage from "@/pages/dashboard/ProductsPage";
import AddEditProductPage from "@/pages/dashboard/AddEditProductPage";
import OrdersPage from "@/pages/dashboard/OrdersPage";
import CustomersPage from "@/pages/dashboard/CustomersPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import PaymentAccountPage from "@/pages/dashboard/PaymentAccountPage";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/NotFound";

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

// Coming Soon route component
const ComingSoonPage = ({ title }: { title: string }) => (
  <PageLayout>
    <ComingSoon title={title} />
  </PageLayout>
);

const AppRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Business users should only see the dashboard interface
  const showBottomNav = !user || user.role !== 'business' || 
                    (!location.pathname.startsWith('/dashboard') && 
                     !location.pathname.startsWith('/admin') &&
                     location.pathname !== '/login' && 
                     location.pathname !== '/signup');
  
  return (
    <AuthMiddleware>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PageLayout><Index /></PageLayout>} />
        <Route path="/about" element={<PageLayout><About /></PageLayout>} />
        <Route path="/sellers" element={<PageLayout><Sellers /></PageLayout>} />
        <Route path="/login" element={<PageLayout showFooter={false}><LoginPage /></PageLayout>} />
        <Route path="/signup" element={<PageLayout showFooter={false}><SignUpPage /></PageLayout>} />
        <Route path="/shop" element={<PageLayout><Shop /></PageLayout>} />
        <Route path="/browse" element={<PageLayout><Browse /></PageLayout>} />
        <Route path="/search" element={<PageLayout><Search /></PageLayout>} />
        <Route path="/shops" element={<PageLayout><Shops /></PageLayout>} />
        <Route path="/shop/:shopId" element={<PageLayout><ShopDetail /></PageLayout>} />
        <Route path="/product/:productId" element={<PageLayout><ProductDetail /></PageLayout>} />
        <Route path="/select-shops" element={<PageLayout><SelectShops /></PageLayout>} />
        <Route path="/services" element={<PageLayout><Services /></PageLayout>} />
        
        {/* New navigation button routes */}
        <Route path="/nearby" element={<PageLayout><NearbyPage /></PageLayout>} />
        <Route path="/trending" element={<PageLayout><TrendingPage /></PageLayout>} />
        <Route path="/popular-searches" element={<PageLayout><PopularSearchesPage /></PageLayout>} />
        <Route path="/order-delivery" element={<PageLayout><OrderDeliveryPage /></PageLayout>} />
        <Route path="/affiliate" element={<PageLayout><AffiliatePage /></PageLayout>} />
        <Route path="/affiliate-program" element={<PageLayout><AffiliateProgramPage /></PageLayout>} />
        
        {/* Protected shopper routes - explicitly disallow business users */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <PageLayout><Cart /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <PageLayout><Checkout /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-confirmation" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <PageLayout><OrderConfirmation /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <PageLayout><Orders /></PageLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requiredRole="shopper" businessAllowed={false}>
              <PageLayout><UserProfilePage /></PageLayout>
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
        
        {/* Admin routes - No authentication in dev mode */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="shops" element={<ComingSoon title="Shop Management" />} />
          <Route path="shops/pending" element={<ComingSoon title="Pending Shops" />} />
          <Route path="shops/create" element={<ComingSoon title="Create Shop" />} />
          <Route path="products" element={<ComingSoon title="Product Management" />} />
          <Route path="products/moderation" element={<ComingSoon title="Product Moderation" />} />
          <Route path="users" element={<ComingSoon title="User Management" />} />
          <Route path="users/business" element={<ComingSoon title="Business Users" />} />
          <Route path="users/shoppers" element={<ComingSoon title="Shoppers" />} />
          <Route path="orders" element={<ComingSoon title="Order Management" />} />
          <Route path="notifications" element={<ComingSoon title="Notifications" />} />
          <Route path="analytics" element={<ComingSoon title="Analytics" />} />
          <Route path="permissions" element={<ComingSoon title="Access Control" />} />
          <Route path="reports" element={<ComingSoon title="Reports" />} />
          <Route path="activity" element={<ComingSoon title="Activity Log" />} />
          <Route path="settings" element={<ComingSoon title="Admin Settings" />} />
        </Route>
        
        {/* Coming Soon routes for footer links */}
        <Route path="/help" element={<ComingSoonPage title="Help Center" />} />
        <Route path="/faq" element={<ComingSoonPage title="Frequently Asked Questions" />} />
        <Route path="/contact" element={<ComingSoonPage title="Contact Us" />} />
        <Route path="/terms" element={<ComingSoonPage title="Terms of Service" />} />
        <Route path="/privacy" element={<ComingSoonPage title="Privacy Policy" />} />
        
        {/* 404 route */}
        <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
      </Routes>
      
      {/* Only show the AdvancedBottomNav, removing BottomNavigation */}
      {showBottomNav && <AdvancedBottomNav />}
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
                <ShopProvider>
                  <CartProvider>
                    <LocationProvider>
                      <AppRoutes />
                    </LocationProvider>
                  </CartProvider>
                </ShopProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

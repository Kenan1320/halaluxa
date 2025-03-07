
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LocationProvider } from '@/context/LocationContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import AuthMiddleware from '@/components/auth/AuthMiddleware';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { setupRealtimeSubscriptions } from '@/integrations/supabase/client';

// Layout
import DashboardLayout from '@/components/layout/DashboardLayout';

// Pages
import Index from '@/pages/Index';
import Shop from '@/pages/Shop';
import ShopDetail from '@/pages/ShopDetail';
import Shops from '@/pages/Shops';
import ProductDetail from '@/pages/ProductDetail';
import Orders from '@/pages/Orders';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Sellers from '@/pages/Sellers';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/auth/LoginPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import UserProfilePage from '@/pages/profile/UserProfilePage';
import SelectShops from '@/pages/SelectShops';
import Browse from '@/pages/Browse';
import Search from '@/pages/Search';

// Dashboard Pages
import DashboardHome from '@/pages/dashboard/DashboardHome';
import ProductsPage from '@/pages/dashboard/ProductsPage';
import AddEditProductPage from '@/pages/dashboard/AddEditProductPage';
import OrdersPage from '@/pages/dashboard/OrdersPage';
import CustomersPage from '@/pages/dashboard/CustomersPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';
import PaymentAccountPage from '@/pages/dashboard/PaymentAccountPage';

// PWA & Styles
import './App.css';

function App() {
  useEffect(() => {
    // Set up the real-time subscriptions when the app loads
    setupRealtimeSubscriptions();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered: ', registration);
          })
          .catch(error => {
            console.log('Service Worker registration failed: ', error);
          });
      });
    }
  }, []);

  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <AuthMiddleware>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Shop Routes - Protected for shoppers */}
                  <Route 
                    path="/shop" 
                    element={
                      <ProtectedRoute requiredRole="any" businessAllowed={false}>
                        <Shop />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/shop/:id" element={<ShopDetail />} />
                  <Route path="/shops" element={<Shops />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute requiredRole="shopper">
                        <Orders />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute requiredRole="shopper">
                        <Cart />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute requiredRole="shopper">
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/order-confirmation" 
                    element={
                      <ProtectedRoute requiredRole="shopper">
                        <OrderConfirmation />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/sellers" element={<Sellers />} />
                  <Route path="/select-shops" element={<SelectShops />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/search" element={<Search />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Dashboard Routes - Protected for business users */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <DashboardHome />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/products" 
                    element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <ProductsPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/add-product" 
                    element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <AddEditProductPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/edit-product/:id" 
                    element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <AddEditProductPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/orders" 
                    element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <OrdersPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/customers" 
                    element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <CustomersPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/settings" 
                    element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <SettingsPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/payment-account" 
                    element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <PaymentAccountPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthMiddleware>
              <Toaster />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;

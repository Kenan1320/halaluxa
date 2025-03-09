
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Cart } from './models/cart';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { LocationProvider } from './context/LocationContext';
import { Toaster } from '@/components/ui/toaster';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Login from './pages/auth/LoginPage';
import SignUp from './pages/auth/SignUpPage';
import AuthCallback from './pages/auth/AuthCallback';
import Shop from './pages/Shop';
import ShopDetail from './pages/ShopDetail';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import SelectShops from './pages/SelectShops';
import CheckoutPage from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Sellers from './pages/Sellers';
import DashboardHome from './pages/dashboard/DashboardHome';
import ProductsPage from './pages/dashboard/ProductsPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import CustomersPage from './pages/dashboard/CustomersPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import AddEditProductPage from './pages/dashboard/AddEditProductPage';
import PaymentAccountPage from './pages/dashboard/PaymentAccountPage';
import UserProfilePage from './pages/profile/UserProfilePage';
import NotFound from './pages/NotFound';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Orders from './pages/Orders';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <LocationProvider>
              <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={
                      <>
                        <Navbar />
                        <Index />
                        <Footer />
                      </>
                    } />
                    <Route path="/about" element={
                      <>
                        <Navbar />
                        <About />
                        <Footer />
                      </>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/auth-callback" element={<AuthCallback />} />
                    
                    {/* Shopper routes */}
                    <Route path="/shop" element={
                      <ProtectedRoute requiredRole="shopper">
                        <Navbar />
                        <Shop />
                        <Footer />
                      </ProtectedRoute>
                    } />
                    <Route path="/browse" element={
                      <>
                        <Navbar />
                        <Browse />
                        <Footer />
                      </>
                    } />
                    <Route path="/search" element={
                      <>
                        <Navbar />
                        <Search />
                        <Footer />
                      </>
                    } />
                    <Route path="/shops/:id" element={
                      <>
                        <Navbar />
                        <ShopDetail />
                        <Footer />
                      </>
                    } />
                    <Route path="/products/:id" element={
                      <>
                        <Navbar />
                        <ProductDetail />
                        <Footer />
                      </>
                    } />
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <Navbar />
                        <CartPage />
                        <Footer />
                      </ProtectedRoute>
                    } />
                    <Route path="/shops/select" element={
                      <ProtectedRoute>
                        <Navbar />
                        <SelectShops />
                        <Footer />
                      </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Navbar />
                        <CheckoutPage />
                        <Footer />
                      </ProtectedRoute>
                    } />
                    <Route path="/order/confirmation" element={
                      <ProtectedRoute>
                        <Navbar />
                        <OrderConfirmation />
                        <Footer />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <Navbar />
                        <Orders />
                        <Footer />
                      </ProtectedRoute>
                    } />
                    <Route path="/sellers" element={
                      <>
                        <Navbar />
                        <Sellers />
                        <Footer />
                      </>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Navbar />
                        <UserProfilePage />
                        <Footer />
                      </ProtectedRoute>
                    } />
                    
                    {/* Business routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <DashboardHome />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/products" element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <ProductsPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/orders" element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <OrdersPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/customers" element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <CustomersPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/settings" element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <SettingsPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/products/add" element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <AddEditProductPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/products/edit/:id" element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <AddEditProductPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard/payment" element={
                      <ProtectedRoute requiredRole="business">
                        <DashboardLayout>
                          <PaymentAccountPage />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </div>
              </BrowserRouter>
            </LocationProvider>
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

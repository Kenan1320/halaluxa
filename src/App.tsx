import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BottomNavigation from './components/layout/BottomNavigation';
import SplashScreen from './components/SplashScreen';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

// Pages
const Index = React.lazy(() => import('./pages/Index'));
const Browse = React.lazy(() => import('./pages/Browse'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Profile = React.lazy(() => import('./pages/Profile'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const Orders = React.lazy(() => import('./pages/Orders'));
const OrderDetails = React.lazy(() => import('./pages/OrderDetails'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const SelectShops = React.lazy(() => import('./pages/SelectShops'));

// Business Pages
const BusinessDashboard = React.lazy(() => import('./pages/business/BusinessDashboard'));
const BusinessProfilePage = React.lazy(() => import('./pages/business/BusinessProfilePage'));
const BusinessOrders = React.lazy(() => import('./pages/business/BusinessOrders'));
const BusinessOrderDetails = React.lazy(() => import('./pages/business/BusinessOrderDetails'));
const BusinessProducts = React.lazy(() => import('./pages/business/BusinessProducts'));
const AddProduct = React.lazy(() => import('./pages/business/AddProduct'));
const EditProduct = React.lazy(() => import('./pages/business/EditProduct'));
const BusinessPaymentMethods = React.lazy(() => import('./pages/business/BusinessPaymentMethods'));
const BusinessSettings = React.lazy(() => import('./pages/business/BusinessSettings'));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow">
              <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile/user" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/order/:id" element={<OrderDetails />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/select-shops" element={<SelectShops />} />
                  
                  {/* Business Routes */}
                  <Route path="/business/dashboard" element={<RequireBusinessAuth><BusinessDashboard /></RequireBusinessAuth>} />
                  <Route path="/business/profile" element={<RequireBusinessAuth><BusinessProfilePage /></RequireBusinessAuth>} />
                  <Route path="/business/orders" element={<RequireBusinessAuth><BusinessOrders /></RequireBusinessAuth>} />
                  <Route path="/business/order/:id" element={<RequireBusinessAuth><BusinessOrderDetails /></RequireBusinessAuth>} />
                  <Route path="/business/products" element={<RequireBusinessAuth><BusinessProducts /></RequireBusinessAuth>} />
                  <Route path="/business/products/add" element={<RequireBusinessAuth><AddProduct /></RequireBusinessAuth>} />
                  <Route path="/business/products/edit/:id" element={<RequireBusinessAuth><EditProduct /></RequireBusinessAuth>} />
                  <Route path="/business/payment-methods" element={<RequireBusinessAuth><BusinessPaymentMethods /></RequireBusinessAuth>} />
                  <Route path="/business/settings" element={<RequireBusinessAuth><BusinessSettings /></RequireBusinessAuth>} />

                  {/* Default Route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
            <BottomNavigation />
            <Toaster />
            <SonnerToaster richColors />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

const RequireBusinessAuth = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, profile } = useAuth();
  const isBusinessOwner = profile?.role === 'business';

  if (!isLoggedIn) {
    return <Navigate to="/profile/user" />;
  }

  if (!isBusinessOwner) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default App;

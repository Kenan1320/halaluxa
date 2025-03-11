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
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthMiddleware from "@/components/auth/AuthMiddleware";
import Navbar from "@/components/layout/Navbar";
import { setupDatabaseTables } from "@/services/shopService";

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
import Wishlist from "./pages/Wishlist";

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
        <Route path="/wishlist" element={<Wishlist />} />
        
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

// Helper function to run database setup
const runDatabaseSetup = async (): Promise<boolean> => {
  try {
    const success = await setupDatabaseTables();
    return success;
  } catch (error) {
    console.error("Error setting up database:", error);
    return false;
  }
};

function App() {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Run database setup when the app initializes
    const initApp = async () => {
      try {
        const success = await runDatabaseSetup();
        setIsDatabaseReady(success);
      } catch (error) {
        console.error('Database initialization error:', error);
        // Continue with app even if DB setup fails
        setIsDatabaseReady(true);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initApp();
  }, []);

  // Don't render anything until initialization is complete
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2A866A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                <LocationProvider>
                  <AppRoutes />
                </LocationProvider>
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

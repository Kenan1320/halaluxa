
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { LocationProvider } from "@/context/LocationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthMiddleware from "@/components/auth/AuthMiddleware";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Browse from "./pages/Browse"; 
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
import SearchPage from "./pages/SearchPage";

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
      refetchOnWindowFocus: false, // Disable automatic refetching on window focus
      retry: 1, // Retry once on failure
      staleTime: 30000, // Consider data fresh for 30 seconds
    },
  },
});

const AppRoutes = () => (
  <>
    <AuthMiddleware />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/sellers" element={<Sellers />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/shops" element={<Shops />} />
      <Route path="/shop/:shopId" element={<ShopDetail />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/search" element={<SearchPage />} />
      
      {/* Protected shopper routes */}
      <Route path="/cart" element={
        <ProtectedRoute requiredRole="shopper">
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute requiredRole="shopper">
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/order-confirmation" element={
        <ProtectedRoute requiredRole="shopper">
          <OrderConfirmation />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute requiredRole="shopper">
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute requiredRole="shopper">
          <UserProfilePage />
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
        <Route path="payment-account" element={<PaymentAccountPage />} />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
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

export default App;

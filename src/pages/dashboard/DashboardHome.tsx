
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ShopSetupReminder from '@/components/dashboard/ShopSetupReminder';
import { getMainShop } from '@/services/shopService';
import { useState } from 'react';
import { Shop } from '@/models/shop';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingBag,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadShop = async () => {
      if (user?.role === 'business') {
        const shopData = await getMainShop();
        setShop(shopData);
      }
      setIsLoading(false);
    };
    
    loadShop();
  }, [user]);
  
  const displayName = user?.name || '';
  const hasShop = Boolean(shop);
  
  return (
    <div>
      {!isLoading && user?.role === 'business' && !hasShop && (
        <ShopSetupReminder userName={displayName} />
      )}
      
      <h1 className="text-2xl font-serif font-bold text-haluna-text mb-2">Dashboard</h1>
      <p className="text-haluna-text-light mb-6">Welcome back {displayName}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-haluna-primary" />
              Orders
            </CardTitle>
            <CardDescription>Recent customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-1">No orders yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              onClick={() => navigate('/dashboard/orders')}
            >
              View Orders
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="mr-2 h-5 w-5 text-haluna-primary" />
              Products
            </CardTitle>
            <CardDescription>Your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{shop?.productCount || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {shop?.productCount 
                ? `Products in your shop` 
                : `No products listed yet`}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              onClick={() => navigate('/dashboard/products')}
            >
              Manage Products
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-haluna-primary" />
              Customers
            </CardTitle>
            <CardDescription>Customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-1">No customers yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              onClick={() => navigate('/dashboard/customers')}
            >
              View Customers
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for managing your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start" 
                onClick={() => navigate('/dashboard/products/new')}
              >
                <div className="flex flex-col items-start">
                  <span className="text-haluna-primary flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Add New Product
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Create and publish a new product
                  </span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start" 
                onClick={() => navigate('/dashboard/orders')}
              >
                <div className="flex flex-col items-start">
                  <span className="text-haluna-primary flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Process Orders
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Manage and fulfill customer orders
                  </span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 justify-start" 
                onClick={() => navigate('/dashboard/settings')}
              >
                <div className="flex flex-col items-start">
                  <span className="text-haluna-primary flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Update Shop
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Edit your shop details and settings
                  </span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;

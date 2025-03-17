import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ShoppingBag, Store, Activity, TrendingUp, LineChart, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { getAllShops, getAllProducts, getAllUsers } from '@/services/adminService';
import { Shop } from '@/models/shop';
import { DatabaseProfile } from '@/types/database';
import { Product } from '@/models/product';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { adaptShopArray, adaptProductType } from '@/utils/typeAdapters';

const AdminDashboard = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<DatabaseProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [allShops, allProducts, allUsers] = await Promise.all([
          getAllShops(),
          getAllProducts(),
          getAllUsers()
        ]);

        // Convert shop and product types to match the expected types in the component
        const adaptedShops = adaptShopArray(allShops, 'models');
        const adaptedProducts = allProducts.map(p => adaptProductType(p)) as Product[];
        
        setShops(adaptedShops);
        setPendingShops(adaptedShops.filter(shop => shop.status === 'pending'));
        setProducts(adaptedProducts);
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count shops by status
  const approvedShops = shops.filter(shop => shop.status === 'approved').length;
  const rejectedShops = shops.filter(shop => shop.status === 'rejected').length;
  const suspendedShops = shops.filter(shop => shop.status === 'suspended').length;

  // Count users by role
  const businessUsers = users.filter(user => user.role === 'business').length;
  const shopperUsers = users.filter(user => user.role === 'shopper').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform activity and management tools.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/shops/create')} variant="default" size="sm">
            Create Shop
          </Button>
          <Button onClick={() => navigate('/admin/products')} variant="outline" size="sm">
            View Products
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-12 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
                <CardDescription>All registered shops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{shops.length}</div>
                  <Store className="h-8 w-8 text-blue-500 opacity-75" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">{approvedShops} approved</span> • {pendingShops.length} pending
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <CardDescription>All listed products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{products.length}</div>
                  <ShoppingBag className="h-8 w-8 text-purple-500 opacity-75" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  From {shops.length} different shops
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <CardDescription>Registered user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{users.length}</div>
                  <Users className="h-8 w-8 text-green-500 opacity-75" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {businessUsers} business • {shopperUsers} shoppers
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Platform Activity</CardTitle>
                <CardDescription>Recent admin actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">-</div>
                  <Activity className="h-8 w-8 text-orange-500 opacity-75" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  View activity logs for details
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
              <TabsTrigger value="recent">Recent Shops</TabsTrigger>
              <TabsTrigger value="stats">Platform Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Shop Approvals</CardTitle>
                  <CardDescription>Shops waiting for admin approval</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingShops.length > 0 ? (
                    <div className="space-y-4">
                      {pendingShops.slice(0, 5).map(shop => (
                        <div key={shop.id} className="flex items-center justify-between border-b pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                              {shop.logo_url ? (
                                <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                              ) : (
                                <Store className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{shop.name}</h3>
                              <p className="text-xs text-muted-foreground">{shop.category} • Created on {new Date(shop.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-green-500 border-green-500">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-500">
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {pendingShops.length > 5 && (
                        <Button 
                          variant="link" 
                          className="w-full" 
                          onClick={() => navigate('/admin/shops/pending')}
                        >
                          View all {pendingShops.length} pending shops
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                      <h3 className="font-medium text-lg">No Pending Approvals</h3>
                      <p className="text-muted-foreground mt-1">All shops have been reviewed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Added Shops</CardTitle>
                  <CardDescription>Newest shops on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {shops.length > 0 ? (
                    <div className="space-y-4">
                      {shops
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .slice(0, 5)
                        .map(shop => (
                          <div key={shop.id} className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {shop.logo_url ? (
                                  <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Store className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">{shop.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {shop.category} • Created {new Date(shop.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {shop.status === 'approved' && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approved
                                </span>
                              )}
                              {shop.status === 'pending' && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </span>
                              )}
                              {shop.status === 'rejected' && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Rejected
                                </span>
                              )}
                              {shop.status === 'suspended' && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Suspended
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      }
                      <Button 
                        variant="link" 
                        className="w-full" 
                        onClick={() => navigate('/admin/shops')}
                      >
                        View all {shops.length} shops
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Store className="h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="font-medium text-lg">No Shops Found</h3>
                      <p className="text-muted-foreground mt-1">There are no shops registered yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>Overview of platform performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <LineChart className="h-16 w-16 text-gray-300" />
                    <p className="text-center text-muted-foreground mt-2">Detailed analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

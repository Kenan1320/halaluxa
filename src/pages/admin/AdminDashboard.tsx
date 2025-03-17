
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Briefcase, DollarSign, ShoppingBag, ShoppingCart, Star, Store, Users, Check, X, Edit, ExternalLink } from 'lucide-react';
import { getAdminStats, getDashboardUsers, getRecentOrders } from '@/services/adminService';
import { getAllShops, updateShop } from '@/services/shopService';
import { DatabaseProfile } from '@/types/database';
import { Shop } from '@/types/shop';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { normalizeShop } from '@/utils/shopHelper';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalShops: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeUsers: 0,
  });
  
  const [users, setUsers] = useState<DatabaseProfile[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isShopDetailDialogOpen, setIsShopDetailDialogOpen] = useState(false);

  // Form states
  const [newUserData, setNewUserData] = useState({
    email: '',
    name: '',
    role: 'business',
    tempPassword: 'Temp' + Math.random().toString(36).substring(2, 10) + '!'
  });
  
  const { toast: hookToast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch admin dashboard stats
        const dashboardStats = await getAdminStats();
        setStats(dashboardStats);
        
        // Fetch recent users
        const recentUsers = await getDashboardUsers();
        setUsers(recentUsers as unknown as DatabaseProfile[]);
        
        // Fetch recent orders
        const recentOrders = await getRecentOrders();
        setOrders(recentOrders);

        // Fetch all shops
        const allShops = await getAllShops();
        const pendingApprovals = allShops.filter(shop => shop.status === 'pending');
        
        setPendingShops(pendingApprovals);
        setShops(allShops);
        
        // Update stats with real numbers
        setStats(prev => ({
          ...prev,
          totalShops: allShops.length,
          pendingApprovals: pendingApprovals.length
        }));
      } catch (error) {
        console.error("Error loading admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number | string, icon: any, color: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  const handleApproveShop = async (shop: Shop) => {
    try {
      const updatedShop = await updateShop(shop.id, {
        ...shop,
        status: 'approved',
        is_verified: true
      });
      
      if (updatedShop) {
        toast.success(`Shop "${shop.name}" has been approved`, {
          description: "The shop owner will be notified."
        });
        
        // Update local state
        setPendingShops(prev => prev.filter(s => s.id !== shop.id));
        setShops(prev => prev.map(s => s.id === shop.id ? { ...s, status: 'approved', is_verified: true } : s));
      }
    } catch (error) {
      console.error("Error approving shop:", error);
      toast.error("Failed to approve shop", {
        description: "Please try again later."
      });
    }
  };

  const handleRejectShop = async (shop: Shop) => {
    try {
      const updatedShop = await updateShop(shop.id, {
        ...shop,
        status: 'rejected'
      });
      
      if (updatedShop) {
        toast.success(`Shop "${shop.name}" has been rejected`, {
          description: "The shop owner will be notified."
        });
        
        // Update local state
        setPendingShops(prev => prev.filter(s => s.id !== shop.id));
        setShops(prev => prev.map(s => s.id === shop.id ? { ...s, status: 'rejected' } : s));
      }
    } catch (error) {
      console.error("Error rejecting shop:", error);
      toast.error("Failed to reject shop", {
        description: "Please try again later."
      });
    }
  };

  const createBusinessUser = async () => {
    try {
      // Check if email is valid
      if (!newUserData.email || !newUserData.email.includes('@')) {
        toast.error("Invalid email address");
        return;
      }

      // Create the user with supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.tempPassword,
        options: {
          data: {
            name: newUserData.name,
            role: newUserData.role,
          }
        }
      });

      if (error) throw error;

      // Create the user in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user?.id,
          email: newUserData.email,
          name: newUserData.name,
          role: newUserData.role,
          created_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      toast.success(`Business user created successfully`, {
        description: `Temporary password: ${newUserData.tempPassword}`
      });

      // Reset form and close dialog
      setNewUserData({
        email: '',
        name: '',
        role: 'business',
        tempPassword: 'Temp' + Math.random().toString(36).substring(2, 10) + '!'
      });
      setIsCreateUserDialogOpen(false);

      // Refresh users list
      const recentUsers = await getDashboardUsers();
      setUsers(recentUsers as unknown as DatabaseProfile[]);
    } catch (error) {
      console.error("Error creating business user:", error);
      toast.error("Failed to create business user", {
        description: "Please try again later."
      });
    }
  };

  const openShopDetails = (shop: Shop) => {
    setSelectedShop(shop);
    setIsShopDetailDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Users className="mr-2 h-4 w-4" /> Create Business User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Business User</DialogTitle>
                <DialogDescription>
                  Create a new business user with a temporary password
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <label className="text-right text-sm" htmlFor="email">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    className="col-span-3" 
                    value={newUserData.email}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="business@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <label className="text-right text-sm" htmlFor="name">Name</label>
                  <Input 
                    id="name" 
                    className="col-span-3" 
                    value={newUserData.name}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Business Name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <label className="text-right text-sm" htmlFor="role">Role</label>
                  <Select 
                    value={newUserData.role} 
                    onValueChange={(value) => setNewUserData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="shopper">Shopper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <label className="text-right text-sm" htmlFor="tempPassword">Temp Password</label>
                  <div className="col-span-3 flex gap-2">
                    <Input 
                      id="tempPassword" 
                      className="flex-1" 
                      value={newUserData.tempPassword}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, tempPassword: e.target.value }))}
                      placeholder="Temporary password"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setNewUserData(prev => ({
                        ...prev,
                        tempPassword: 'Temp' + Math.random().toString(36).substring(2, 10) + '!'
                      }))}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>Cancel</Button>
                <Button onClick={createBusinessUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline"
            onClick={() => navigate('/admin/shops')}
          >
            <Store className="mr-2 h-4 w-4" /> Manage Shops
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Shops" 
          value={stats.totalShops} 
          icon={Store} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingCart} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue}`} 
          icon={DollarSign} 
          color="bg-teal-500" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          icon={Briefcase} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Active Users" 
          value={stats.activeUsers} 
          icon={Star} 
          color="bg-yellow-500" 
        />
      </div>

      <Tabs defaultValue="pending-approvals" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="pending-approvals">Pending Shop Approvals</TabsTrigger>
          <TabsTrigger value="recent-users">Recent Users</TabsTrigger>
          <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending-approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Shop Approvals</CardTitle>
              <CardDescription>Review and approve new shop registrations</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              {loading ? (
                <div className="text-center py-4">Loading approvals...</div>
              ) : pendingShops.length > 0 ? (
                <div className="space-y-4">
                  {pendingShops.map((shop) => (
                    <Card key={shop.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="p-4 md:w-3/4">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold">{shop.name}</h3>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                              Pending
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            <span className="font-medium">Category:</span> {shop.category}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">
                            <span className="font-medium">Location:</span> {shop.location}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xl">
                            <span className="font-medium">Description:</span> {shop.description}
                          </p>
                        </div>
                        <div className="p-4 flex flex-row md:flex-col gap-2 justify-end bg-gray-50 dark:bg-gray-800 md:w-1/4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => openShopDetails(shop)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Details
                          </Button>
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            size="sm"
                            onClick={() => handleApproveShop(shop)}
                          >
                            <Check className="h-4 w-4 mr-2" /> Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleRejectShop(shop)}
                          >
                            <X className="h-4 w-4 mr-2" /> Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Check className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h3 className="text-xl font-medium">No pending approvals</h3>
                  <p className="text-gray-500 mt-2">All shop registrations have been processed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent-users">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>New users on the platform</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              {loading ? (
                <div className="text-center py-4">Loading users...</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b">
                      <th className="h-12 font-medium text-left px-4 py-2">Name</th>
                      <th className="h-12 font-medium text-left px-4 py-2">Email</th>
                      <th className="h-12 font-medium text-left px-4 py-2">Role</th>
                      <th className="h-12 font-medium text-left px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <Badge className={
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            user.role === 'business' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            'bg-green-100 text-green-800 border-green-300'
                          }>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent-orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders placed</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              {loading ? (
                <div className="text-center py-4">Loading orders...</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr>
                      <th className="h-12 font-medium text-left px-4 py-2">Order ID</th>
                      <th className="h-12 font-medium text-left px-4 py-2">User ID</th>
                      <th className="h-12 font-medium text-left px-4 py-2">Total</th>
                      <th className="h-12 font-medium text-left px-4 py-2">Status</th>
                      <th className="h-12 font-medium text-left px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="p-4">{order.id}</td>
                        <td className="p-4">{order.user_id}</td>
                        <td className="p-4">${order.total}</td>
                        <td className="p-4">
                          <Badge className={
                            order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                            'bg-yellow-100 text-yellow-800 border-yellow-300'
                          }>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" /> Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Shop Details Dialog */}
      <Dialog open={isShopDetailDialogOpen} onOpenChange={setIsShopDetailDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          {selectedShop && (
            <>
              <DialogHeader>
                <DialogTitle>Shop Details: {selectedShop.name}</DialogTitle>
                <DialogDescription>
                  Review complete shop information
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Shop Name</h4>
                    <p className="text-sm">{selectedShop.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Category</h4>
                    <p className="text-sm">{selectedShop.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Location</h4>
                    <p className="text-sm">{selectedShop.location}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Owner ID</h4>
                    <p className="text-sm">{selectedShop.owner_id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Status</h4>
                    <Badge className={
                      selectedShop.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' :
                      selectedShop.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                      'bg-yellow-100 text-yellow-800 border-yellow-300'
                    }>
                      {selectedShop.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Created At</h4>
                    <p className="text-sm">{new Date(selectedShop.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Logo URL</h4>
                    <p className="text-sm truncate max-w-xs">{selectedShop.logo_url || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Phone</h4>
                    <p className="text-sm">{selectedShop.phone || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Email</h4>
                    <p className="text-sm">{selectedShop.email || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Website</h4>
                    <p className="text-sm">{selectedShop.website || "N/A"}</p>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm">{selectedShop.description}</p>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleRejectShop(selectedShop);
                      setIsShopDetailDialogOpen(false);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsShopDetailDialogOpen(false)}>Close</Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApproveShop(selectedShop);
                      setIsShopDetailDialogOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

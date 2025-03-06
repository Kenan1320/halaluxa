
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, ShoppingBag, CreditCard, Mail, Phone } from 'lucide-react';

const UserProfilePage = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { translate } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || '',
  });
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load user orders from localStorage
    const loadOrders = () => {
      setIsLoading(true);
      try {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        // Filter orders by current user (in a real app, this would be done on the server)
        const userOrders = savedOrders.filter(order => order.userId === user?.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [user]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, this would update the user profile on the server
      await updateUserProfile(profile);
      
      toast({
        title: translate('Profile updated'),
        description: translate('Your profile information has been updated successfully.'),
      });
    } catch (error) {
      toast({
        title: translate('Error'),
        description: translate('Failed to update profile. Please try again.'),
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            {translate('My Profile')}
          </h1>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b bg-haluna-primary/5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-haluna-primary text-white flex items-center justify-center text-2xl font-bold">
                  {user?.name?.charAt(0) || <User size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-medium">{user?.name}</h2>
                  <p className="text-haluna-text-light">{user?.email}</p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="profile" className="p-6">
              <TabsList className="mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {translate('Profile')}
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  {translate('Orders')}
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {translate('Payment Methods')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-haluna-text mb-1">
                        {translate('Full Name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-haluna-text mb-1">
                        {translate('Email Address')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-haluna-text mb-1">
                        {translate('Phone Number')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-haluna-text mb-1">
                        {translate('Address')}
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-haluna-text mb-1">
                        {translate('City')}
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profile.city}
                        onChange={handleProfileChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-haluna-text mb-1">
                          {translate('State')}
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={profile.state}
                          onChange={handleProfileChange}
                          className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-haluna-text mb-1">
                          {translate('ZIP Code')}
                        </label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={profile.zip}
                          onChange={handleProfileChange}
                          className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">
                      {translate('Save Changes')}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="orders">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-haluna-text-light mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">{translate('No orders yet')}</h3>
                    <p className="text-haluna-text-light mb-6">
                      {translate('You haven\'t placed any orders yet. Start shopping to see your orders here.')}
                    </p>
                    <Button href="/shop">
                      {translate('Start Shopping')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <div>
                            <p className="font-medium">{translate('Order')} #{order.id}</p>
                            <p className="text-sm text-haluna-text-light">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {order.status}
                            </span>
                            <Button size="sm" variant="ghost" className="ml-2" href={`/orders/${order.id}`}>
                              {translate('View Details')}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="space-y-4">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                  {item.product.images && item.product.images.length > 0 ? (
                                    <img 
                                      src={item.product.images[0]} 
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-sm text-haluna-text-light">
                                    {translate('Quantity')}: {item.quantity} × ${item.product.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            
                            {order.items.length > 2 && (
                              <p className="text-sm text-haluna-primary">
                                + {order.items.length - 2} {translate('more items')}
                              </p>
                            )}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t flex justify-between">
                            <span className="text-haluna-text-light">{translate('Total')}</span>
                            <span className="font-medium">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="payment">
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-haluna-text-light mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">{translate('No payment methods saved')}</h3>
                  <p className="text-haluna-text-light mb-6">
                    {translate('You haven\'t saved any payment methods yet. Add a payment method for faster checkout.')}
                  </p>
                  <Button>
                    {translate('Add Payment Method')}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Support Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-medium mb-4">{translate('Need Help?')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-haluna-primary-light/50">
                  <Mail className="h-5 w-5 text-haluna-primary" />
                </div>
                <div>
                  <p className="font-medium">{translate('Email Support')}</p>
                  <p className="text-sm text-haluna-text-light">quicksupport@haluna.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-haluna-primary-light/50">
                  <Phone className="h-5 w-5 text-haluna-primary" />
                </div>
                <div>
                  <p className="font-medium">{translate('Phone Support')}</p>
                  <p className="text-sm text-haluna-text-light">682-402-3682</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">{translate('Account Actions')}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{translate('Change Password')}</p>
                  <p className="text-sm text-haluna-text-light">{translate('Update your password for enhanced security')}</p>
                </div>
                <Button variant="outline">{translate('Change')}</Button>
              </div>
              
              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">{translate('Log Out')}</p>
                  <p className="text-sm text-haluna-text-light">{translate('Sign out of your account on this device')}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  {translate('Log Out')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfilePage;

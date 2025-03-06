
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, ShoppingBag, CreditCard, Mail, Phone } from 'lucide-react';

const UserProfilePage = () => {
  const { user, updateUserProfile, logout } = useAuth();
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
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await updateUserProfile(profile);
      
      if (success) {
        toast({
          title: 'Profile updated',
          description: 'Your profile information has been updated successfully.',
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
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
            My Profile
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
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Methods
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-haluna-text mb-1">
                        Full Name
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
                        Email Address
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
                        Phone Number
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
                        Address
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
                        City
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
                          State
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
                          ZIP Code
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
                      Save Changes
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="orders">
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-haluna-text-light mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                  <p className="text-haluna-text-light mb-6">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Button href="/shop">
                    Start Shopping
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="payment">
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-haluna-text-light mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No payment methods saved</h3>
                  <p className="text-haluna-text-light mb-6">
                    You haven't saved any payment methods yet. Add a payment method for faster checkout.
                  </p>
                  <Button>
                    Add Payment Method
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Support Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-medium mb-4">Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-haluna-primary-light/50">
                  <Mail className="h-5 w-5 text-haluna-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-haluna-text-light">quicksupport@haluna.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-haluna-primary-light/50">
                  <Phone className="h-5 w-5 text-haluna-primary" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-haluna-text-light">682-402-3682</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">Account Actions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-haluna-text-light">Update your password for enhanced security</p>
                </div>
                <Button variant="outline">Change</Button>
              </div>
              
              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">Log Out</p>
                  <p className="text-sm text-haluna-text-light">Sign out of your account on this device</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Log Out
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

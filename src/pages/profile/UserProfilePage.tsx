
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CreditCard, Package, User, MapPin, Phone, Mail, ShoppingBag } from 'lucide-react';

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '682-402-3682', // Sample data
    address: '123 Main St, Dallas, TX 75201', // Sample data
  });
  
  // Sample order history
  const orderHistory = [
    {
      id: 'ORD-1234',
      date: '2023-07-15',
      total: 89.97,
      status: 'Delivered',
      items: [
        { id: '1', name: 'Organic Halal Chicken', price: 12.99, quantity: 2 },
        { id: '3', name: 'Natural Rose Water Face Toner', price: 18.50, quantity: 1 }
      ]
    },
    {
      id: 'ORD-5678',
      date: '2023-06-22',
      total: 24.99,
      status: 'Delivered',
      items: [
        { id: '2', name: 'Modest Hijab - Navy Blue', price: 24.99, quantity: 1 }
      ]
    }
  ];
  
  // Sample saved payment methods
  const paymentMethods = [
    { 
      id: 'pm-1', 
      type: 'Visa', 
      last4: '4242', 
      expiry: '04/25', 
      isDefault: true 
    },
    { 
      id: 'pm-2', 
      type: 'Mastercard', 
      last4: '5678', 
      expiry: '08/26', 
      isDefault: false 
    }
  ];
  
  const handleUpdateProfile = () => {
    // In a real app, this would call an API to update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
    setIsEditing(false);
  };
  
  const handleAddPaymentMethod = () => {
    // In a real app, this would open a payment method form or modal
    toast({
      title: "Coming Soon",
      description: "Payment method management will be available soon!"
    });
  };
  
  const handleRemovePaymentMethod = (id: string) => {
    // In a real app, this would call an API to remove the payment method
    toast({
      title: "Payment Method Removed",
      description: "Your payment method has been removed successfully."
    });
  };
  
  const handleSetDefaultPaymentMethod = (id: string) => {
    // In a real app, this would call an API to set the default payment method
    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been updated successfully."
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold mb-8">My Account</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your personal information and communication preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={userDetails.name} 
                          onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={userDetails.email} 
                          onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={userDetails.phone} 
                          onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={userDetails.address} 
                          onChange={(e) => setUserDetails({...userDetails, address: e.target.value})}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <User className="h-5 w-5 text-haluna-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{userDetails.name}</p>
                          <p className="text-sm text-haluna-text-light">Account Name</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="h-5 w-5 text-haluna-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{userDetails.email}</p>
                          <p className="text-sm text-haluna-text-light">Email Address</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-haluna-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{userDetails.phone}</p>
                          <p className="text-sm text-haluna-text-light">Phone Number</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-haluna-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{userDetails.address}</p>
                          <p className="text-sm text-haluna-text-light">Shipping Address</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => logout()}>Sign Out</Button>
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and track your previous orders.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orderHistory.length > 0 ? (
                    <div className="space-y-6">
                      {orderHistory.map(order => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-medium">Order #{order.id}</h4>
                              <p className="text-sm text-haluna-text-light">
                                Placed on {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                              <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between items-center py-2 border-t">
                                <div className="flex items-center">
                                  <ShoppingBag className="h-4 w-4 text-haluna-text-light mr-2" />
                                  <span>{item.name} × {item.quantity}</span>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t flex justify-end">
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-haluna-text-light mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-haluna-text-light mb-4">
                        You haven't placed any orders yet. Start shopping to see your orders here.
                      </p>
                      <Button href="/shop">Browse Products</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your saved payment methods for faster checkout.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map(method => (
                        <div key={method.id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-haluna-primary-light rounded-md flex items-center justify-center text-haluna-primary mr-3">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {method.type} ending in {method.last4}
                                {method.isDefault && (
                                  <span className="ml-2 text-xs py-0.5 px-2 bg-haluna-primary-light text-haluna-primary rounded-full">
                                    Default
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-haluna-text-light">Expires {method.expiry}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!method.isDefault && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSetDefaultPaymentMethod(method.id)}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRemovePaymentMethod(method.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 mx-auto text-haluna-text-light mb-4" />
                      <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                      <p className="text-haluna-text-light mb-4">
                        You haven't added any payment methods yet.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddPaymentMethod} className="w-full">
                    Add Payment Method
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfilePage;


import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Store, MapPin, Clock, ShoppingBag, User, Settings, 
  Phone, Mail, LinkIcon, Image, Upload, Check, X
} from 'lucide-react';
import StoreScheduleManager from '@/components/dashboard/StoreScheduleManager';
import ShopDeliveryOptions from '@/components/dashboard/ShopDeliveryOptions';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const shopCategories = [
  "Food & Groceries",
  "Fashion",
  "Beauty & Wellness",
  "Home & Decor",
  "Books & Stationery",
  "Electronics",
  "Toys & Games",
  "Health & Fitness",
  "Other"
];

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('store');
  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    is_featured: false,
    is_verified: false,
  });
  
  useEffect(() => {
    const fetchShopData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('owner_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setShop(data);
          setShopData({
            name: data.name || '',
            description: data.description || '',
            category: data.category || '',
            location: data.location || '',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            is_featured: data.is_featured || false,
            is_verified: data.is_verified || false,
          });
          
          if (data.logo_url) {
            setLogoPreview(data.logo_url);
          }
          
          if (data.cover_image) {
            setCoverPreview(data.cover_image);
          }
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shop data',
          variant: 'destructive'
        });
      }
    };
    
    fetchShopData();
  }, [user, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShopData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setShopData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setShopData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLogoFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCoverFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSaveShop = async () => {
    if (!user || !shop) return;
    
    setLoading(true);
    try {
      const updates: any = {
        ...shopData,
        updated_at: new Date().toISOString()
      };
      
      // Handle logo upload if changed
      if (logoFile) {
        const { data: logoData, error: logoError } = await supabase.storage
          .from('shop_logos')
          .upload(`${user.id}/${Date.now()}_${logoFile.name}`, logoFile);
        
        if (logoError) throw logoError;
        
        const { data: logoUrl } = supabase.storage
          .from('shop_logos')
          .getPublicUrl(logoData.path);
        
        updates.logo_url = logoUrl.publicUrl;
      }
      
      // Handle cover upload if changed
      if (coverFile) {
        const { data: coverData, error: coverError } = await supabase.storage
          .from('shop_covers')
          .upload(`${user.id}/${Date.now()}_${coverFile.name}`, coverFile);
        
        if (coverError) throw coverError;
        
        const { data: coverUrl } = supabase.storage
          .from('shop_covers')
          .getPublicUrl(coverData.path);
        
        updates.cover_image = coverUrl.publicUrl;
      }
      
      // Update shop data
      const { error } = await supabase
        .from('shops')
        .update(updates)
        .eq('id', shop.id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Shop details updated successfully',
      });
      
      // Update user profile with shop info if needed
      await updateUser({
        shop_name: updates.name,
        shop_category: updates.category,
        updated_at: updates.updated_at
      });
      
    } catch (error) {
      console.error('Error updating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shop details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveSchedule = async (schedule: any) => {
    if (!shop) return;
    
    try {
      const { error } = await supabase
        .from('shops')
        .update({
          schedule,
          updated_at: new Date().toISOString()
        })
        .eq('id', shop.id);
      
      if (error) throw error;
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving schedule:', error);
      return Promise.reject(error);
    }
  };
  
  const handleSaveDeliveryOptions = async (options: any) => {
    if (!shop) return;
    
    try {
      const { error } = await supabase
        .from('shops')
        .update({
          delivery_options: options,
          updated_at: new Date().toISOString()
        })
        .eq('id', shop.id);
      
      if (error) throw error;
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving delivery options:', error);
      return Promise.reject(error);
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p>You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Shop Profile
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hours & Availability
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Delivery & Pickup
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="store">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Shop Details
                </CardTitle>
                <CardDescription>
                  Update your shop's basic information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Shop Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="Your shop name" 
                      value={shopData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      placeholder="Describe your shop" 
                      value={shopData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={shopData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {shopCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        name="location"
                        placeholder="City, State" 
                        value={shopData.location}
                        onChange={handleInputChange}
                        startIcon={<MapPin className="h-4 w-4" />}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input 
                        id="address" 
                        name="address"
                        placeholder="Street address" 
                        value={shopData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Media & Contact
                </CardTitle>
                <CardDescription>
                  Upload images and add contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Shop Logo</Label>
                    <div className="flex items-start gap-4">
                      <div className="h-20 w-20 rounded-md border flex items-center justify-center overflow-hidden">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                        ) : (
                          <Store className="h-8 w-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id="logo"
                            className="hidden"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logo')?.click()}
                            size="sm"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {logoPreview ? 'Change Logo' : 'Upload Logo'}
                          </Button>
                          
                          {logoPreview && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setLogoPreview(null)}
                              size="sm"
                              className="text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Recommended: Square image, 500×500px</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="flex flex-col gap-2">
                      <div className="h-32 w-full rounded-md border flex items-center justify-center overflow-hidden">
                        {coverPreview ? (
                          <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                        ) : (
                          <Image className="h-8 w-8 text-gray-300" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id="cover"
                          className="hidden"
                          accept="image/*"
                          onChange={handleCoverChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('cover')?.click()}
                          size="sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {coverPreview ? 'Change Cover' : 'Upload Cover'}
                        </Button>
                        
                        {coverPreview && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCoverPreview(null)}
                            size="sm"
                            className="text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Recommended: 1200×400px image</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        placeholder="(123) 456-7890" 
                        value={shopData.phone}
                        onChange={handleInputChange}
                        startIcon={<Phone className="h-4 w-4" />}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        placeholder="shop@example.com" 
                        value={shopData.email}
                        onChange={handleInputChange}
                        startIcon={<Mail className="h-4 w-4" />}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      name="website"
                      placeholder="https://yourwebsite.com" 
                      value={shopData.website}
                      onChange={handleInputChange}
                      startIcon={<LinkIcon className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSaveShop}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="hours">
          <StoreScheduleManager 
            initialSchedule={shop?.schedule}
            onSave={handleSaveSchedule}
          />
        </TabsContent>
        
        <TabsContent value="delivery">
          <ShopDeliveryOptions 
            initialOptions={shop?.delivery_options}
            onSave={handleSaveDeliveryOptions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

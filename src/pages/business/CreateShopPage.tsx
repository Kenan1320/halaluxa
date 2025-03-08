
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, MapPin, Tag, FileText, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Shop categories
const SHOP_CATEGORIES = [
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

export default function CreateShopPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    address: '',
    logo: null as File | null,
    logoPreview: '' as string
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to create a shop",
          variant: "destructive"
        });
        navigate('/business/login');
        return;
      }
      
      setUserId(user.id);
      
      // Check if user already has a shop
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', user.id)
        .single();
      
      if (!shopError && shopData) {
        // User already has a shop, redirect to dashboard
        toast({
          title: "Shop exists",
          description: "You already have a shop setup",
        });
        navigate('/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShopData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setShopData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Logo size should be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    // Create a file reader to preview the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setShopData(prev => ({ ...prev, logoPreview: result, logo: file }));
    };
    reader.readAsDataURL(file);
  };
  
  const removeLogo = () => {
    setShopData(prev => ({ ...prev, logoPreview: '', logo: null }));
    const fileInput = document.getElementById('shopLogo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      let logoUrl = null;
      
      // Upload logo if present
      if (shopData.logo) {
        const fileExt = shopData.logo.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `shop-logos/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('shops')
          .upload(filePath, shopData.logo);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('shops')
          .getPublicUrl(filePath);
        
        logoUrl = urlData.publicUrl;
      }
      
      // Create shop
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .insert({
          name: shopData.name,
          description: shopData.description,
          category: shopData.category,
          location: shopData.location,
          address: shopData.address,
          logo_url: logoUrl,
          owner_id: userId
        })
        .select()
        .single();
      
      if (shopError) throw shopError;
      
      toast({
        title: "Success",
        description: "Your shop has been created successfully!",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating shop:', error);
      setError(error.message || 'Failed to create shop. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <img src="/logo.png" alt="Haluna" className="h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Create Your Shop</h2>
              <p className="mt-2 text-gray-600">
                Set up your shop profile to start selling on Haluna
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start"
              >
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="mb-6">
                  <label htmlFor="shopLogo" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Logo
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                      {shopData.logoPreview ? (
                        <>
                          <img src={shopData.logoPreview} alt="Shop logo" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Store className="h-10 w-10 mx-auto text-gray-400" />
                          <p className="text-xs text-gray-500 mt-1">Upload logo</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <input 
                        type="file" 
                        id="shopLogo" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('shopLogo')?.click()}
                        className="mb-2"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {shopData.logoPreview ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                      <p className="text-xs text-gray-500">
                        Upload a square image (recommended size: 500x500px). Max size: 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Store className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={shopData.name}
                      onChange={handleChange}
                      className="pl-10 w-full"
                      placeholder="Enter your shop name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <Select
                      value={shopData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                      required
                    >
                      <SelectTrigger className="pl-10 w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOP_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="location"
                      name="location"
                      required
                      value={shopData.location}
                      onChange={handleChange}
                      className="pl-10 w-full"
                      placeholder="City, State/Country"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="address"
                      name="address"
                      value={shopData.address}
                      onChange={handleChange}
                      className="pl-10 w-full"
                      placeholder="Street address (optional)"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      value={shopData.description}
                      onChange={handleChange}
                      rows={4}
                      className="pl-10 w-full"
                      placeholder="Describe your shop and what makes it unique"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Write an engaging description that tells customers about your shop and products
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                  <p className="text-sm text-gray-600">
                    Your shop will be visible to all Haluna customers after creation
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Creating shop...</span>
                      </div>
                    ) : (
                      'Create Shop'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

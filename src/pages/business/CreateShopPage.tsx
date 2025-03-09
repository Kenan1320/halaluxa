
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, MapPin, Tag, FileText, Upload, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { shopCategories } from '@/models/shop';

export default function CreateShopPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    logo: null as File | null,
    logoUrl: '' as string | null
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShopData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo should be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    setShopData(prev => ({
      ...prev,
      logo: file,
      logoUrl: URL.createObjectURL(file)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to create a shop",
        variant: "destructive"
      });
      navigate('/business/login');
      return;
    }
    
    if (!shopData.name || !shopData.description || !shopData.category || !shopData.location) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Upload logo if exists
      let logoUrl = null;
      if (shopData.logo) {
        const fileExt = shopData.logo.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `shop-logos/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, shopData.logo);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);
        
        logoUrl = data.publicUrl;
      }
      
      // Create shop
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .insert({
          name: shopData.name,
          description: shopData.description,
          category: shopData.category,
          location: shopData.location,
          logo_url: logoUrl,
          owner_id: user.id
        })
        .select()
        .single();
      
      if (shopError) throw shopError;
      
      // Make sure profile is updated as business owner
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_business_owner: true })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      setSuccess(true);
      toast({
        title: "Shop created",
        description: "Your shop has been created successfully!",
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
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
          {success ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop Created Successfully!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your shop has been created and is ready to go. You'll be redirected to your dashboard shortly.
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="px-6 py-8 sm:p-10">
              <div className="text-center mb-8">
                <img src="/logo.png" alt="Haluna" className="h-12 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">Create Your Shop</h2>
                <p className="mt-2 text-gray-600">
                  Set up your business profile to start selling
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Logo
                  </label>
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      {shopData.logoUrl ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={shopData.logoUrl} 
                            alt="Logo preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setShopData(prev => ({ ...prev, logo: null, logoUrl: null }))}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Store className="mx-auto h-10 w-10 text-gray-400" />
                          <p className="mt-1 text-xs text-gray-500">Upload logo</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('logo')?.click()}
                        className="mb-2"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {shopData.logo ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                      <p className="text-xs text-gray-500">
                        Recommended: 500x500px PNG or JPG, max 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Name*
                  </label>
                  <div className="relative">
                    <Store className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={shopData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="Your shop name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Description*
                  </label>
                  <div className="relative">
                    <FileText className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      value={shopData.description}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 shadow-sm py-2 pl-10 pr-3 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Describe your shop and what products you offer"
                    ></textarea>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <div className="relative">
                    <Tag className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      id="category"
                      name="category"
                      required
                      value={shopData.category}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 shadow-sm py-2 pl-10 pr-3 focus:border-emerald-500 focus:ring-emerald-500"
                    >
                      <option value="">Select a category</option>
                      {shopCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <div className="relative">
                    <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={shopData.location}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Creating Shop...</span>
                    </div>
                  ) : (
                    'Create Shop'
                  )}
                </Button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

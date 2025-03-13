
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Store, MapPin, Tag, FileText, Upload, X } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateUserProfile, updateBusinessProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shop_name: '',
    shop_description: '',
    shop_category: '',
    shop_location: '',
    shop_logo: ''
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        shop_name: user.shop_name || '',
        shop_description: user.shop_description || '',
        shop_category: user.shop_category || '',
        shop_location: user.shop_location || '',
        shop_logo: user.shop_logo || ''
      });
      
      if (user.shop_logo) {
        setLogoPreview(user.shop_logo);
      }
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Only image files are allowed",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoPreview(result);
      setFormData(prev => ({ ...prev, shop_logo: result }));
    };
    reader.readAsDataURL(file);
  };
  
  const removeLogo = () => {
    setLogoPreview(null);
    setFormData(prev => ({ ...prev, shop_logo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update personal info
      const personalInfo = {
        name: formData.name,
        email: formData.email,
      };
      
      await updateUserProfile(personalInfo);
      
      // If business user, update shop info
      if (user?.role === 'business') {
        const shopInfo = {
          shop_name: formData.shop_name,
          shop_description: formData.shop_description,
          shop_category: formData.shop_category,
          shop_location: formData.shop_location,
          shop_logo: formData.shop_logo
        };
        
        await updateBusinessProfile(shopInfo);
      }
      
      toast({
        title: "Success",
        description: "Shop settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Categories for shop selection
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
  
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-haluna-text mb-1">Shop Settings</h1>
      <p className="text-haluna-text-light mb-6">Manage your shop details and appearance</p>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-haluna-text mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
                  required
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
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-medium mb-4">Shop Details</h2>
            
            <div className="mb-6">
              <label htmlFor="shopLogo" className="block text-sm font-medium text-haluna-text mb-1">
                Shop Logo
              </label>
              <div className="flex items-start space-x-4">
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Shop logo" className="w-full h-full object-contain" />
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
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  <p className="text-xs text-haluna-text-light">
                    Upload a square image (recommended size: 500x500px). Max size: 2MB
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="shop_name" className="block text-sm font-medium text-haluna-text mb-1">
                  Shop Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <input
                    type="text"
                    id="shop_name"
                    name="shop_name"
                    value={formData.shop_name}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="shop_category" className="block text-sm font-medium text-haluna-text mb-1">
                  Shop Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <select
                    id="shop_category"
                    name="shop_category"
                    value={formData.shop_category}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary appearance-none"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {shopCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="h-2 w-2 border-b-2 border-r-2 border-haluna-text-light transform rotate-45"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="shop_location" className="block text-sm font-medium text-haluna-text mb-1">
                  Shop Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <input
                    type="text"
                    id="shop_location"
                    name="shop_location"
                    value={formData.shop_location}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="shop_description" className="block text-sm font-medium text-haluna-text mb-1">
                Shop Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-haluna-text-light" />
                </div>
                <textarea
                  id="shop_description"
                  name="shop_description"
                  value={formData.shop_description}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
                  rows={4}
                  required
                />
              </div>
              <p className="text-xs text-haluna-text-light mt-1">
                Describe your shop and what makes it unique (up to 250 characters)
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

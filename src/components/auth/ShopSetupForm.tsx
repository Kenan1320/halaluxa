
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { createShop } from '@/services/shopService';
import { Store, MapPin, Tag, FileText, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ShopSetupFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function ShopSetupForm({ onComplete, onSkip }: ShopSetupFormProps) {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    logo: ''
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShopData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // Create a file reader to preview the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoPreview(result);
      setShopData(prev => ({ ...prev, logo: result }));
    };
    reader.readAsDataURL(file);
  };
  
  const removeLogo = () => {
    setLogoPreview(null);
    setShopData(prev => ({ ...prev, logo: '' }));
    const fileInput = document.getElementById('shopLogo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a shop",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create the shop with required fields including created_at and updated_at
      const now = new Date().toISOString();
      const shop = await createShop({
        name: shopData.name,
        description: shopData.description,
        logo_url: logoPreview || undefined,
        category: shopData.category,
        location: shopData.location,
        rating: 0,
        product_count: 0,
        is_verified: false,
        owner_id: user.id,
        created_at: now,
        updated_at: now
      });
      
      if (shop) {
        // Update user profile with shop info
        const updates = {
          shopName: shopData.name,
          shopDescription: shopData.description,
          shopCategory: shopData.category,
          shopLocation: shopData.location,
          shopLogo: logoPreview
        };
        
        await updateUser(updates);
        
        toast({
          title: "Success",
          description: "Your shop has been created successfully"
        });
        
        onComplete();
      } else {
        toast({
          title: "Error",
          description: "Failed to create shop. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Shop categories
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
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-xl mx-auto mt-4">
      <h2 className="text-xl font-serif font-bold text-center mb-6">Set Up Your Shop</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="shopLogo" className="block text-sm font-medium text-gray-700 mb-2">
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
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </Button>
              <p className="text-xs text-gray-500">
                Upload a square image (recommended size: 500x500px). Max size: 2MB
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Store className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={shopData.name}
                onChange={handleInputChange}
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              <select
                id="category"
                name="category"
                required
                value={shopData.category}
                onChange={handleInputChange}
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="" disabled>Select a category</option>
                {shopCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <div className="h-2 w-2 border-b-2 border-r-2 border-gray-400 transform rotate-45"></div>
              </div>
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
              <input
                type="text"
                id="location"
                name="location"
                required
                value={shopData.location}
                onChange={handleInputChange}
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="City, State"
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
              <textarea
                id="description"
                name="description"
                required
                value={shopData.description}
                onChange={handleInputChange}
                rows={4}
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Describe your shop and what makes it unique"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Describe your shop and what makes it unique (up to 250 characters)
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip for Now
          </Button>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Creating...
              </>
            ) : (
              'Create Shop'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

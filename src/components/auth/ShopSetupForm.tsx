
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createShop } from '@/services/shopService';
import { useNavigate } from 'react-router-dom';
import { Shop } from '@/types/database';

const ShopSetupForm = () => {
  const { user, updateBusinessProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: 'Groceries', // Default category
    logo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      // First, update the business profile in the user context
      const businessUpdateSuccess = await updateBusinessProfile({
        shop_name: formData.name,
        shop_description: formData.description,
        shop_category: formData.category,
        shop_location: formData.location,
        shop_logo: formData.logo
      });
      
      if (!businessUpdateSuccess) {
        throw new Error("Failed to update business profile");
      }
      
      // Then, create the shop in the shops table
      const shopData = {
        name: formData.name,
        description: formData.description,
        logo_url: formData.logo,
        category: formData.category,
        location: formData.location,
        rating: 0,
        product_count: 0,
        is_verified: false,
        owner_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const newShop = await createShop(shopData);
      
      if (newShop) {
        toast({
          title: "Success",
          description: "Your shop has been set up successfully",
        });
        navigate("/dashboard");
      } else {
        throw new Error("Failed to create shop");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create your shop. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Shop Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-haluna-primary focus:ring focus:ring-haluna-primary focus:ring-opacity-50"
          placeholder="My Awesome Shop"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Shop Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-haluna-primary focus:ring focus:ring-haluna-primary focus:ring-opacity-50"
          placeholder="Tell customers about your shop..."
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Shop Category
        </label>
        <select
          id="category"
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-haluna-primary focus:ring focus:ring-haluna-primary focus:ring-opacity-50"
        >
          <option value="Groceries">Groceries</option>
          <option value="Restaurants">Restaurants</option>
          <option value="Furniture">Furniture</option>
          <option value="Halal Meat">Halal Meat</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
          <option value="Gifts">Gifts</option>
          <option value="Decorations">Decorations</option>
          <option value="Coffee Shops">Coffee Shops</option>
          <option value="Online Shops">Online Shops</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Shop Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          value={formData.location}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-haluna-primary focus:ring focus:ring-haluna-primary focus:ring-opacity-50"
          placeholder="123 Main St, City, Country"
        />
      </div>
      
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
          Shop Logo URL
        </label>
        <input
          id="logo"
          name="logo"
          type="text"
          value={formData.logo}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-haluna-primary focus:ring focus:ring-haluna-primary focus:ring-opacity-50"
          placeholder="https://example.com/logo.png"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter a URL for your shop logo (optional)
        </p>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Setting Up Your Shop..." : "Create My Shop"}
      </Button>
    </form>
  );
};

export default ShopSetupForm;

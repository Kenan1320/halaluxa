
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { useAuth } from '@/context/AuthContext';
import { createProduct, getProductById, updateProduct } from '@/services/productService';
import { Product } from '@/models/product';
import { getCategories } from '@/services/categoryService';
import { productCategories } from '@/models/product';
import { LoaderCircle } from 'lucide-react';

const AddEditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    images: [],
    is_halal_certified: false,
    is_published: true,
    long_description: '',
    in_stock: true,
    delivery_mode: 'pickup',
    pickup_options: {
      store: true,
      curbside: false
    }
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    const loadCategories = async () => {
      setCategories(productCategories);
    };
    
    loadCategories();
    
    if (isEditing && id) {
      loadProduct(id);
    }
  }, [isEditing, id]);
  
  const loadProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const productData = await getProductById(productId);
      if (productData) {
        setProduct(productData);
      } else {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive"
        });
        navigate('/dashboard/products');
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };
  
  const handleToggle = (field: string, value: boolean) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePickupToggle = (option: 'store' | 'curbside', value: boolean) => {
    setProduct(prev => ({
      ...prev,
      pickup_options: {
        ...prev.pickup_options!,
        [option]: value
      }
    }));
  };
  
  const handleImagesChange = (newImages: string[]) => {
    setProduct(prev => ({
      ...prev,
      images: newImages
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product.name || !product.description || !product.category || product.price === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (name, description, category, price)",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create products",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Map delivery_mode to match the expected type in the database
      let delivery_mode: 'online' | 'pickup' | 'local_delivery' = 'pickup';
      if (product.delivery_mode === 'online') delivery_mode = 'online';
      if (product.delivery_mode === 'local_delivery') delivery_mode = 'local_delivery';
      
      const productData = {
        ...product,
        delivery_mode
      };
      
      if (isEditing && id) {
        await updateProduct(id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const newProduct = await createProduct({
          ...productData,
          shop_id: user.shop_id || ''
        });
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      
      navigate('/dashboard/products');
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && isEditing) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading product details...</span>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={product.name} 
                    onChange={handleChange} 
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={product.description} 
                    onChange={handleChange} 
                    placeholder="Brief description of the product"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="long_description">Detailed Description</Label>
                  <Textarea 
                    id="long_description" 
                    name="long_description" 
                    value={product.long_description} 
                    onChange={handleChange} 
                    placeholder="Detailed description with specifications, features, etc."
                    rows={6}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={product.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={product.price} 
                      onChange={handleChange} 
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory & Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input 
                      id="stock" 
                      name="stock" 
                      type="number" 
                      min="0" 
                      step="1" 
                      value={product.stock} 
                      onChange={handleChange} 
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch 
                      id="in_stock" 
                      checked={product.in_stock} 
                      onCheckedChange={(value) => handleToggle('in_stock', value)} 
                    />
                    <Label htmlFor="in_stock">In Stock</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery_mode">Delivery Mode</Label>
                  <Select 
                    value={product.delivery_mode} 
                    onValueChange={(value: any) => handleSelectChange('delivery_mode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup Only</SelectItem>
                      <SelectItem value="local_delivery">Local Delivery</SelectItem>
                      <SelectItem value="online">Online Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Pickup Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="store_pickup" 
                      checked={product.pickup_options?.store} 
                      onCheckedChange={(value) => handlePickupToggle('store', value)} 
                    />
                    <Label htmlFor="store_pickup">Store Pickup</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="curbside_pickup" 
                      checked={product.pickup_options?.curbside} 
                      onCheckedChange={(value) => handlePickupToggle('curbside', value)} 
                    />
                    <Label htmlFor="curbside_pickup">Curbside Pickup</Label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="is_halal_certified" 
                      checked={product.is_halal_certified} 
                      onCheckedChange={(value) => handleToggle('is_halal_certified', value)} 
                    />
                    <Label htmlFor="is_halal_certified">Halal Certified</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="is_published" 
                      checked={product.is_published} 
                      onCheckedChange={(value) => handleToggle('is_published', value)} 
                    />
                    <Label htmlFor="is_published">Published (visible to customers)</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader 
                  images={product.images || []}
                  onImagesChange={handleImagesChange}
                  maxImages={5}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditing ? 'Update Product' : 'Create Product'
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => navigate('/dashboard/products')}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditProductPage;

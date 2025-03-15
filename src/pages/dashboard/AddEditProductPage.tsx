
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from '@/components/ui/ImageUploader';
import { getProductById, createProduct, updateProduct } from '@/services/productService';
import { productCategories, Product } from '@/models/product';
import { getShopById } from '@/services/shopService';

const AddEditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [userShop, setUserShop] = useState<any>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    long_description: '',
    price: 0,
    category: '',
    images: [],
    stock: 0,
    is_published: true,
    is_halal_certified: false,
    in_stock: true,
    details: {}
  });
  
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const product = await getProductById(id);
          if (product) {
            setFormData(product);
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
            description: "Failed to load product",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    const loadUserShop = async () => {
      if (user) {
        try {
          const shop = await getShopById(user.shop_id || '');
          setUserShop(shop);
        } catch (error) {
          console.error("Error loading shop:", error);
        }
      }
    };
    
    loadProduct();
    loadUserShop();
  }, [id, navigate, toast, user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }
      
      const productData: Partial<Product> = {
        ...formData,
        shop_id: user.shop_id || '',
        seller_id: user.id,
        seller_name: user.name || 'Unknown Seller'
      };
      
      if (id) {
        // Update existing product
        const updatedProduct = await updateProduct(id, productData);
        if (updatedProduct) {
          toast({
            title: "Success",
            description: "Product updated successfully",
          });
        } else {
          throw new Error("Failed to update product");
        }
      } else {
        // Create new product
        const newProduct = await createProduct(productData);
        if (newProduct) {
          toast({
            title: "Success",
            description: "Product created successfully",
          });
          navigate(`/dashboard/products/edit/${newProduct.id}`);
        } else {
          throw new Error("Failed to create product");
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-haluna-text mb-1">
        {id ? 'Edit Product' : 'Add New Product'}
      </h1>
      <p className="text-haluna-text-light mb-6">
        {id ? 'Update your product details' : 'Add a new product to your shop'}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Enter your product details</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Short Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        placeholder="Brief description of your product"
                        required
                      />
                      <p className="text-xs text-haluna-text-light mt-1">
                        A short description that will appear in product cards (100-150 characters recommended)
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="long_description">Full Description</Label>
                      <Textarea
                        id="long_description"
                        name="long_description"
                        value={formData.long_description || ''}
                        onChange={handleChange}
                        placeholder="Detailed description of your product"
                        className="min-h-32"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category || ''}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price || 0}
                        onChange={handleNumberChange}
                        required
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="is_halal_certified">Halal Certified</Label>
                        <p className="text-xs text-haluna-text-light">
                          Mark this product as halal certified
                        </p>
                      </div>
                      <Switch
                        id="is_halal_certified"
                        checked={formData.is_halal_certified}
                        onCheckedChange={(checked) => handleSwitchChange('is_halal_certified', checked)}
                      />
                    </div>
                    
                    {/* Add more detail fields as needed */}
                  </TabsContent>
                  
                  <TabsContent value="inventory" className="space-y-4">
                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={formData.stock || 0}
                        onChange={handleNumberChange}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="in_stock">In Stock</Label>
                        <p className="text-xs text-haluna-text-light">
                          Mark this product as available for purchase
                        </p>
                      </div>
                      <Switch
                        id="in_stock"
                        checked={formData.in_stock}
                        onCheckedChange={(checked) => handleSwitchChange('in_stock', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="is_published">Published</Label>
                        <p className="text-xs text-haluna-text-light">
                          Make this product visible in your shop
                        </p>
                      </div>
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => handleSwitchChange('is_published', checked)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/dashboard/products')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload product images</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  images={formData.images || []}
                  onChange={handleImagesChange}
                  maxImages={5}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditProductPage;

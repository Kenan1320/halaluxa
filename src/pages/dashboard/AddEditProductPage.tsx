
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getCategories } from '@/services/categoryService';
import { getProductById, createProduct, updateProduct } from '@/services/productService';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/services/categoryService';
import { Plus, Upload as UploadIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

const AddEditProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      longDescription: '',
      price: 0,
      category: '',
      isHalalCertified: false,
      inStock: true,
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        });
      }
    };

    fetchCategories();
    
    if (productId) {
      setLoading(true);
      getProductById(productId)
        .then(product => {
          if (product) {
            form.reset({
              name: product.name,
              description: product.description,
              longDescription: product.description,
              price: product.price,
              category: product.category,
              isHalalCertified: product.isHalalCertified,
              inStock: product.inStock,
            });
            setProductImage(product.images || []);
          }
        })
        .catch(error => {
          console.error('Error fetching product:', error);
          toast({
            title: "Error",
            description: "Failed to load product",
            variant: "destructive"
          });
        })
        .finally(() => setLoading(false));
    }
  }, [productId, form, toast]);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const productData = {
        ...values,
        images: productImage,
        shop_id: user?.id,
        is_halal_certified: values.isHalalCertified,
        in_stock: values.inStock,
        long_description: values.longDescription
      };

      if (productId) {
        // Update existing product
        const updatedProduct = await updateProduct(productId, productData);
        if (updatedProduct) {
          toast({
            title: "Success",
            description: "Product updated successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update product",
            variant: "destructive"
          });
        }
      } else {
        // Create new product
        const newProduct = await createProduct(productData);
        if (newProduct) {
          toast({
            title: "Success",
            description: "Product created successfully",
          });
          navigate('/dashboard/products');
        } else {
          toast({
            title: "Error",
            description: "Failed to create product",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error creating/updating product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real implementation, you would upload the file to a server
    // and get back a URL. For now, we'll use a mock URL.
    const mockImageUrl = URL.createObjectURL(file);
    setProductImage([mockImageUrl]);
    toast({
      title: "Success",
      description: `${file.name} uploaded successfully`,
    });
  };

  return (
    <DashboardLayout>
      <div className="container p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{productId ? 'Edit Product' : 'Add Product'}</h1>
        
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Short description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Long Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed product description" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (QR)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isHalalCertified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Halal Certified</FormLabel>
                        <FormDescription>
                          Product is certified halal
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>In Stock</FormLabel>
                        <FormDescription>
                          Product is available for purchase
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="space-y-3">
                  <FormLabel>Product Image</FormLabel>
                  <div className="flex items-center gap-4">
                    <label 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      style={{ width: '150px', height: '150px' }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      {productImage && productImage[0] ? (
                        <img 
                          src={productImage[0]} 
                          alt="Product" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <UploadIcon className="w-8 h-8 mb-2" />
                          <span className="text-sm">Upload Image</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : productId ? 'Update Product' : 'Add Product'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddEditProductPage;

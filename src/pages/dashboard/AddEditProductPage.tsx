
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { fetchProductById, updateProduct, addProduct } from '@/services/productService';
import { Product } from '@/models/product';

const AddEditProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(true);

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      is_halal_certified: false,
      is_published: true,
      inStock: 1, // Changed from boolean to number
    },
  });

  useEffect(() => {
    if (productId && productId !== 'new') {
      setIsNew(false);
      loadProduct(productId);
    }
  }, [productId]);

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      const product = await fetchProductById(id);
      if (product) {
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          is_halal_certified: product.is_halal_certified || false,
          is_published: product.is_published !== false,
          inStock: product.inStock || 1,
        });
        if (product.images) {
          setImageUrls(product.images);
        }
      }
    } catch (error) {
      toast.error('Failed to load product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    try {
      setLoading(true);
      const productData: Partial<Product> = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        is_halal_certified: data.is_halal_certified,
        is_published: data.is_published,
        inStock: data.inStock,
        sellerId: user.id,
        sellerName: user.user_metadata?.full_name || user.email || 'Unknown Seller',
      };

      if (isNew) {
        // It's a new product
        await addProduct(productData, user.id);
        toast.success('Product added successfully');
      } else {
        // It's an existing product
        await updateProduct(productId!, productData);
        toast.success('Product updated successfully');
      }
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (urls: string[]) => {
    setImageUrls(urls);
  };

  return (
    <div className="container py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{isNew ? 'Add New Product' : 'Edit Product'}</CardTitle>
          <CardDescription>
            {isNew ? 'Create a new product to sell in your shop' : 'Update your product details'}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Product name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormDescription>The name of your product as it will appear to customers.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your product" rows={4} {...field} />
                    </FormControl>
                    <FormDescription>Provide details about your product.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  rules={{ 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price cannot be negative' }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormDescription>The price in USD.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Electronics, Clothing" {...field} />
                      </FormControl>
                      <FormDescription>Product category.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Items in Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormDescription>Number of items currently available.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="is_halal_certified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Halal Certified</FormLabel>
                        <FormDescription>
                          Indicate if this product is halal certified.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Published</FormLabel>
                        <FormDescription>
                          Make this product visible to customers.
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
              </div>

              <div>
                <FormLabel>Product Images</FormLabel>
                <ImageUploader
                  bucket="product-images"
                  existingUrls={imageUrls}
                  onImagesChange={handleImagesChange}
                  maxImages={5}
                />
                <FormDescription className="mt-2">
                  Upload up to 5 images. The first image will be the main product image.
                </FormDescription>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/products')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isNew ? 'Add Product' : 'Update Product'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddEditProductPage;

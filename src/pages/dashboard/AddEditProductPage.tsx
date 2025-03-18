import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Product, productCategories } from '@/models/product';
import { getProductById, createProduct, updateProduct } from '@/services/productService';
import { getMainShop } from '@/services/shopService';
import { Shop } from '@/types/shop';
import { ImageIcon, PlusCircle, Trash } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  long_description: z.string().optional(),
  price: z.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  stock: z.number().min(0, {
    message: "Stock must be at least 0.",
  }),
  images: z.array(z.string()).optional(),
  is_published: z.boolean().default(false),
  is_halal_certified: z.boolean().default(false),
  in_stock: z.boolean().default(true),
  details: z.any().optional(),
  delivery_mode: z.enum(['online', 'pickup', 'local_delivery']).default('pickup'),
  pickup_options: z.object({
    store: z.boolean().default(true),
    curbside: z.boolean().default(false),
  }),
});

const AddEditProductPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [shop, setShop] = useState<Shop | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      long_description: '',
      price: 0,
      category: '',
      stock: 0,
      images: [],
      is_published: false,
      is_halal_certified: false,
      in_stock: true,
      delivery_mode: 'pickup',
      pickup_options: {
        store: true,
        curbside: false,
      },
    },
  });
  
  const isEditMode = !!id;
  
  useEffect(() => {
    const loadProduct = async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          const product = await getProductById(id);
          if (product) {
            form.reset({
              name: product.name,
              description: product.description,
              long_description: product.long_description,
              price: product.price,
              category: product.category,
              stock: product.stock,
              images: product.images,
              is_published: product.is_published,
              is_halal_certified: product.is_halal_certified,
              in_stock: product.in_stock,
              details: product.details,
              delivery_mode: product.delivery_mode || 'pickup',
              pickup_options: product.pickup_options,
            });
            setProductImages(product.images);
          } else {
            toast({
              title: 'Error',
              description: 'Product not found',
              variant: 'destructive',
            });
            navigate('/dashboard/products');
          }
        } catch (error) {
          console.error('Error loading product:', error);
          toast({
            title: 'Error',
            description: 'Failed to load product',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadProduct();
  }, [id, isEditMode, navigate, toast, form]);
  
  useEffect(() => {
    const loadShop = async () => {
      try {
        const shopData = await getMainShop(localStorage.getItem('userId') || '');
        setShop(shopData);
      } catch (error) {
        console.error('Error loading shop:', error);
        toast({
          title: 'Error',
          description: 'Failed to load shop details',
          variant: 'destructive',
        });
      }
    };
    
    loadShop();
  }, [toast]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      if (!shop) {
        toast({
          title: 'Error',
          description: 'Please set up your shop first',
          variant: 'destructive',
        });
        return;
      }
      
      const productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
        name: values.name,
        description: values.description,
        long_description: values.long_description || '',
        price: values.price,
        category: values.category,
        stock: values.stock,
        images: productImages,
        is_published: values.is_published,
        is_halal_certified: values.is_halal_certified,
        in_stock: values.in_stock,
        details: values.details,
        shop_id: shop.id,
        delivery_mode: values.delivery_mode,
        pickup_options: {
          store: values.pickup_options.store,
          curbside: values.pickup_options.curbside
        },
        seller_id: shop.owner_id,
        seller_name: shop.name,
      };
      
      if (isEditMode && id) {
        await updateProduct(id, productData);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await createProduct(productData);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagesChange = useCallback((images: string[]) => {
    setProductImages(images);
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard/products')}>
          &larr; Back to Products
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Product' : 'Add Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product Name" {...field} />
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
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Stock" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="long_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed product description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Images</FormLabel>
                <ImageUploader 
                  initialImages={productImages} 
                  onImagesChange={handleImagesChange}
                  maxImages={5}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Published</FormLabel>
                        <FormDescription>
                          Set this product as published
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
                  name="is_halal_certified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Halal Certified</FormLabel>
                        <FormDescription>
                          Set if this product is Halal certified
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
                  name="in_stock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">In Stock</FormLabel>
                        <FormDescription>
                          Set if this product is in stock
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
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Product'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditProductPage;

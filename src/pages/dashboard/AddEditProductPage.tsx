
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMainShop } from '@/services/shopService';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types/database';
import ImageUploader from '@/components/ImageUploader';
import { createProduct } from '@/services/productService';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Price must be a valid number greater than zero.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  isHalalCertified: z.boolean().default(false),
  images: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof formSchema>;

const AddEditProductPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      isHalalCertified: false,
      images: [],
    },
  });
  
  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get the main shop if available
      const mainShop = await getMainShop();
      const shopId = mainShop?.id || (user?.shop_name ? user?.id : undefined);
      
      if (!shopId) {
        toast({
          title: "Error",
          description: "Could not determine which shop to add this product to. Please select a main shop first.",
          variant: "destructive"
        });
        return;
      }
      
      const productData = {
        ...data,
        shop_id: shopId,
        price: parseFloat(data.price),
        isHalalCertified: data.isHalalCertified,
        images: images,
      };
      
      await createProduct(productData);
      
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define product categories
  const productCategories = [
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
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Add New Product
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your product"
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Price" type="number" {...field} />
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
            name="isHalalCertified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Halal Certified</FormLabel>
                  <FormDescription>
                    Is this product Halal certified?
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
          
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Product Images
            </label>
            <ImageUploader 
              defaultValue={images}
              onChange={handleImagesChange}
              maxFiles={5}
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload up to 5 product images.
            </p>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
      
      <Button variant="ghost" onClick={() => navigate('/dashboard')}>
        Cancel
      </Button>
    </div>
  );
};

export default AddEditProductPage;

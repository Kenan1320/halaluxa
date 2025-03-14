import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createProduct, updateProduct, getProductById } from '@/services/productService';
import { listCategories } from '@/services/categoryService';
import { Product, productCategories } from '@/models/product';

// Define Category interface to match what listCategories returns
interface Category {
  id: string;
  name: string;
}

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  images: z.string().url({
    message: "Please enter a valid image URL.",
  }),
  isHalalCertified: z.boolean().default(false),
  inStock: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productFormSchema>;

const AddEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      images: "",
      isHalalCertified: false,
      inStock: true,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Try to get categories from the service
        const categoryList = await listCategories();
        
        // If categoryList returns Category objects, extract just the names
        if (Array.isArray(categoryList) && categoryList.length > 0 && typeof categoryList[0] === 'object') {
          // Extract only the names from the category objects
          const categoryNames = (categoryList as Category[]).map(cat => cat.name);
          setCategories(categoryNames);
        } else {
          // If it's already a string array, use it directly
          setCategories(categoryList as string[]);
        }
        
        // Fallback to hardcoded categories if the service fails or returns empty
        if (categories.length === 0) {
          setCategories(productCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to hardcoded product categories
        setCategories(productCategories);
        toast({
          title: "Notice",
          description: "Using default categories",
        });
      }
    };

    fetchCategories();
  }, [toast]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setLoading(true);
        try {
          const productData = await getProductById(id);
          if (productData) {
            setProduct(productData);
            form.reset({
              name: productData.name,
              description: productData.description,
              price: productData.price,
              category: productData.category,
              images: productData.images[0], // Assuming single image for simplicity
              isHalalCertified: productData.isHalalCertified,
              inStock: productData.inStock ?? true,
            });
          } else {
            toast({
              title: "Error",
              description: "Product not found.",
              variant: "destructive",
            });
            navigate("/dashboard/products");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast({
            title: "Error",
            description: "Failed to load product details.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id, navigate, toast, form]);

  const handleSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setLoading(true);

    try {
      const productData = {
        ...data,
        price: parseFloat(data.price.toString()),
        images: [data.images],
        // Convert to snake_case for the API
        is_halal_certified: data.isHalalCertified,
        in_stock: data.inStock
      };

      if (id) {
        // Update existing product
        await updateProduct(id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully.",
        });
      } else {
        // Create new product
        await createProduct(productData);
        toast({
          title: "Success",
          description: "Product created successfully.",
        });
      }
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Error creating/updating product:", error);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit Product" : "Add Product"}</CardTitle>
          <CardDescription>
            {id ? "Edit an existing product." : "Add a new product to your store."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      <Textarea placeholder="Description" {...field} />
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
                      <Input
                        type="number"
                        placeholder="Price"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                        }}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isHalalCertified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <div className="space-y-0.5">
                      <FormLabel>Halal Certified</FormLabel>
                      <FormDescription>
                        Check if the product is Halal certified.
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
                name="inStock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <div className="space-y-0.5">
                      <FormLabel>In Stock</FormLabel>
                      <FormDescription>
                        Check if the product is currently in stock.
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
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditProductPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createProduct, updateProduct, getProductById } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { Product as ModelProduct } from '@/models/product';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  longDescription: z.string().optional(),
  price: z.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  isHalalCertified: z.boolean().default(false),
  inStock: z.boolean().default(true),
});

const AddEditProductPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImage, setProductImage] = useState<string[]>([]);
  const [categories, setCategories] = useState([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      longDescription: '',
      price: 0,
      category: '',
      isHalalCertified: false,
      inStock: true,
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: "Couldn't load categories",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    loadCategories();
  }, [toast]);

  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        try {
          const product = await getProductById(productId);
          if (product) {
            form.reset({
              name: product.name,
              description: product.description,
              longDescription: product.longDescription || '',
              price: product.price,
              category: product.category,
              isHalalCertified: product.isHalalCertified,
              inStock: product.inStock,
            });
            setProductImage(product.images || []);
          } else {
            toast({
              title: "Product not found",
              description: "Could not find product with that ID.",
              variant: "destructive",
            });
            navigate('/dashboard/products');
          }
        } catch (error) {
          console.error('Error loading product:', error);
          toast({
            title: "Couldn't load product",
            description: "Please try again later",
            variant: "destructive",
          });
          navigate('/dashboard/products');
        }
      }
    };

    loadProduct();
  }, [productId, navigate, toast, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage([reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const productData: Partial<ModelProduct> = {
        ...values,
        images: productImage,
      };

      if (productId) {
        productData.id = productId;
        const updatedProduct = await updateProduct(productData as ModelProduct);
        if (updatedProduct) {
          toast({
            title: "Product updated",
            description: `${values.name} has been updated successfully.`,
          });
        } else {
          toast({
            title: "Failed to update product",
            description: "Please try again.",
            variant: "destructive",
          });
        }
      } else {
        const newProduct = await createProduct(productData);
        if (newProduct) {
          toast({
            title: "Product created",
            description: `${values.name} has been created successfully.`,
          });
          form.reset();
          setProductImage([]);
        } else {
          toast({
            title: "Failed to create product",
            description: "Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error creating/updating product:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      navigate('/dashboard/products');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-haluna-text">
          {productId ? 'Edit Product' : 'Add Product'}
        </h1>
        <p className="text-haluna-text-light">
          {productId ? 'Edit your product details' : 'Add a new product to your shop'}
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
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
                    rows={4}
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category: any) => (
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
                  <FormLabel className="text-base">
                    Halal Certified
                  </FormLabel>
                  <FormDescription>
                    Mark if this product is Halal certified
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
                  <FormLabel className="text-base">
                    In Stock
                  </FormLabel>
                  <FormDescription>
                    Toggle if this product is available for purchase
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
          
          {/* Product image upload */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="productImage"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {productImage && productImage.length > 0 ? (
                  <img 
                    src={productImage[0]} 
                    alt="Product" 
                    className="h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                  </div>
                )}
                <Input
                  id="productImage"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {productId ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEditProductPage;

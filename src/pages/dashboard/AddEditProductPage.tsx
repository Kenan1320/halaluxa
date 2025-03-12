
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/ui/ImageUploader';
import { useAuth } from '@/context/AuthContext';
import { getProductById, createProduct, updateProduct } from '@/services/productService';
import { productCategories } from '@/models/product';

// Form schema with zod validation
const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  salePrice: z.coerce.number().nonnegative({ message: "Sale price must be a non-negative number" }).optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  inventoryCount: z.coerce.number().int().nonnegative({ message: "Inventory count must be a non-negative integer" }).optional(),
  images: z.array(z.string()).optional(),
  tags: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]).default("active"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AddEditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const isEditMode = !!id;

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      salePrice: 0,
      category: '',
      inventoryCount: 0,
      images: [],
      tags: '',
      status: 'active',
    },
  });

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true);
          const product = await getProductById(id);
          if (product) {
            setProductData(product);
            // Set form fields with existing product data
            reset({
              name: product.name,
              description: product.description || '',
              price: product.price,
              salePrice: product.sale_price || 0,
              category: product.category || '',
              inventoryCount: product.inventory_count || 0,
              status: product.status as "active" | "draft" | "archived" || 'active',
              tags: product.tags?.join(', ') || '',
            });
            setImages(product.images || []);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setErrorMessage("Failed to load product data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode, reset]);

  // Handle image uploads
  const handleImageChange = (newImages: string[]) => {
    setImages(newImages);
    setValue('images', newImages);
  };

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    if (!user) {
      toast({
        title: "Authorization Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare data for API
      const productData = {
        ...data,
        images: images,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        shop_id: user.shop_id || "",
      };
      
      if (isEditMode) {
        // Update existing product
        await updateProduct(id!, productData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Create new product
        await createProduct(productData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      
      // Return to products page after successful submission
      navigate('/dashboard/products');
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading product data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-destructive">{errorMessage}</p>
              <Button
                onClick={() => navigate('/dashboard/products')}
                className="mt-4"
              >
                Return to Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
        <Button variant="outline" onClick={() => navigate('/dashboard/products')}>
          Cancel
        </Button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Product Images */}
            <div className="space-y-2">
              <Label htmlFor="images">Product Images</Label>
              <ImageUploader
                value={images}
                onChange={handleImageChange}
                maxFiles={5}
              />
              {errors.images && <p className="text-sm text-destructive">{errors.images.message}</p>}
            </div>
            
            <Separator />
            
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name*</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...register("name")}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <Select
                  onValueChange={(value) => setValue("category", value)}
                  defaultValue={productData?.category || ""}
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
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                placeholder="Describe your product"
                className="min-h-[120px]"
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            
            <Separator />
            
            {/* Pricing and Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)*</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price")}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price ($)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("salePrice")}
                />
                {errors.salePrice && <p className="text-sm text-destructive">{errors.salePrice.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inventoryCount">Inventory Count</Label>
                <Input
                  id="inventoryCount"
                  type="number"
                  placeholder="0"
                  {...register("inventoryCount")}
                />
                {errors.inventoryCount && <p className="text-sm text-destructive">{errors.inventoryCount.message}</p>}
              </div>
            </div>
            
            <Separator />
            
            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="organic, featured, new"
                  {...register("tags")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue("status", value as "active" | "draft" | "archived")}
                  defaultValue={productData?.status || "active"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/products')}
              >
                Cancel
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </span>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditMode ? 'Update Product' : 'Create Product'
                  )}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AddEditProductPage;

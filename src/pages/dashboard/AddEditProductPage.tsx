import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Product, productCategories } from '@/models/product';
import { addProduct, updateProduct, fetchProductById } from '@/services/productService';
import { useAuth } from '@/context/AuthContext';
import ImageUploader from '@/components/ui/ImageUploader';

interface FormData {
  name: string;
  description: string;
  long_description: string;
  price: number;
  category: string;
  images: string[];
  is_halal_certified: boolean;
  is_published: boolean;
  inStock: number;
  details: any;
  shop_id: string;
}

const AddEditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<FormData>>({});

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        setIsLoading(true);
        try {
          const product = await fetchProductById(id);
          if (product) {
            setInitialValues(product);
            Object.keys(product).forEach(key => {
              setValue(key as keyof FormData, product[key]);
            });
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
            description: 'Failed to load product. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      loadProduct();
    }
  }, [id, setValue, navigate, toast]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to perform this action.',
          variant: 'destructive',
        });
        return;
      }
      
      const metadata = user.user_metadata || {};
      const shopId = metadata.shopId;
      
      if (!shopId) {
        toast({
          title: 'Error',
          description: 'You must have a shop to add products.',
          variant: 'destructive',
        });
        return;
      }

      const productData = {
        ...data,
        shop_id: shopId,
      };

      if (id) {
        await updateProduct(id, productData);
        toast({
          title: 'Success',
          description: 'Product updated successfully!',
        });
      } else {
        await addProduct(productData, user.id);
        toast({
          title: 'Success',
          description: 'Product added successfully!',
        });
      }
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setValue('images', images);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{id ? 'Edit Product' : 'Add New Product'}</h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Product name is required' }}
              render={({ field }) => (
                <Input type="text" id="name" placeholder="Product Name" {...field} />
              )}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Controller
              name="price"
              control={control}
              rules={{
                required: 'Price is required',
              }}
              render={({ field }) => (
                <Input 
                  type="number" 
                  id="price" 
                  placeholder="Price" 
                  {...field} 
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <Textarea id="description" placeholder="Description" {...field} />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        
        <div className="mb-6">
          <Label htmlFor="long_description">Long Description</Label>
          <Controller
            name="long_description"
            control={control}
            render={({ field }) => (
              <Textarea id="long_description" placeholder="Long Description" {...field} />
            )}
          />
        </div>
        
        <div className="mb-6">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>
        
        <div className="mb-6">
          <Label>Images</Label>
          <Controller
            name="images"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <ImageUploader
                initialImages={field.value}
                onImagesChange={handleImagesChange}
              />
            )}
          />
        </div>
        
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <Label htmlFor="inStock">Stock Quantity</Label>
            <Controller
              name="inStock"
              control={control}
              rules={{
                required: 'Stock quantity is required',
                min: 0,
              }}
              render={({ field }) => (
                <Input 
                  type="number" 
                  id="inStock" 
                  placeholder="Stock Quantity" 
                  {...field} 
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.inStock && <p className="text-red-500 text-sm">{errors.inStock.message}</p>}
          </div>
          <div>
            <Label className="flex items-center space-x-2" htmlFor="is_halal_certified">
              <span>Halal Certified</span>
              <Controller
                name="is_halal_certified"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="is_halal_certified"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </Label>
          </div>
        </div>
        
        <div className="mb-6 flex items-center space-x-2">
          <Label className="flex items-center space-x-2" htmlFor="is_published">
            <span>Published</span>
            <Controller
              name="is_published"
              control={control}
              render={({ field }) => (
                <Switch
                  id="is_published"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </Label>
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </form>
    </div>
  );
};

export default AddEditProductPage;

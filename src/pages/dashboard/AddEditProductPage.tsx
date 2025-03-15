import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/database';
import { createProduct, updateProduct, getProductById, uploadImage } from '@/services/productService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Input as FormInput } from '@/components/ui/input';
import { FormLabel, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import { Category } from '@/types/shop';
import { getCategories } from '@/services/shopService';

const productSchema = yup.object({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  category: yup.string().required('Category is required'),
  images: yup.array().of(yup.string()).min(1, 'At least one image is required'),
  is_halal_certified: yup.boolean().default(false),
  in_stock: yup.boolean().default(true),
  long_description: yup.string(),
  is_published: yup.boolean().default(false),
  stock: yup.number().integer('Stock must be an integer').min(0, 'Stock cannot be negative').default(1),
  delivery_mode: yup.string().oneOf(['online', 'local_pickup', 'local_delivery']).default('online'),
  pickup_options: yup.object().shape({
    store: yup.boolean().default(true),
    curbside: yup.boolean().default(false),
  }).default({ store: true, curbside: false }),
}).required();

const AddEditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<yup.InferType<typeof productSchema>>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      images: [],
      is_halal_certified: false,
      in_stock: true,
      long_description: '',
      is_published: false,
      stock: 1,
      delivery_mode: 'online',
      pickup_options: {
        store: true,
        curbside: false,
      },
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setLoading(true);
        try {
          const productData = await getProductById(id);
          if (productData) {
            setProduct(productData);
            setValue('name', productData.name);
            setValue('description', productData.description);
            setValue('price', productData.price);
            setValue('category', productData.category);
            setValue('images', productData.images);
            setValue('is_halal_certified', productData.is_halal_certified);
            setValue('in_stock', productData.in_stock);
            setValue('long_description', productData.long_description || '');
            setValue('is_published', productData.is_published);
            setValue('stock', productData.stock);
            setValue('delivery_mode', productData.delivery_mode);
            setValue('pickup_options', productData.pickup_options);
            setImagePreviews(productData.images);
          } else {
            toast({
              title: 'Error',
              description: 'Product not found',
              variant: 'destructive',
            });
            navigate('/dashboard/products');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast({
            title: 'Error',
            description: 'Failed to load product',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id, navigate, setValue, toast]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      }
    };

    fetchCategories();
  }, [toast]);

  const onSubmit = async (data: yup.InferType<typeof productSchema>) => {
    setLoading(true);
    try {
      // Upload new images
      const uploadedImageUrls = await Promise.all(
        selectedImages.map(async (image) => {
          const url = await uploadImage(image);
          return url;
        })
      );
  
      // Combine existing image URLs with newly uploaded image URLs
      const allImageUrls = [...imagePreviews, ...uploadedImageUrls];
  
      const productData = {
        ...data,
        images: allImageUrls,
      };
  
      let result: Product | null;
      if (id && product) {
        result = await updateProduct(id, productData);
      } else {
        result = await createProduct(productData);
      }
  
      if (result) {
        toast({
          title: 'Success',
          description: `Product ${id ? 'updated' : 'created'} successfully`,
        });
        navigate('/dashboard/products');
      } else {
        toast({
          title: 'Error',
          description: `Failed to ${id ? 'update' : 'create'} product`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit form',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);
  
      // Create previews for new images
      const newImagePreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newImagePreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...imagePreviews];
    updatedImages.splice(index, 1);
    setImagePreviews(updatedImages);
  };

  // Update the handleCategoryChange function to handle Category objects
  const handleCategoryChange = (newCategories: Category[]) => {
    // Map Category objects to their name strings
    const categoryNames = newCategories.map(cat => cat.name);
    setSelectedCategories(categoryNames);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Add Product'}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg">
          <div className="mb-4">
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="name"
                  className="mt-1 block w-full"
                  {...field}
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  className="mt-1 block w-full"
                  {...field}
                />
              )}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </Label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="price"
                  className="mt-1 block w-full"
                  {...field}
                />
              )}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">
              Images
            </Label>
            <Input
              type="file"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
            {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
            <div className="mt-2 flex space-x-2">
              {imagePreviews.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product image ${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="long_description" className="block text-sm font-medium text-gray-700">
              Long Description
            </Label>
            <Controller
              name="long_description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="long_description"
                  className="mt-1 block w-full"
                  {...field}
                />
              )}
            />
            {errors.long_description && <p className="text-red-500 text-xs mt-1">{errors.long_description.message}</p>}
          </div>

          <div className="mb-4 flex items-center space-x-2">
            <Label htmlFor="is_halal_certified" className="block text-sm font-medium text-gray-700">
              Halal Certified
            </Label>
            <Controller
              name="is_halal_certified"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="is_halal_certified"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            {errors.is_halal_certified && <p className="text-red-500 text-xs mt-1">{errors.is_halal_certified.message}</p>}
          </div>

          <div className="mb-4 flex items-center space-x-2">
            <Label htmlFor="in_stock" className="block text-sm font-medium text-gray-700">
              In Stock
            </Label>
            <Controller
              name="in_stock"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="in_stock"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
             {errors.in_stock && <p className="text-red-500 text-xs mt-1">{errors.in_stock.message}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock
            </Label>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="stock"
                  className="mt-1 block w-full"
                  {...field}
                />
              )}
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="delivery_mode" className="block text-sm font-medium text-gray-700">
              Delivery Mode
            </Label>
            <Controller
              name="delivery_mode"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a delivery mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="local_pickup">Local Pickup</SelectItem>
                    <SelectItem value="local_delivery">Local Delivery</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.delivery_mode && <p className="text-red-500 text-xs mt-1">{errors.delivery_mode.message}</p>}
          </div>

          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">Pickup Options</Label>
            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="store" className="inline-flex items-center space-x-2">
                  <Controller
                    name="pickup_options.store"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="store"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <span>Store</span>
                </Label>
              </div>
              <div>
                <Label htmlFor="curbside" className="inline-flex items-center space-x-2">
                  <Controller
                    name="pickup_options.curbside"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="curbside"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <span>Curbside</span>
                </Label>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center space-x-2">
            <Label htmlFor="is_published" className="block text-sm font-medium text-gray-700">
              Published
            </Label>
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
            {errors.is_published && <p className="text-red-500 text-xs mt-1">{errors.is_published.message}</p>}
          </div>

          <div>
            <Button type="submit" disabled={loading}>
              {id ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddEditProductPage;

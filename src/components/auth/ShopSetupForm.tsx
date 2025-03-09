import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { createShop } from '@/services/shopService';
import { shopCategories } from '@/models/shop';
import ImageUploader from '@/components/ui/ImageUploader';

interface ShopSetupFormProps {
  onSetupComplete: () => void;
}

interface FormData {
  businessName: string;
  description: string;
  category: string;
  location: string;
  address?: string;
  logoUrl?: string;
  coverImage?: string;
}

const ShopSetupForm: React.FC<ShopSetupFormProps> = ({ onSetupComplete }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a shop',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Fix argument count issue - pass both userId and shopData
      const shop = await createShop(user.id, {
        name: data.businessName,
        description: data.description,
        category: data.category,
        location: data.location,
        address: data.address,
        logo_url: logoUrl || undefined,
        cover_image: coverImage || undefined,
      });

      if (shop) {
        toast({
          title: 'Success',
          description: 'Your shop has been created successfully!',
        });
        onSetupComplete();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create shop. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        title: 'Error',
        description: 'Failed to create shop. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setLogoUrl(urls[0]);
    }
  };

  const handleCoverUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setCoverImage(urls[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            {...register('businessName', { required: 'Business name is required' })}
            placeholder="Your business name"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            placeholder="Describe your business"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
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
                  {shopCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register('location', { required: 'Location is required' })}
            placeholder="City, Country"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address">Address (Optional)</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="Full address"
          />
        </div>

        <div>
          <Label>Logo</Label>
          <div className="mt-2">
            <ImageUploader
              initialImages={logoUrl ? [logoUrl] : []}
              onImagesChange={handleLogoUpload}
              maxImages={1}
              label="Upload Logo"
            />
          </div>
        </div>

        <div>
          <Label>Cover Image</Label>
          <div className="mt-2">
            <ImageUploader
              initialImages={coverImage ? [coverImage] : []}
              onImagesChange={handleCoverUpload}
              maxImages={1}
              label="Upload Cover Image"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Shop...' : 'Create Shop'}
      </Button>
    </form>
  );
};

export default ShopSetupForm;

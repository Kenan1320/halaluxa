import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '@/services/shopService';
import { adaptShopType } from '@/utils/typeAdapters';

// Assuming these types are correctly defined in your project
type FormValues = {
  name: string;
  description: string;
  category: string;
  address: string;
  location: string;
  website_url?: string;
  phone?: string;
  email?: string;
};

const SettingsPage = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      address: '',
      location: '',
      website_url: '',
      phone: '',
      email: '',
    }
  });

  useEffect(() => {
    if (user) {
      // Set values directly from user properties
      setValue('name', user.shop_name || '');
      setValue('description', user.shop_description || '');
      setValue('category', user.shop_category || '');
      setValue('address', user.address || '');
      setValue('location', user.shop_location || '');
      setValue('website_url', user.website || '');
      setValue('phone', user.phone || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update user profile with shop data
      await updateProfile(user.id, {
        shop_name: data.name,
        shop_description: data.description,
        shop_category: data.category,
        address: data.address,
        shop_location: data.location,
        website: data.website_url,
        phone: data.phone,
        email: data.email,
      });
      
      toast({
        title: "Settings updated",
        description: "Your business settings have been successfully updated.",
      });
      
      // Refresh user data
      refreshUser();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Business Settings</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" {...register('name', { required: true })} />
                {errors.name && <p className="text-red-500 text-sm">Business name is required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  {...register('description', { required: true })}
                  className="min-h-[100px]"
                />
                {errors.description && <p className="text-red-500 text-sm">Description is required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register('category', { required: true })} />
                {errors.category && <p className="text-red-500 text-sm">Category is required</p>}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <Input id="website_url" type="url" {...register('website_url')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" {...register('phone')} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
              </div>
            </CardContent>
          </Card>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;

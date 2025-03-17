import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // If we have user data, set the form values
      setFormValues({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        website: user.website || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error('User not authenticated.');
      }

      // Prepare the update object
      const updateData: {
        name: string;
        email: string;
        phone?: string;
        website?: string;
        address?: string;
        city?: string;
        state?: string;
        zip?: string;
      } = {
        name: formValues.name,
        email: formValues.email,
      };

      // Conditionally add fields if they have values
      if (formValues.phone) updateData.phone = formValues.phone;
      if (formValues.website) updateData.website = formValues.website;
      if (formValues.address) updateData.address = formValues.address;
      if (formValues.city) updateData.city = formValues.city;
      if (formValues.state) updateData.state = formValues.state;
      if (formValues.zip) updateData.zip = formValues.zip;

      // Call the updateUser function
      await updateUser(user.id, updateData);

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update profile. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Update your profile settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" value={formValues.name} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" value={formValues.email} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input type="tel" id="phone" name="phone" value={formValues.phone} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input type="url" id="website" name="website" value={formValues.website} onChange={handleChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input type="text" id="address" name="address" value={formValues.address} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input type="text" id="city" name="city" value={formValues.city} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input type="text" id="state" name="state" value={formValues.state} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="zip">Zip Code</Label>
                <Input type="text" id="zip" name="zip" value={formValues.zip} onChange={handleChange} />
              </div>
            </div>
            <CardFooter>
              <Button disabled={isLoading} type="submit">
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

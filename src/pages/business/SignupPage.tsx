
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createBusinessAccount } from '@/services/authService';
import { BusinessSignupFormData } from '@/models/shop';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<BusinessSignupFormData>({
    email: '',
    password: '',
    name: '',
    businessName: '',
    businessCategory: 'general', // Default category
    businessDescription: '',
    location: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createBusinessAccount(formData);
      
      if (result.success) {
        toast({
          title: 'Account created',
          description: 'Your business account has been created successfully.',
        });
        
        // Set user in context and navigate to create shop page
        setUser(result.data.user);
        navigate('/business/create-shop');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create account',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create a Business Account</CardTitle>
          <CardDescription>
            Sign up to start selling your products and services
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Your Name</label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium">Business Name</label>
              <Input
                id="businessName"
                name="businessName"
                placeholder="Your Business Name"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="businessCategory" className="text-sm font-medium">Business Category</label>
              <select
                id="businessCategory"
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="general">General</option>
                <option value="food">Food & Beverage</option>
                <option value="retail">Retail</option>
                <option value="services">Services</option>
                <option value="tech">Technology</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="businessDescription" className="text-sm font-medium">Business Description</label>
              <textarea
                id="businessDescription"
                name="businessDescription"
                placeholder="Tell us about your business"
                value={formData.businessDescription}
                onChange={handleChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Business Location</label>
              <Input
                id="location"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number (optional)</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+123456789"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Business Account'
              )}
            </Button>
            
            <div className="text-sm text-center">
              Already have an account?{' '}
              <Link to="/business/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignupPage;

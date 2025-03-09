
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { createBusinessAccount } from '@/services/authService';
import { BusinessSignupFormData } from '@/models/shop';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
  name: z.string().min(1, { message: 'Please enter your name' }),
  businessName: z.string().min(1, { message: 'Please enter your business name' }),
  businessCategory: z.string().min(1, { message: 'Please select a business category' }),
  businessDescription: z.string().min(1, { message: 'Please provide a brief description of your business' }),
  location: z.string().min(1, { message: 'Please enter your business location' }),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<BusinessSignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      businessName: '',
      businessCategory: '',
      businessDescription: '',
      location: '',
      phone: '',
    }
  });

  const onSubmit = async (data: BusinessSignupFormData) => {
    setLoading(true);
    try {
      const result = await createBusinessAccount(
        data.email,
        data.password,
        data.name,
        {
          businessName: data.businessName,
          businessCategory: data.businessCategory,
          businessDescription: data.businessDescription,
          location: data.location,
          phone: data.phone
        }
      );

      if (result.success) {
        toast({
          title: "Account created!",
          description: "Your business account has been created successfully.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Create Your Business Account</CardTitle>
          <CardDescription>
            Join our halal marketplace and start selling your products to customers around the world.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register('email')}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                {...register('businessName')}
                className={errors.businessName ? "border-red-500" : ""}
              />
              {errors.businessName && (
                <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCategory">Business Category</Label>
              <Select onValueChange={(value) => register('businessCategory').onChange({ target: { value } })}>
                <SelectTrigger className={errors.businessCategory ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
                  <SelectItem value="Clothing & Fashion">Clothing & Fashion</SelectItem>
                  <SelectItem value="Health & Beauty">Health & Beauty</SelectItem>
                  <SelectItem value="Home & Living">Home & Living</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.businessCategory && (
                <p className="text-red-500 text-xs mt-1">{errors.businessCategory.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                {...register('businessDescription')}
                className={errors.businessDescription ? "border-red-500" : ""}
                placeholder="Tell us about your business..."
                rows={3}
              />
              {errors.businessDescription && (
                <p className="text-red-500 text-xs mt-1">{errors.businessDescription.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Business Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  className={errors.location ? "border-red-500" : ""}
                  placeholder="City, Country"
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Business Account'
              )}
            </Button>
            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link to="/business/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignupPage;

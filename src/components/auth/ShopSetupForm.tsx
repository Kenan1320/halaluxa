
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Store, ArrowRight, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { shopCategories } from '@/models/user';
import { supabase } from '@/integrations/supabase/client';
import { ImageUploader } from '@/components/ui/ImageUploader';

interface ShopSetupFormProps {
  onSetupComplete: () => void;
  onSkipSetup: () => void;
}

const ShopSetupForm = ({ onSetupComplete, onSkipSetup }: ShopSetupFormProps) => {
  const { user, updateBusinessProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    shopName: '',
    shopDescription: '',
    shopCategory: '',
    shopLocation: '',
  });
  
  const [logoUrl, setLogoUrl] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, shopCategory: value }));
  };
  
  const handleLogoChange = (urls: string[]) => {
    setLogoUrl(urls);
  };
  
  const handleCoverChange = (urls: string[]) => {
    setCoverImage(urls);
  };
  
  const handleNext = () => {
    if (!formData.shopName) {
      toast({
        title: "Shop Name Required",
        description: "Please enter a name for your shop",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.shopCategory) {
      toast({
        title: "Category Required",
        description: "Please select a category for your shop",
        variant: "destructive"
      });
      return;
    }
    
    setStep(2);
  };
  
  const handleBack = () => {
    setStep(1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to set up a shop",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Update the business profile
      const success = await updateBusinessProfile({
        shopName: formData.shopName,
        shopDescription: formData.shopDescription,
        shopCategory: formData.shopCategory,
        shopLocation: formData.shopLocation,
        shopLogo: logoUrl.length > 0 ? logoUrl[0] : null,
      });
      
      if (success) {
        // Create a shop record in the shops table
        const { error: shopError } = await supabase
          .from('shops')
          .insert({
            name: formData.shopName,
            description: formData.shopDescription,
            category: formData.shopCategory,
            location: formData.shopLocation,
            logo_url: logoUrl.length > 0 ? logoUrl[0] : null,
            cover_image: coverImage.length > 0 ? coverImage[0] : null,
            owner_id: user.id,
          });
        
        if (shopError) {
          throw shopError;
        }
        
        toast({
          title: "Shop Created",
          description: "Your shop has been set up successfully",
        });
        
        onSetupComplete();
      } else {
        throw new Error("Failed to update business profile");
      }
    } catch (error: any) {
      console.error('Error setting up shop:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to set up shop",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-8 text-center" variants={itemVariants}>
        <h1 className="text-3xl font-serif font-bold text-haluna-text mb-2">Set Up Your Shop</h1>
        <p className="text-haluna-text-light">
          Create your shop to start selling products to customers
        </p>
      </motion.div>
      
      <Card className="p-6 shadow-md relative overflow-hidden">
        {/* Progress indicator */}
        <div className="mb-6 relative z-10">
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div 
              className={`h-2 bg-haluna-primary rounded-full transition-all duration-300 ${
                step === 1 ? 'w-1/2' : 'w-full'
              }`}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-haluna-text-light">
            <span className={step === 1 ? 'font-medium text-haluna-primary' : 'font-medium text-green-500'}>
              Basic Information
            </span>
            <span className={step === 2 ? 'font-medium text-haluna-primary' : 'text-haluna-text-light'}>
              Shop Identity
            </span>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-haluna-primary/5 rounded-full z-0" />
        <div className="absolute bottom-0 left-0 w-40 h-40 -mb-10 -ml-10 bg-haluna-primary/5 rounded-full z-0" />
        
        <form onSubmit={handleSubmit} className="relative z-10">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <motion.div variants={itemVariants}>
                <Label htmlFor="shopName" className="text-sm font-medium text-haluna-text mb-1 block">
                  Shop Name *
                </Label>
                <Input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
                  placeholder="Enter your shop name"
                  required
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Label htmlFor="shopCategory" className="text-sm font-medium text-haluna-text mb-1 block">
                  Category *
                </Label>
                <Select
                  value={formData.shopCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary">
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
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Label htmlFor="shopLocation" className="text-sm font-medium text-haluna-text mb-1 block">
                  Shop Location
                </Label>
                <Input
                  type="text"
                  id="shopLocation"
                  name="shopLocation"
                  value={formData.shopLocation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
                  placeholder="City, State, Country"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Label htmlFor="shopDescription" className="text-sm font-medium text-haluna-text mb-1 block">
                  Shop Description
                </Label>
                <Textarea
                  id="shopDescription"
                  name="shopDescription"
                  value={formData.shopDescription}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
                  placeholder="Describe what your shop offers..."
                  rows={4}
                />
              </motion.div>
              
              <motion.div className="flex justify-between pt-4" variants={itemVariants}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onSkipSetup}
                >
                  Skip for now
                </Button>
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700"
                >
                  Next Step
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <motion.div variants={itemVariants}>
                <Label className="text-sm font-medium text-haluna-text mb-2 block">
                  Shop Logo
                </Label>
                <ImageUploader
                  initialImages={logoUrl}
                  onImagesChange={handleLogoChange}
                  maxImages={1}
                  hint="Upload your shop logo (recommended size: 200x200px)"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Label className="text-sm font-medium text-haluna-text mb-2 block">
                  Shop Cover Image
                </Label>
                <ImageUploader
                  initialImages={coverImage}
                  onImagesChange={handleCoverChange}
                  maxImages={1}
                  hint="Upload a cover image for your shop (recommended size: 1200x300px)"
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="pt-4">
                <p className="text-sm text-haluna-text-light mb-4">
                  You can always update these details later from your shop settings.
                </p>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Creating Shop...
                      </>
                    ) : (
                      <>
                        <Store size={16} className="mr-2" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </form>
      </Card>
      
      <motion.div className="mt-8 text-center text-haluna-text-light text-sm" variants={itemVariants}>
        Need help? Contact our support team at support@haluna.com
      </motion.div>
    </motion.div>
  );
};

export default ShopSetupForm;

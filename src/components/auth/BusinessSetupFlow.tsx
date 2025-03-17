
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Store, MapPin, CreditCard, Smartphone, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface BusinessSetupProps {
  onComplete: (data: any) => void;
  onSkip?: () => void;
}

const BusinessSetupFlow = ({ onComplete, onSkip }: BusinessSetupProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessCategory: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    businessPhone: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const goToNextStep = () => {
    setStep(prev => prev + 1);
  };

  const goToPrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      showSuccessMessage();
    }, 1500);
  };
  
  const showSuccessMessage = () => {
    // Show success toast
    toast.success('Business registration submitted!', {
      description: 'Your business will go through our approval process in the next 24-72 hours.',
    });
    
    // Call the onComplete callback with the form data
    onComplete(formData);
  };

  const businessCategories = [
    'Food & Dining', 
    'Retail', 
    'Health & Beauty', 
    'Services', 
    'Education', 
    'Tech', 
    'Home Services',
    'Fashion',
    'Entertainment',
    'Other'
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      {step < 4 ? (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Set Up Your Business</CardTitle>
            <CardDescription>Let's get your business ready for customers</CardDescription>
            
            <div className="flex justify-between mt-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`flex items-center ${i < step ? 'text-green-600' : i === step ? 'text-primary' : 'text-gray-400'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                    ${i < step ? 'border-green-600 bg-green-100' : i === step ? 'border-primary' : 'border-gray-300'}`}>
                    {i < step ? <Check className="h-4 w-4" /> : i}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:block">
                    {i === 1 ? 'Basic Info' : i === 2 ? 'Location' : 'Review'}
                  </span>
                  {i < 3 && <div className="h-0.5 w-10 bg-gray-200 mx-2 hidden sm:block"></div>}
                </div>
              ))}
            </div>
          </CardHeader>
          
          <CardContent>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium mb-1">Business Name</label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Your Business Name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="businessDescription" className="block text-sm font-medium mb-1">Business Description</label>
                    <Textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleChange}
                      placeholder="Tell us about your business"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="businessCategory" className="block text-sm font-medium mb-1">Business Category</label>
                    <Select
                      value={formData.businessCategory}
                      onValueChange={(value) => handleSelectChange('businessCategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessCategories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="businessAddress" className="block text-sm font-medium mb-1">Street Address</label>
                    <Input
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="businessCity" className="block text-sm font-medium mb-1">City</label>
                      <Input
                        id="businessCity"
                        name="businessCity"
                        value={formData.businessCity}
                        onChange={handleChange}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="businessState" className="block text-sm font-medium mb-1">State</label>
                      <Input
                        id="businessState"
                        name="businessState"
                        value={formData.businessState}
                        onChange={handleChange}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="businessZip" className="block text-sm font-medium mb-1">Zip Code</label>
                      <Input
                        id="businessZip"
                        name="businessZip"
                        value={formData.businessZip}
                        onChange={handleChange}
                        placeholder="Zip Code"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="businessPhone" className="block text-sm font-medium mb-1">Business Phone</label>
                      <Input
                        id="businessPhone"
                        name="businessPhone"
                        value={formData.businessPhone}
                        onChange={handleChange}
                        placeholder="(555) 555-5555"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Business Information</h3>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-gray-500 dark:text-gray-400">Business Name:</div>
                      <div className="font-medium">{formData.businessName || 'Not provided'}</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Category:</div>
                      <div className="font-medium">{formData.businessCategory || 'Not provided'}</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Address:</div>
                      <div className="font-medium">
                        {formData.businessAddress ? (
                          <>
                            {formData.businessAddress}<br />
                            {formData.businessCity}, {formData.businessState} {formData.businessZip}
                          </>
                        ) : (
                          'Not provided'
                        )}
                      </div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Phone:</div>
                      <div className="font-medium">{formData.businessPhone || 'Not provided'}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Description</h3>
                    <p className="text-sm">{formData.businessDescription || 'No description provided.'}</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
                    <p>
                      <strong>Note:</strong> Your business will go through an approval process (24-72 hours)
                      before it's visible on the platform.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={goToPrevStep}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={onSkip}>
                Skip for now
              </Button>
            )}
            
            {step < 3 ? (
              <Button onClick={goToNextStep}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            )}
          </CardFooter>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your business has been submitted for approval. This process typically takes 24-72 hours.
          </p>
          
          <div className="max-w-md mx-auto mb-6 overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h3 className="font-bold">Business Benefits</h3>
            </div>
            
            <ul className="p-4 space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full mr-3 mt-0.5">
                  <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm">Share with your audience</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full mr-3 mt-0.5">
                  <Store className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm">All visitors see your store</span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full mr-3 mt-0.5">
                  <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm">Get recommended to local shoppers</span>
              </li>
              <li className="flex items-start">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-full mr-3 mt-0.5">
                  <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm">Accept payments seamlessly</span>
              </li>
              <li className="flex items-start">
                <div className="bg-pink-100 dark:bg-pink-900/30 p-1.5 rounded-full mr-3 mt-0.5">
                  <Smartphone className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </div>
                <span className="text-sm">Mobile-optimized storefront</span>
              </li>
            </ul>
          </div>
          
          <Button onClick={() => onComplete(formData)}>
            Continue to Dashboard
          </Button>
        </motion.div>
      )}
    </Card>
  );
};

export default BusinessSetupFlow;

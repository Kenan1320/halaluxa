
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Flame, 
  Truck, 
  Users, 
  Percent, 
  Clock, 
  DollarSign, 
  Smartphone, 
  Copy, 
  CheckCircle, 
  CalendarClock,
  Shield,
  BadgeCheck
} from 'lucide-react';

const AffiliateProgramPage = () => {
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('affiliate');
  const [referralLink, setReferralLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Form state for driver application
  const [driverForm, setDriverForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    vehicle: '',
    experience: '',
    license: '',
    additionalInfo: ''
  });
  
  const generateReferralLink = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to generate your unique referral link.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a referral link with the user's ID
    const baseUrl = window.location.origin;
    const newReferralLink = `${baseUrl}/signup?ref=${user?.id || 'unknown'}`;
    setReferralLink(newReferralLink);
    
    toast({
      title: "Referral Link Generated",
      description: "Your referral link has been created successfully!",
      variant: "default" // Changed from "success" to a valid variant
    });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
      variant: "default" // Changed from "success" to a valid variant
    });
    
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  const handleDriverInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDriverForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const submitDriverApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to submit your application.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would submit the form data to your backend
    console.log("Driver application submitted:", driverForm);
    
    toast({
      title: "Application Submitted",
      description: "Your driver application has been received. We'll contact you soon!",
      variant: "default" // Changed from "success" to a valid variant
    });
    
    // Reset form
    setDriverForm({
      fullName: '',
      email: '',
      phone: '',
      city: '',
      vehicle: '',
      experience: '',
      license: '',
      additionalInfo: ''
    });
  };
  
  return (
    <div className="container max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">Halvi Affiliate & Driver Programs</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our community and earn by referring businesses or delivering products to customers.
          </p>
        </motion.div>
      </div>
      
      <Tabs defaultValue="affiliate" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="affiliate" className="text-lg py-3">
            <Percent className="mr-2 h-5 w-5" />
            Affiliate Program
          </TabsTrigger>
          <TabsTrigger value="driver" className="text-lg py-3">
            <Truck className="mr-2 h-5 w-5" />
            Driver Program
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="affiliate" className="mt-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center">
                      <Flame className="h-6 w-6 text-orange-500 mr-2" />
                      <CardTitle>Earn by Referring Businesses to Halvi!</CardTitle>
                    </div>
                    <CardDescription>
                      Become a Halvi Affiliate and earn commission on every order from businesses you refer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">How It Works</h3>
                      <ol className="space-y-4">
                        <li className="flex items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</div>
                          <div>
                            <span className="font-medium">Get Your Referral Link:</span> Click "Join as an Affiliate" to generate a unique referral link that can be shared with business owners.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</div>
                          <div>
                            <span className="font-medium">Refer a Business:</span> If a business owner signs up and registers their store using your referral link, you are automatically enrolled in the affiliate program.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</div>
                          <div>
                            <span className="font-medium">Earn Commission:</span> You will receive 50% of Halvi's earnings per order from that store.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</div>
                          <div>
                            <span className="font-medium">Lifetime Earnings (Until $70K in Store Orders):</span>
                            <ul className="list-disc ml-6 mt-2">
                              <li>Your commission continues until the referred store reaches $70,000 in total sales on Halvi.</li>
                              <li>The guaranteed earnings are dynamically calculated using this formula: G = (R × 1.5) × (M + 0.1)</li>
                              <li>R = Store's monthly revenue</li>
                              <li>M = Store's profit margin</li>
                              <li>G = Guaranteed sales target</li>
                            </ul>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</div>
                          <div>
                            <span className="font-medium">Dashboard Tracking:</span> Affiliates can log in and monitor referred stores, earnings, and payout history in their dashboard.
                          </div>
                        </li>
                      </ol>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold mb-4">Why Join as an Affiliate?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start">
                          <DollarSign className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <span className="font-medium">Passive Income</span>
                            <p className="text-sm text-gray-600">Earn without managing a store yourself.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <span className="font-medium">Unlimited Referrals</span>
                            <p className="text-sm text-gray-600">No cap on the number of businesses you can invite.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                          <div>
                            <span className="font-medium">Long-Term Commissions</span>
                            <p className="text-sm text-gray-600">Continue earning until your referred store reaches its threshold.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full">
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={generateReferralLink}
                      >
                        Join as an Affiliate
                      </Button>
                      
                      {referralLink && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                          <Label htmlFor="referral-link">Your Referral Link:</Label>
                          <div className="flex mt-1">
                            <Input 
                              id="referral-link" 
                              value={referralLink} 
                              readOnly 
                              className="flex-1"
                            />
                            <Button 
                              variant="outline" 
                              className="ml-2" 
                              onClick={copyToClipboard}
                            >
                              {copySuccess ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Share this link with business owners to start earning!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 h-full">
                  <CardHeader>
                    <CardTitle>Affiliate Dashboard Demo</CardTitle>
                    <CardDescription>See how simple it is to track your earnings</CardDescription>
                  </CardHeader>
                  <CardContent className="relative h-[500px] overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src="/lovable-uploads/d06ec500-7072-4304-aaca-a1903d007c85.png" 
                      alt="Affiliate Dashboard" 
                      className="absolute inset-0 w-full h-full object-cover object-top hover:object-bottom transition-all duration-10000 ease-linear"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="driver" className="mt-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Truck className="h-6 w-6 text-blue-500 mr-2" />
                      <CardTitle>Halvi Dash & Driver Program – Drive, Deliver & Earn!</CardTitle>
                    </div>
                    <CardDescription>
                      Join our team of drivers to deliver products and earn competitive pay with flexible hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Driver Requirements</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Must be 21 years or older
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Hold a valid driver's license
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Provide proof of insurance and vehicle registration
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Own a smartphone to use the Halvi Driver App
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Pass a background check and driving history review
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold mb-4">How to Become a Halvi Driver</h3>
                      <ol className="space-y-4">
                        <li className="flex items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</div>
                          <div>
                            <span className="font-medium">Apply Online:</span> Complete the driver application form below.
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</div>
                          <div>
                            <span className="font-medium">Verification & Approval:</span>
                            <ul className="list-disc ml-6 mt-2">
                              <li>The Halvi admin team will review applications and perform background checks.</li>
                              <li>Approved drivers will receive login credentials for the driver dashboard.</li>
                            </ul>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</div>
                          <div>
                            <span className="font-medium">Start Driving:</span> Once verified, drivers can accept delivery requests and start earning.
                          </div>
                        </li>
                      </ol>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-xl font-semibold mb-4">Earnings & Benefits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start">
                          <CalendarClock className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <span className="font-medium">Flexible Hours</span>
                            <p className="text-sm text-gray-600">Drive whenever you want; no fixed schedule.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <DollarSign className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <span className="font-medium">Competitive Pay</span>
                            <p className="text-sm text-gray-600">Earn per delivery with bonuses for high performance.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <BadgeCheck className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                          <div>
                            <span className="font-medium">Instant Payouts</span>
                            <p className="text-sm text-gray-600">Get paid fast through Halvi's driver system.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Driver Application Form</CardTitle>
                    <CardDescription>
                      Fill out the form below to apply as a Halvi Driver.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={submitDriverApplication} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input 
                            id="fullName" 
                            name="fullName" 
                            value={driverForm.fullName} 
                            onChange={handleDriverInputChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={driverForm.email} 
                            onChange={handleDriverInputChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={driverForm.phone} 
                            onChange={handleDriverInputChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City/Location *</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={driverForm.city} 
                            onChange={handleDriverInputChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicle">Vehicle Type *</Label>
                          <Input 
                            id="vehicle" 
                            name="vehicle" 
                            value={driverForm.vehicle} 
                            onChange={handleDriverInputChange} 
                            placeholder="Car, Motorcycle, Bicycle, etc."
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Delivery Experience</Label>
                          <Input 
                            id="experience" 
                            name="experience" 
                            value={driverForm.experience} 
                            onChange={handleDriverInputChange} 
                            placeholder="Years of experience (if any)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="license">Driver's License Number *</Label>
                          <Input 
                            id="license" 
                            name="license" 
                            value={driverForm.license} 
                            onChange={handleDriverInputChange} 
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="additionalInfo">Additional Information</Label>
                        <Textarea 
                          id="additionalInfo" 
                          name="additionalInfo" 
                          value={driverForm.additionalInfo} 
                          onChange={handleDriverInputChange} 
                          placeholder="Tell us why you want to be a Halvi driver and any other relevant information..."
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center border-t pt-4">
                        <Shield className="h-5 w-5 text-gray-500 mr-2" />
                        <p className="text-sm text-gray-500">
                          Your information is secure and will only be used for the driver application process.
                        </p>
                      </div>
                      <Button type="submit" className="w-full" size="lg">
                        Apply as a Driver
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 h-full">
                  <CardHeader>
                    <CardTitle>Driver App Demo</CardTitle>
                    <CardDescription>Experience our driver app interface</CardDescription>
                  </CardHeader>
                  <CardContent className="relative h-[800px] overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src="/lovable-uploads/d06ec500-7072-4304-aaca-a1903d007c85.png" 
                      alt="Driver App Interface" 
                      className="absolute inset-0 w-full h-full object-cover object-top hover:object-bottom transition-all duration-10000 ease-linear"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AffiliateProgramPage;

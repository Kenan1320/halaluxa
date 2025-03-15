
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Car, 
  Link as LinkIcon, 
  DollarSign, 
  Clock, 
  Users, 
  Check, 
  Star, 
  Clipboard, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  Truck,
  PhoneCall,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Calendar,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/layout/Footer';

type UserType = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

// Dummy data for UI demonstration
const testimonialsData = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Affiliate",
    comment: "I've earned over $2,000 in passive income just by referring local restaurants to Halvi. The commission structure is really generous!",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: 2,
    name: "Ahmed K.",
    role: "Driver",
    comment: "The flexible hours are perfect for my schedule. I can work when I want and the app makes it easy to track deliveries and earnings.",
    avatar: "https://i.pravatar.cc/150?img=59"
  },
  {
    id: 3,
    name: "Jessica T.",
    role: "Affiliate",
    comment: "As a food blogger, partnering with Halvi was a natural fit. My audience loves the service and I earn commissions on every order they place.",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

const faqData = [
  {
    id: 1,
    question: "How do I join the affiliate program?",
    answer: "Click on the 'Join as an Affiliate' button on this page. You'll need to complete a brief application form. Once approved, you'll receive your unique referral link."
  },
  {
    id: 2,
    question: "How much can I earn as an affiliate?",
    answer: "You earn 50% of Halvi's revenue from each order placed through stores you've referred. This continues until the store reaches $70,000 in total sales."
  },
  {
    id: 3,
    question: "When and how do I get paid?",
    answer: "Payments are processed monthly for all earnings over $50. You can choose to receive payments via direct deposit, PayPal, or store credit."
  },
  {
    id: 4,
    question: "What are the requirements to become a driver?",
    answer: "You must be at least 21 years old, have a valid driver's license, vehicle insurance, and pass a background check. You'll also need a smartphone to use the Halvi Driver app."
  },
  {
    id: 5,
    question: "How flexible are the driving hours?",
    answer: "Completely flexible! You can choose when to go online and accept deliveries. There are no minimum hour requirements."
  }
];

const AffiliateProgram = () => {
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('affiliate');
  const [referralLink, setReferralLink] = useState('');
  const { mode } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  
  const isDark = mode === 'dark';

  // Generate a random referral link when the component mounts
  useEffect(() => {
    if (isLoggedIn && user) {
      setReferralLink(`https://halvi.app/ref/${user.id.substring(0, 8)}`);
    }
  }, [isLoggedIn, user]);

  const handleCopyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link copied!",
        description: "Your referral link has been copied to clipboard.",
        variant: "success",
      });
    } else {
      toast({
        title: "Sign in required",
        description: "Please sign in to generate your unique referral link.",
        variant: "destructive",
      });
    }
  };

  const handleApplyAsDriver = () => {
    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply as a driver.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Application received!",
      description: "Your driver application has been submitted. We'll review it and get back to you soon.",
      variant: "success",
    });
  };

  const handleJoinAffiliate = () => {
    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join our affiliate program.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate the referral link
    setReferralLink(`https://halvi.app/ref/${user?.id.substring(0, 8)}`);
    
    toast({
      title: "Welcome to our affiliate program!",
      description: "Your referral link has been generated. Start sharing to earn!",
      variant: "success",
    });
  };

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className={`min-h-screen pt-16 pb-20 ${isDark ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className={`py-16 ${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-b from-blue-50 via-white to-blue-50'}`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className={`text-4xl md:text-5xl font-serif font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Earn With Halvi
          </h1>
          <p className={`text-xl max-w-2xl mx-auto mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Join our growing community of affiliates and drivers to start earning with flexible options that fit your lifestyle.
          </p>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className={`grid w-full grid-cols-2 mb-8 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <TabsTrigger value="affiliate" className="text-base py-3">
                <Rocket className="mr-2 h-5 w-5" />
                Affiliate Program
              </TabsTrigger>
              <TabsTrigger value="driver" className="text-base py-3">
                <Car className="mr-2 h-5 w-5" />
                Driver Program
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="affiliate" className="mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key="affiliate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`shadow-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">Earn by Referring Businesses to Halvi!</CardTitle>
                      <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Share Halvi with businesses and earn 50% commission on every order they process
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-6">
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                          <h3 className="font-medium text-lg mb-2 flex items-center">
                            <LinkIcon className="mr-2 h-5 w-5 text-blue-500" />
                            Get Your Referral Link
                          </h3>
                          <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Click "Join as an Affiliate" to generate a unique referral link that can be shared with business owners.
                          </p>
                          
                          {referralLink && (
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={referralLink}
                                readOnly
                                className={`flex-1 p-2 text-sm rounded-l-md border ${
                                  isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
                                }`}
                              />
                              <button
                                onClick={handleCopyReferralLink}
                                className="p-2 rounded-r-md bg-blue-600 text-white"
                              >
                                <Clipboard className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                            <h3 className="font-medium text-lg mb-2 flex items-center">
                              <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                              Earn Commission
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              You will receive 50% of Halvi's earnings per order from stores you refer.
                            </p>
                          </div>
                          
                          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                            <h3 className="font-medium text-lg mb-2 flex items-center">
                              <Clock className="mr-2 h-5 w-5 text-purple-500" />
                              Lifetime Earnings
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Keep earning until your referred shop reaches $70,000 in total sales on Halvi.
                            </p>
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                          <h3 className="font-medium text-lg mb-3">Why Join as an Affiliate?</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className="font-medium">Passive Income</span> – Earn without managing a store yourself.
                              </span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className="font-medium">Unlimited Referrals</span> – No cap on the number of businesses you can invite.
                              </span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                <span className="font-medium">Long-Term Commissions</span> – Continue earning until the shop reaches its threshold.
                              </span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                          <h3 className="font-medium text-lg mb-2">Earnings Formula</h3>
                          <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Your guaranteed earnings are calculated using:
                          </p>
                          <div className={`p-3 rounded text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                            <p className="font-mono text-lg">G = (R × 1.5) × (M + 0.1)</p>
                            <div className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <p>R = Store's monthly revenue</p>
                              <p>M = Store's profit margin</p>
                              <p>G = Guaranteed sales target</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleJoinAffiliate} 
                        className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                      >
                        <Rocket className="mr-2 h-5 w-5" />
                        Join as an Affiliate
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Affiliate Dashboard Preview */}
                  <div className="mt-12">
                    <h2 className={`text-2xl font-bold text-center mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Your Affiliate Dashboard
                    </h2>
                    <div className="relative mx-auto max-w-xl">
                      <div className={`p-3 rounded-xl border-8 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} shadow-2xl mx-auto`} style={{maxWidth: '300px'}}>
                        <div className={`h-16 rounded-t-lg ${isDark ? 'bg-gray-800' : 'bg-blue-600'} flex items-center justify-between px-4`}>
                          <span className="text-white font-medium">Affiliate Dashboard</span>
                          <span className="text-white text-sm">2:30 PM</span>
                        </div>
                        <div className={`rounded-b-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Earnings</div>
                            <div className={`text-xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>$1,240.50</div>
                          </div>
                          <div className="p-4 space-y-3">
                            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Referrals</div>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}>
                              <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Express Café</span>
                              <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>$534.25</span>
                            </div>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}>
                              <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Fresh Grocery</span>
                              <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>$421.75</span>
                            </div>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex justify-between items-center`}>
                              <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Urban Kitchen</span>
                              <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>$284.50</span>
                            </div>
                          </div>
                          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <button className={`w-full py-2 rounded-lg text-sm ${isDark ? 'bg-blue-600' : 'bg-blue-600'} text-white`}>
                              View Full Dashboard
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-black rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
            
            <TabsContent value="driver" className="mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key="driver"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`shadow-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">Halvi Dash & Driver Program</CardTitle>
                      <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Drive, Deliver & Earn – Flexible hours and competitive pay
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                        <h3 className="font-medium text-lg mb-3">Driver Requirements</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Must be 21 years or older</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Hold a valid driver's license</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Provide proof of insurance and vehicle registration</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Own a smartphone to use the Halvi Driver App</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Pass a background check and driving history review</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                        <h3 className="font-medium text-lg mb-3">How to Become a Halvi Driver</h3>
                        <ol className="space-y-4">
                          <li className="flex">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isDark ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'} flex items-center justify-center font-bold mr-3`}>1</div>
                            <div>
                              <h4 className="font-medium">Apply Online</h4>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Click "Apply as a Driver" and complete the online application form.
                              </p>
                            </div>
                          </li>
                          <li className="flex">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isDark ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'} flex items-center justify-center font-bold mr-3`}>2</div>
                            <div>
                              <h4 className="font-medium">Verification & Approval</h4>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                The Halvi admin team will review applications and perform background checks.
                              </p>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Approved drivers will receive login credentials for the driver dashboard.
                              </p>
                            </div>
                          </li>
                          <li className="flex">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isDark ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'} flex items-center justify-center font-bold mr-3`}>3</div>
                            <div>
                              <h4 className="font-medium">Start Driving</h4>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Once verified, drivers can accept delivery requests and start earning.
                              </p>
                            </div>
                          </li>
                        </ol>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <h3 className="font-medium text-lg mb-3">Earnings & Benefits</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="font-medium">Flexible Hours</span> – Drive whenever you want; no fixed schedule.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="font-medium">Competitive Pay</span> – Earn per delivery with bonuses for high performance.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="font-medium">Instant Payouts</span> – Get paid fast through Halvi's driver system.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleApplyAsDriver} 
                        className="w-full py-6 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                      >
                        <Car className="mr-2 h-5 w-5" />
                        Apply as a Driver
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Driver App Preview */}
                  <div className="mt-12">
                    <h2 className={`text-2xl font-bold text-center mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Halvi Driver App
                    </h2>
                    <div className="relative mx-auto max-w-xl">
                      <div className={`p-3 rounded-xl border-8 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} shadow-2xl mx-auto`} style={{maxWidth: '300px'}}>
                        <div className={`h-16 rounded-t-lg ${isDark ? 'bg-gray-800' : 'bg-green-600'} flex items-center justify-between px-4`}>
                          <div>
                            <div className="text-white font-medium">Halvi Driver</div>
                            <div className="text-white/80 text-xs">Online - Accepting Orders</div>
                          </div>
                          <span className="text-white text-sm">3:45 PM</span>
                        </div>
                        <div className={`rounded-b-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                          <div className={`p-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                            <div>
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Today's Earnings</div>
                              <div className={`text-xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>$87.50</div>
                            </div>
                            <div>
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Deliveries</div>
                              <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>6</div>
                            </div>
                          </div>
                          <div className={`p-3 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
                            <div className={`mr-3 p-2 rounded-full ${isDark ? 'bg-blue-800' : 'bg-blue-100'}`}>
                              <Truck className={`h-6 w-6 ${isDark ? 'text-blue-200' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>New Delivery Request</div>
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>2.3 miles - $8.75</div>
                            </div>
                            <div className="ml-auto flex space-x-2">
                              <button className="p-2 bg-red-500 text-white rounded-full">✕</button>
                              <button className="p-2 bg-green-500 text-white rounded-full">✓</button>
                            </div>
                          </div>
                          <div className="p-3 space-y-3">
                            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              Upcoming Scheduled Deliveries
                            </div>
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              <div className="flex justify-between">
                                <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Treats Bakery</span>
                                <span className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>$10.25</span>
                              </div>
                              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                                5:30 PM - 1.8 miles
                              </div>
                            </div>
                          </div>
                          <div className={`p-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <button className={`w-full py-2 rounded-lg text-sm ${isDark ? 'bg-green-600' : 'bg-green-600'} text-white`}>
                              Go to Navigation
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-black rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-serif font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial) => (
              <Card key={testimonial.id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className={`text-sm italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-serif font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq) => (
              <div 
                key={faq.id} 
                className={`rounded-lg overflow-hidden ${
                  isDark 
                    ? 'bg-gray-700 border border-gray-600' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <button
                  className="w-full text-left p-4 flex justify-between items-center"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  ) : (
                    <ChevronDown className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className={`p-4 pt-0 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl ${
            isDark 
              ? 'bg-gradient-to-r from-blue-900 to-purple-900' 
              : 'bg-gradient-to-r from-blue-600 to-purple-700'
          }`}>
            <div className="p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Earning with Halvi?</h2>
              <p className="text-lg mb-8 opacity-90">
                Join our community today and start earning on your own schedule.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={() => setActiveTab('affiliate')}
                  className="py-6 px-8 text-lg bg-white text-blue-700 hover:bg-gray-100"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Become an Affiliate
                </Button>
                <Button 
                  onClick={() => setActiveTab('driver')}
                  className="py-6 px-8 text-lg bg-white text-purple-700 hover:bg-gray-100"
                >
                  <Car className="mr-2 h-5 w-5" />
                  Apply as a Driver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AffiliateProgram;


import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Badge, 
  Car, 
  CheckCircle, 
  Copy, 
  Flame, 
  MapPin, 
  Smartphone, 
  Star, 
  Store, 
  Truck, 
  Users, 
  Wallet 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/layout/Footer';

const AffiliateProgram = () => {
  const [activeTab, setActiveTab] = useState('affiliate');
  const [referralLink, setReferralLink] = useState('');
  const [referralLinkCopied, setReferralLinkCopied] = useState(false);
  const affiliateSectionRef = useRef<HTMLDivElement>(null);
  const driverSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Generate a random referral link for demo purposes
    const generateReferralLink = () => {
      const randomId = Math.random().toString(36).substring(2, 15);
      setReferralLink(`https://halvi.com/ref/${randomId}`);
    };
    
    generateReferralLink();
  }, []);

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setReferralLinkCopied(true);
    
    toast({
      title: "Referral link copied!",
      description: "Your unique referral link has been copied to clipboard.",
    });
    
    setTimeout(() => {
      setReferralLinkCopied(false);
    }, 3000);
  };

  const handleGenerateReferralLink = () => {
    // Generate a new random referral link
    const randomId = Math.random().toString(36).substring(2, 15);
    setReferralLink(`https://halvi.com/ref/${randomId}`);
    
    toast({
      title: "New referral link generated!",
      description: "Your new unique referral link is ready to share.",
    });
  };

  const handleJoinAffiliate = () => {
    handleGenerateReferralLink();
    
    toast({
      title: "Welcome to Halvi Affiliate Program!",
      description: "Your application has been submitted for review.",
    });
  };

  const handleApplyAsDriver = () => {
    toast({
      title: "Driver application submitted!",
      description: "We'll review your application and get back to you soon.",
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Tabs defaultValue="affiliate" className="w-full max-w-5xl" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-12">
              <TabsTrigger value="affiliate" className="text-lg py-3 data-[state=active]:bg-[#0F1B44] data-[state=active]:text-white relative">
                Affiliate Program
                {activeTab !== 'affiliate' && (
                  <motion.span 
                    className="absolute -top-2 -right-2 bg-red-500 px-1.5 py-0.5 rounded-full text-xs text-white flex items-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Flame className="h-3 w-3 mr-0.5" />
                    Hot
                  </motion.span>
                )}
              </TabsTrigger>
              <TabsTrigger value="driver" className="text-lg py-3 data-[state=active]:bg-[#0F1B44] data-[state=active]:text-white relative">
                Driver Program
                {activeTab !== 'driver' && (
                  <motion.span 
                    className="absolute -top-2 -right-2 bg-red-500 px-1.5 py-0.5 rounded-full text-xs text-white flex items-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Flame className="h-3 w-3 mr-0.5" />
                    Hot
                  </motion.span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="affiliate" ref={affiliateSectionRef}>
              <div className="bg-gradient-to-br from-[#0F1B44] to-[#183080] rounded-xl p-8 mb-12 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-8 md:mb-0 md:mr-8">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                      Earn by Referring Businesses to Halvi!
                    </h1>
                    <p className="text-lg text-white/80 mb-6">
                      Refer Muslim businesses to Halvi and earn up to 50% commission on every order they process through our platform.
                    </p>
                    <Button 
                      onClick={handleJoinAffiliate} 
                      className="bg-white text-[#0F1B44] hover:bg-gray-100 text-lg px-8 py-6"
                      size="lg"
                    >
                      Join as an Affiliate
                    </Button>
                  </div>
                  
                  <div className="w-full md:w-1/3 relative">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-medium">Your Referral Link</h3>
                        <Badge className="bg-green-500 text-white">Active</Badge>
                      </div>
                      
                      <div className="flex mb-6">
                        <input
                          type="text"
                          value={referralLink}
                          readOnly
                          className="flex-grow bg-white/10 border border-white/20 rounded-l-lg px-4 py-3 text-white"
                        />
                        <button
                          onClick={handleCopyReferralLink}
                          className="bg-white text-[#0F1B44] px-4 py-3 rounded-r-lg hover:bg-white/90 transition-colors flex items-center"
                        >
                          {referralLinkCopied ? (
                            <>
                              <CheckCircle className="h-5 w-5 mr-2" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-5 w-5 mr-2" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="text-center text-white/60 text-sm">
                        Share this link with business owners to earn commissions!
                      </div>
                    </div>
                    
                    <motion.div 
                      className="absolute -top-6 -right-6 bg-red-500 rounded-full h-16 w-16 flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 10, 0, -10, 0],
                        scale: [1, 1.05, 1, 1.05, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 5
                      }}
                    >
                      <div className="text-center">
                        <div className="text-xs font-bold">EARN</div>
                        <div className="text-lg font-bold">50%</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <div className="mb-16">
                <h2 className="text-2xl font-serif font-bold mb-8 text-center text-[#0F1B44] dark:text-white">
                  How the Affiliate Program Works
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-[#0F1B44]/10 flex items-center justify-center mb-4 dark:bg-[#0F1B44]/30">
                      <Users className="h-6 w-6 text-[#0F1B44] dark:text-white" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      1. Get Your Referral Link
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Click "Join as an Affiliate" to generate a unique referral link that you can share with business owners.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-[#0F1B44]/10 flex items-center justify-center mb-4 dark:bg-[#0F1B44]/30">
                      <Store className="h-6 w-6 text-[#0F1B44] dark:text-white" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      2. Refer a Business
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      When a business owner signs up using your referral link, you are automatically enrolled in the program.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-[#0F1B44]/10 flex items-center justify-center mb-4 dark:bg-[#0F1B44]/30">
                      <Wallet className="h-6 w-6 text-[#0F1B44] dark:text-white" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      3. Earn Commission
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      You will receive 50% of Halvi's earnings per order from the referred store, continuing until they reach $70,000 in sales.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                <h2 className="text-2xl font-serif font-bold mb-6 text-[#0F1B44] dark:text-white">
                  Lifetime Earnings Formula
                </h2>
                
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Your commission continues until the referred store reaches $70,000 in total sales on Halvi.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      The guaranteed earnings are dynamically calculated using this formula:
                    </p>
                    
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center mb-4">
                      <span className="text-lg font-medium text-[#0F1B44] dark:text-white">
                        G = (R × 1.5) × (M + 0.1)
                      </span>
                    </div>
                    
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• R = Store's monthly revenue</li>
                      <li>• M = Store's profit margin</li>
                      <li>• G = Guaranteed sales target</li>
                    </ul>
                  </div>
                  
                  <div className="md:w-1/2 bg-white dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4 text-[#0F1B44] dark:text-white">
                      Example Calculation
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Store's Monthly Revenue (R)
                        </p>
                        <p className="text-lg font-medium text-[#0F1B44] dark:text-white">
                          $5,000
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Store's Profit Margin (M)
                        </p>
                        <p className="text-lg font-medium text-[#0F1B44] dark:text-white">
                          30% (0.3)
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Calculation
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          G = ($5,000 × 1.5) × (0.3 + 0.1)
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          G = $7,500 × 0.4
                        </p>
                        <p className="text-lg font-medium text-[#0F1B44] dark:text-white">
                          G = $3,000 monthly
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Your Potential Monthly Commission (50%)
                        </p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          $1,500
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-16">
                <h2 className="text-2xl font-serif font-bold mb-8 text-center text-[#0F1B44] dark:text-white">
                  Why Join as an Affiliate?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      Passive Income
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Earn without managing a store yourself. Simply refer businesses and earn from their success.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      Unlimited Referrals
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      There's no cap on the number of businesses you can invite, meaning unlimited earning potential.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      Long-Term Commissions
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Continue earning until your referred store reaches its $70,000 sales threshold.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-16 text-center">
                <div className="bg-[#0F1B44] rounded-xl p-8 text-white">
                  <h2 className="text-2xl font-serif font-bold mb-4">
                    Ready to Start?
                  </h2>
                  <p className="text-lg mb-8 max-w-2xl mx-auto">
                    Become a Halvi Affiliate today and start earning commissions by helping Muslim businesses grow online.
                  </p>
                  <Button 
                    onClick={handleJoinAffiliate} 
                    className="bg-white text-[#0F1B44] hover:bg-gray-100"
                    size="lg"
                  >
                    Join as an Affiliate
                  </Button>
                </div>
              </div>
              
              <div className="mb-16">
                <h2 className="text-2xl font-serif font-bold mb-8 text-center text-[#0F1B44] dark:text-white">
                  Affiliate Program Demo
                </h2>
                
                <div className="flex flex-col md:flex-row items-center justify-center">
                  <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                    <h3 className="text-xl font-medium mb-4 text-[#0F1B44] dark:text-white">
                      Complete Walkthrough
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Our intuitive affiliate dashboard makes it easy to track your earnings, referred businesses, and payment history.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Generate and share your unique referral link</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Track business sign-ups in real-time</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Monitor commission earnings with detailed analytics</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Multiple payout options for easy withdrawals</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="md:w-1/2 flex justify-center">
                    <div className="relative">
                      <div className="w-80 h-[500px] bg-black rounded-[40px] p-4 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-xl"></div>
                        <div className="w-full h-full bg-white rounded-[32px] overflow-hidden">
                          <div className="h-14 bg-[#0F1B44] text-white flex items-center justify-center">
                            <h4 className="font-medium">Halvi Affiliate Dashboard</h4>
                          </div>
                          <div className="p-4">
                            <div className="bg-[#F8F9FA] rounded-lg p-4 mb-4">
                              <div className="text-sm text-gray-500 mb-1">Total Earnings</div>
                              <div className="text-2xl font-bold text-[#0F1B44]">$4,253.86</div>
                              <div className="mt-2 text-xs text-green-600 flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                <span>+18% from last month</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-[#F8F9FA] rounded-lg p-3">
                                <div className="text-xs text-gray-500 mb-1">Referred Shops</div>
                                <div className="text-lg font-bold text-[#0F1B44]">12</div>
                              </div>
                              <div className="bg-[#F8F9FA] rounded-lg p-3">
                                <div className="text-xs text-gray-500 mb-1">Active Shops</div>
                                <div className="text-lg font-bold text-[#0F1B44]">9</div>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-2">Recent Referrals</div>
                              <div className="space-y-3">
                                <div className="bg-[#F8F9FA] rounded-lg p-3 flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#E6F2FF] flex items-center justify-center mr-3">
                                    <Store className="h-4 w-4 text-[#0F1B44]" />
                                  </div>
                                  <div className="flex-grow">
                                    <div className="text-sm font-medium">Halal Fresh Market</div>
                                    <div className="text-xs text-gray-500">Signed up 2 days ago</div>
                                  </div>
                                </div>
                                <div className="bg-[#F8F9FA] rounded-lg p-3 flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#E6F2FF] flex items-center justify-center mr-3">
                                    <Store className="h-4 w-4 text-[#0F1B44]" />
                                  </div>
                                  <div className="flex-grow">
                                    <div className="text-sm font-medium">Baraka Bakery</div>
                                    <div className="text-xs text-gray-500">Signed up 1 week ago</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-2">Commission Breakdown</div>
                              <div className="bg-[#F8F9FA] rounded-lg p-3">
                                <div className="h-32 flex items-end justify-between">
                                  <div className="w-1/6 h-[60%] bg-[#0F1B44] rounded-t-md"></div>
                                  <div className="w-1/6 h-[80%] bg-[#0F1B44] rounded-t-md"></div>
                                  <div className="w-1/6 h-[40%] bg-[#0F1B44] rounded-t-md"></div>
                                  <div className="w-1/6 h-[90%] bg-[#0F1B44] rounded-t-md"></div>
                                  <div className="w-1/6 h-[70%] bg-[#0F1B44] rounded-t-md"></div>
                                  <div className="w-1/6 h-[50%] bg-[#0F1B44] rounded-t-md"></div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                  <span>May</span>
                                  <span>Jun</span>
                                  <span>Jul</span>
                                  <span>Aug</span>
                                  <span>Sep</span>
                                  <span>Oct</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="driver" ref={driverSectionRef}>
              <div className="bg-gradient-to-br from-[#0F1B44] to-[#183080] rounded-xl p-8 mb-12 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-8 md:mb-0 md:mr-8">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                      Halvi Driver Program
                    </h1>
                    <p className="text-lg text-white/80 mb-6">
                      Drive, deliver and earn! Become part of our network delivering quality products to the Muslim community.
                    </p>
                    <Button 
                      onClick={handleApplyAsDriver} 
                      className="bg-white text-[#0F1B44] hover:bg-gray-100 text-lg px-8 py-6"
                      size="lg"
                    >
                      Apply as a Driver
                    </Button>
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative overflow-hidden">
                      <div className="mb-4 flex items-center">
                        <Truck className="h-8 w-8 mr-2" />
                        <h3 className="text-xl font-medium">Halvi Dash</h3>
                      </div>
                      
                      <div className="space-y-3 relative z-10">
                        <div className="bg-white/10 p-3 rounded-lg">
                          <p className="text-sm text-white/70">Average Earnings</p>
                          <p className="text-2xl font-bold">$25-35/hr</p>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="bg-white/10 p-3 rounded-lg flex-1">
                            <p className="text-sm text-white/70">Flexible Hours</p>
                            <p className="text-xl font-medium">24/7</p>
                          </div>
                          <div className="bg-white/10 p-3 rounded-lg flex-1">
                            <p className="text-sm text-white/70">Instant Pay</p>
                            <p className="text-xl font-medium">Daily</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
                      <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-16">
                <h2 className="text-2xl font-serif font-bold mb-8 text-center text-[#0F1B44] dark:text-white">
                  Driver Requirements
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-[#0F1B44]/10 flex items-center justify-center mb-4 dark:bg-[#0F1B44]/30">
                      <User className="h-6 w-6 text-[#0F1B44] dark:text-white" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      Basic Requirements
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Must be 21 years or older</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Hold a valid driver's license</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Pass a background check</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-[#0F1B44]/10 flex items-center justify-center mb-4 dark:bg-[#0F1B44]/30">
                      <Car className="h-6 w-6 text-[#0F1B44] dark:text-white" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      Vehicle Requirements
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Valid vehicle registration</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Proof of insurance</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Vehicle in good condition</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-[#0F1B44]/10 flex items-center justify-center mb-4 dark:bg-[#0F1B44]/30">
                      <Smartphone className="h-6 w-6 text-[#0F1B44] dark:text-white" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      Technical Requirements
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Smartphone with iOS 13+ or Android 8+</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Reliable data connection</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Halvi Driver App (provided after approval)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mb-16">
                <h2 className="text-2xl font-serif font-bold mb-8 text-center text-[#0F1B44] dark:text-white">
                  How to Become a Halvi Driver
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 relative">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#0F1B44] text-white flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white mt-2">
                      Apply Online
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Click "Apply as a Driver" and complete the online application form with your personal and vehicle information.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 relative">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#0F1B44] text-white flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white mt-2">
                      Verification & Approval
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our admin team will review your application, perform background checks, and approve qualified drivers.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 relative">
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#0F1B44] text-white flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white mt-2">
                      Start Driving
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Once verified, download the Halvi Driver app, set your availability, and start accepting delivery requests.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-16">
                <h2 className="text-2xl font-serif font-bold mb-8 text-center text-[#0F1B44] dark:text-white">
                  Earnings & Benefits
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      Flexible Hours
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Drive whenever you want with no fixed schedule. Set your own hours and work as much or as little as you prefer.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      Competitive Pay
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Earn per delivery with bonuses for high performance, busy hours, and peak demand periods.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      Instant Payouts
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get paid fast through Halvi's driver system with options for daily deposits straight to your bank account.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-16 text-center">
                <div className="bg-[#0F1B44] rounded-xl p-8 text-white">
                  <h2 className="text-2xl font-serif font-bold mb-4">
                    Ready to Drive?
                  </h2>
                  <p className="text-lg mb-8 max-w-2xl mx-auto">
                    Join our team of Halvi drivers today and start earning while providing an essential service to the Muslim community.
                  </p>
                  <Button 
                    onClick={handleApplyAsDriver} 
                    className="bg-white text-[#0F1B44] hover:bg-gray-100"
                    size="lg"
                  >
                    Apply as a Driver
                  </Button>
                </div>
              </div>
              
              <div className="mb-16">
                <h2 className="text-2xl font-serif font-bold mb-8 text-center text-[#0F1B44] dark:text-white">
                  Driver App Demo
                </h2>
                
                <div className="flex flex-col md:flex-row items-center justify-center">
                  <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                    <h3 className="text-xl font-medium mb-4 text-[#0F1B44] dark:text-white">
                      Seamless Delivery Experience
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Our driver app provides a smooth, intuitive experience designed to maximize your earnings while delivering quality service.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Real-time order notifications and map navigation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Easy communication with customers</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Track earnings and tips in real-time</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">Instant payout options</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="md:w-1/2 flex justify-center">
                    <div className="relative">
                      <div className="w-80 h-[500px] bg-black rounded-[40px] p-4 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-xl"></div>
                        <div className="w-full h-full bg-white rounded-[32px] overflow-hidden">
                          <div className="h-14 bg-[#0F1B44] text-white flex items-center justify-center">
                            <h4 className="font-medium">Halvi Driver</h4>
                          </div>
                          <div className="relative h-[calc(100%-56px)]">
                            <div className="absolute inset-0 bg-gray-100">
                              <div className="h-full w-full" style={{ backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-73.935242,40.730610,13,0/500x500?access_token=pk.dummy')", backgroundSize: "cover" }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-[#0F1B44] border-4 border-white flex items-center justify-center">
                                    <Truck className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0">
                                  <div className="bg-white rounded-t-2xl p-4">
                                    <div className="flex justify-between items-center mb-4">
                                      <div>
                                        <div className="text-sm font-medium">New Delivery Request</div>
                                        <div className="text-xs text-gray-500">2.3 miles away</div>
                                      </div>
                                      <div className="text-lg font-bold text-[#0F1B44]">$12.50</div>
                                    </div>
                                    
                                    <div className="bg-gray-100 rounded-lg p-3 mb-4">
                                      <div className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-2">
                                          <Store className="h-3 w-3 text-green-600" />
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium">Pickup</div>
                                          <div className="text-xs">Halal Fresh Market - 123 Main St</div>
                                        </div>
                                      </div>
                                      <div className="border-l-2 border-dashed border-gray-300 h-4 ml-3 my-1"></div>
                                      <div className="flex items-start">
                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1 mr-2">
                                          <MapPin className="h-3 w-3 text-red-600" />
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium">Dropoff</div>
                                          <div className="text-xs">456 Pine Avenue, Apt 3B</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                      <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium">
                                        Decline
                                      </button>
                                      <button className="flex-1 bg-[#0F1B44] text-white py-3 rounded-lg font-medium">
                                        Accept
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AffiliateProgram;

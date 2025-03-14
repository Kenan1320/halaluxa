
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Share2, Copy, Check, BadgeCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const AffiliatePage = () => {
  const { toast } = useToast();
  const [emailInput, setEmailInput] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Mock affiliate link
  const affiliateLink = `https://haluna.com/join?ref=${Math.random().toString(36).substring(2, 10)}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setLinkCopied(true);
    
    toast({
      title: "Link copied!",
      description: "Affiliate link copied to clipboard",
    });
    
    setTimeout(() => setLinkCopied(false), 3000);
  };
  
  const handleShareBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailInput.trim()) {
      toast({
        title: "Invitation sent!",
        description: `Your invitation has been sent to ${emailInput}`,
      });
      setEmailInput('');
    }
  };

  const benefits = [
    {
      title: "5% Commission",
      description: "Earn 5% of all sales from businesses you refer to our platform",
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />
    },
    {
      title: "Recurring Revenue",
      description: "Earn commissions on every sale for as long as the business is on our platform",
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />
    },
    {
      title: "Fast Payouts",
      description: "Get paid every month with multiple payout options",
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />
    },
    {
      title: "Community Support",
      description: "Help Muslim businesses grow while earning rewards",
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Hero section */}
        <div className="mb-16 text-center">
          <div className="inline-block p-3 bg-[#0F1B44]/10 rounded-full mb-4">
            <Users className="h-8 w-8 text-[#0F1B44]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#0F1B44] dark:text-white">
            Become a Haluna Affiliate
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Invite Halal businesses to join our platform and earn commissions on every sale they make
          </p>
          
          {/* Affiliate link */}
          <motion.div 
            className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-medium mb-3 text-[#0F1B44] dark:text-white">
              Your Affiliate Link
            </h2>
            <div className="flex">
              <input
                type="text"
                value={affiliateLink}
                readOnly
                className="flex-grow bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-l-lg px-4 py-2 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="bg-[#0F1B44] text-white px-4 py-2 rounded-r-lg hover:bg-[#183080] transition-colors flex items-center"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Benefits section */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-8 text-center text-[#0F1B44] dark:text-white">
            Why Become an Affiliate?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Invite a business section */}
        <div className="bg-gradient-to-r from-[#0F1B44] to-[#183080] rounded-xl p-8 mb-16 text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold mb-4 text-center">
              Invite a Halal Business
            </h2>
            <p className="text-white/80 text-center mb-8">
              Know a Halal business that would benefit from our platform? Invite them now and start earning!
            </p>
            
            <form onSubmit={handleShareBusiness} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter business email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-[#0F1B44] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Send Invitation
                </button>
              </div>
            </form>
            
            <div className="text-center">
              <p className="text-white/80 text-sm">
                Or share your affiliate link via social media, messaging apps, or in person
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ section - simplified */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-8 text-center text-[#0F1B44] dark:text-white">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                How do I earn commissions?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                When a business signs up using your affiliate link and makes sales on our platform, you earn a 5% commission on all their sales.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-2 text-[#0F1B44] dark:text-white">
                When and how do I get paid?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Commissions are paid out monthly via bank transfer, PayPal, or store credit. You need to earn at least $50 to receive a payout.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/affiliate/faq">
              <Button variant="link" className="text-[#0F1B44]">
                View all FAQs <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4 text-[#0F1B44] dark:text-white">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start inviting businesses and earning commissions today
          </p>
          <Button 
            onClick={handleCopyLink}
            size="lg"
            className="bg-[#0F1B44] hover:bg-[#183080]"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Your Affiliate Link
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePage;

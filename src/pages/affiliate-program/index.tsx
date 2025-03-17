
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Truck, CreditCard, User, Users, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

const AffiliateProgram = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  const benefits = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Competitive Commission",
      description: "Earn up to 15% on each sale that comes through your referral link."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Growth Opportunities",
      description: "The more you refer, the higher your earning potential."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Impact",
      description: "Help grow the halal economy while earning income."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Recognition & Rewards",
      description: "Top affiliates receive bonuses and special recognition."
    }
  ];
  
  const driverBenefits = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Flexible Hours",
      description: "Work when it suits you – full-time or part-time options available."
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Competitive Pay",
      description: "Earn competitive rates per delivery plus customer tips."
    },
    {
      icon: <User className="h-6 w-6" />,
      title: "Be Your Own Boss",
      description: "Manage your own schedule and delivery area."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Growth Opportunities",
      description: "Opportunities to advance to team leader and regional manager roles."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-block bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-1 rounded-full text-sm font-medium mb-3"
        >
          Join Our Network
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#2A866A] to-[#183080]">
          Affiliate & Drivers Program
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Earn income by promoting halal businesses or delivering their products to customers
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Affiliate Program Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">Become an Affiliate</h2>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Promote halal businesses and products to your audience and earn commission on every sale made through your referrals.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Benefits</h3>
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 mt-1 text-emerald-500 dark:text-emerald-400">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{benefit.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                  1
                </div>
                <div>
                  <h5 className="font-medium">Apply to become an affiliate</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Complete our simple application form</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                  2
                </div>
                <div>
                  <h5 className="font-medium">Get your unique referral link</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Use this link in your promotions</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                  3
                </div>
                <div>
                  <h5 className="font-medium">Share with your audience</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Promote Halvi and its businesses</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mr-3">
                  4
                </div>
                <div>
                  <h5 className="font-medium">Earn commissions</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get paid for each successful referral</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
              onClick={() => navigate('/affiliate/apply')}
            >
              Apply as an Affiliate <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
        
        {/* Drivers Program Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">Become a Driver</h2>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join our team of delivery drivers and help deliver halal products from local businesses to customers in your area.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Benefits</h3>
            <div className="space-y-4 mb-8">
              {driverBenefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 mt-1 text-orange-500 dark:text-orange-400">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{benefit.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Requirements</h3>
            <div className="space-y-2 mb-8 pl-4">
              <li className="text-gray-600 dark:text-gray-300">Valid driver's license</li>
              <li className="text-gray-600 dark:text-gray-300">Vehicle in good condition</li>
              <li className="text-gray-600 dark:text-gray-300">Smartphone with data plan</li>
              <li className="text-gray-600 dark:text-gray-300">Ability to lift up to 25 pounds</li>
              <li className="text-gray-600 dark:text-gray-300">Pass background check</li>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
              onClick={() => navigate('/drivers/apply')}
            >
              Apply as a Driver <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Our team is ready to help you get started with either program. Contact us for more information or to discuss opportunities.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button 
            variant="outline" 
            className="border-[#2A866A] text-[#2A866A] hover:bg-[#2A866A] hover:text-white"
            onClick={() => navigate('/contact')}
          >
            Contact Us
          </Button>
          <Button 
            variant="outline" 
            className="border-[#183080] text-[#183080] hover:bg-[#183080] hover:text-white"
            onClick={() => navigate('/faq')}
          >
            View FAQ
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AffiliateProgram;

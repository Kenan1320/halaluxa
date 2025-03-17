
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, HelpCircle, Award, Book, Users, HeartHandshake, Zap, ArrowRight, Star, Calendar, Clock, BookOpen, MapPin, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const FeatureCard = ({ icon, title, description, className = "" }) => {
  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md ${className}`}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 text-amber-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

const HelpPage = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const [adminClickCount, setAdminClickCount] = useState(0);
  
  const handleAdminTest = () => {
    navigate('/admin');
  };

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
  
  const sections = [
    {
      id: 'mission',
      title: 'Our Mission',
      icon: <Award className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <motion.div
            className="p-5 md:p-10 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-center shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-block bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-1 rounded-full text-sm font-medium mb-3"
            >
              <Star className="inline-block h-4 w-4 mr-1" /> Key Features
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white"
            >
              Faith-Centered Halal Marketplace
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Halvi blends authentic halal verification with modern marketplace technology, 
              creating a unique platform for the conscious Muslim consumer.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
          >
            <motion.div variants={itemVariants}>
              <FeatureCard 
                icon={<Calendar className="h-10 w-10" />}
                title="Purpose-Driven Shops"
                description="Discover shops that align your worldly purchases with your Islamic values and principles."
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <FeatureCard 
                icon={<Clock className="h-10 w-10" />}
                title="Barakah Business Model"
                description="Support businesses that operate according to Islamic principles of fair trade and ethics."
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <FeatureCard 
                icon={<BookOpen className="h-10 w-10" />}
                title="Verified Halal Products"
                description="Every product on our platform is verified to meet halal standards, giving you peace of mind."
              />
            </motion.div>
          </motion.div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg my-6">
            <h4 className="font-bold mb-2">Our Core Values</h4>
            <ul className="space-y-2 list-disc pl-5">
              <li>Authenticity - Ensuring all businesses meet halal standards</li>
              <li>Community - Building bridges between Muslims worldwide</li>
              <li>Empowerment - Helping Muslim entrepreneurs thrive</li>
              <li>Accessibility - Making halal options easily discoverable</li>
            </ul>
          </div>
          <Button 
            variant="default" 
            className="w-full mt-6 bg-gradient-to-r from-deep-night-blue to-haluna-primary text-white"
            onClick={() => setAdminClickCount(prev => prev + 1)}
          >
            {adminClickCount >= 4 ? (
              <span className="flex items-center" onClick={handleAdminTest}>
                Access Admin Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            ) : (
              "Learn More About Our Mission"
            )}
          </Button>
        </div>
      ),
    },
    {
      id: 'about',
      title: 'About Halvi',
      icon: <Info className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">About Halvi</h3>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h4 className="text-lg font-semibold mb-3">Our Story</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Halvi was founded with the vision of creating a centralized platform where Muslims 
                could easily find and support halal businesses. Our team consists of passionate 
                individuals committed to serving the Muslim community's unique needs.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h4 className="text-lg font-semibold mb-3">Our Difference</h4>
              <p className="text-gray-600 dark:text-gray-300">
                What sets us apart is our dedication to verification and authenticity. We personally 
                review each business to ensure they meet halal standards before they appear on our platform.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-xl mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h4 className="text-lg font-semibold mb-3">Our Impact</h4>
            <p className="text-gray-700 dark:text-gray-300">
              Since our launch, we've connected thousands of Muslim consumers with hundreds of verified halal businesses, 
              creating a thriving ecosystem that benefits the entire ummah.
            </p>
          </motion.div>
        </div>
      ),
    },
    {
      id: 'faqs',
      title: 'FAQs',
      icon: <HelpCircle className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              <motion.div 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="font-medium">How does Halvi verify businesses?</h4>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  Our team reviews each business application, checking for halal certifications and practices. 
                  We also conduct interviews when necessary to ensure compliance with Islamic principles.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="font-medium">Can I sell non-food products on Halvi?</h4>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  Yes! Halvi welcomes all types of halal products and services, from fashion and beauty to 
                  books and home goods. The key requirement is that all products comply with Islamic principles.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="font-medium">How do I get my business featured on Halvi?</h4>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  After being approved as a seller, you can apply for featured placement through your dashboard. 
                  Featured businesses typically have excellent reviews and consistent sales performance.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="font-medium">Is there a fee to join as a business?</h4>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  Basic business listings are free. Premium features and promoted listings have associated fees.
                  We believe in providing value first and charging only for enhanced services.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="font-medium">How do refunds work on Halvi?</h4>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  Each business sets their own refund policy, which is displayed on their shop page.
                  However, Halvi does offer buyer protection for cases where products significantly 
                  differ from their description.
                </p>
              </motion.div>
              
              <motion.div 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="font-medium">What happens if I have a dispute with a seller?</h4>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                  We encourage direct communication first. If that doesn't resolve the issue,
                  our customer support team can mediate and help reach a fair resolution.
                </p>
              </motion.div>
            </div>
          </ScrollArea>
        </div>
      ),
    },
    {
      id: 'community',
      title: 'Community',
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Our Community</h3>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h4 className="font-bold mb-2">10,000+</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h4 className="font-bold mb-2">500+</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Verified Businesses</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h4 className="font-bold mb-2">50+</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cities Covered</p>
            </motion.div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg"
          >
            Halvi is more than just a marketplace—it's a community of Muslims supporting each other. 
            We believe in the power of community to strengthen the ummah and create economic 
            opportunities for all.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Join our growing community of shoppers and business owners who are passionate about 
            supporting halal businesses and products.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl mt-8"
          >
            <h4 className="font-semibold mb-3">Community Events</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We regularly host online and in-person events to bring our community together, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Business networking sessions</li>
              <li>Consumer education workshops</li>
              <li>Islamic finance seminars</li>
              <li>Halal industry conferences</li>
            </ul>
          </motion.div>
        </div>
      ),
    },
    {
      id: 'for-business',
      title: 'For Businesses',
      icon: <HeartHandshake className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold mb-6"
          >
            For Business Owners
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg mb-8"
          >
            Joining Halvi as a business owner gives you access to a targeted audience of Muslims 
            looking specifically for halal products and services. Our platform provides you with 
            all the tools you need to succeed online.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h4 className="font-medium text-lg mb-4">Benefits</h4>
              <ul className="space-y-3 list-disc pl-5">
                <li>Access to Muslim shoppers specifically seeking halal products</li>
                <li>Easy-to-use dashboard to manage your products</li>
                <li>Verified badge to build customer trust</li>
                <li>Built-in marketing tools to grow your business</li>
                <li>Analytics to track your performance</li>
                <li>Mobile-friendly shop interface</li>
              </ul>
            </div>
            
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h4 className="font-medium text-lg mb-4">How to Join</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                    1
                  </div>
                  <div>
                    <h5 className="font-medium">Create a business account</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sign up with your business email and basic information</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                    2
                  </div>
                  <div>
                    <h5 className="font-medium">Complete your shop profile</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add your logo, banner, description and business details</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                    3
                  </div>
                  <div>
                    <h5 className="font-medium">Submit verification documents</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Provide halal certifications or other relevant documentation</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                    4
                  </div>
                  <div>
                    <h5 className="font-medium">Wait for approval</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Our team reviews applications within 48 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                    5
                  </div>
                  <div>
                    <h5 className="font-medium">Start selling!</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add products and begin reaching Muslim customers</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8"
          >
            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-[#2A866A] to-[#183080] text-white"
              onClick={() => navigate('/sellers')}
            >
              Become a Seller Today <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      ),
    },
    {
      id: 'future',
      title: 'Future Vision',
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold mb-6"
          >
            Our Vision for the Future
          </motion.h3>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
          >
            <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 p-6 rounded-xl">
              <h4 className="font-semibold mb-3">Short-Term Goals</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Expand to 20+ major cities across the US</li>
                <li>Launch mobile apps for iOS and Android</li>
                <li>Implement enhanced verification systems</li>
                <li>Develop a loyalty program for frequent shoppers</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-xl">
              <h4 className="font-semibold mb-3">Long-Term Vision</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Global expansion to Muslim-majority countries</li>
                <li>Integration of Islamic fintech solutions</li>
                <li>Advanced AI for halal product recommendations</li>
                <li>Blockchain-based halal verification system</li>
              </ul>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg"
          >
            At Halvi, we envision a future where finding and supporting halal businesses is 
            seamless. We're continuously working to expand our platform with new features
            and services that benefit both consumers and business owners.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Our roadmap includes expanding to more regions, introducing in-app halal verification
            tools, and building stronger communities around shared values and interests.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center mt-8"
          >
            <Button 
              variant="outline" 
              className="text-[#2A866A] border-[#2A866A] hover:bg-[#2A866A] hover:text-white transition-all duration-300"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Join Our Journey
            </Button>
          </motion.div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Help & Information</h1>
        <p className={`text-lg ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Learn more about Halvi and how we're supporting the Muslim community
        </p>
      </motion.div>

      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${
        mode === 'dark' ? 'border border-gray-700' : ''
      }`}>
        <Tabs defaultValue="mission" className="w-full">
          <TabsList 
            className={`grid grid-cols-3 md:grid-cols-6 w-full rounded-none border-b ${
              mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="flex flex-col py-4 gap-1 text-xs sm:text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 dark:data-[state=active]:border-blue-400"
              >
                {section.icon}
                <span className="hidden sm:block">{section.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {sections.map((section) => (
            <TabsContent 
              key={section.id} 
              value={section.id}
              className="p-6"
            >
              {section.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default HelpPage;

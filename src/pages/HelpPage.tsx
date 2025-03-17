
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, HelpCircle, Award, Book, Users, HeartHandshake, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const HelpPage = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const [adminClickCount, setAdminClickCount] = useState(0);
  
  const handleAdminTest = () => {
    navigate('/admin');
  };
  
  const sections = [
    {
      id: 'mission',
      title: 'Our Mission',
      icon: <Award className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Halvi's Mission & Objective</h3>
          <p>
            Halvi is dedicated to creating a comprehensive marketplace where Muslims can discover, 
            connect with, and support halal businesses both locally and online. Our platform bridges 
            the gap between Muslim consumers and authentic halal products and services.
          </p>
          <p>
            We aim to empower Muslim-owned businesses by providing them with digital tools to reach 
            a wider audience while helping community members easily find verified halal options for 
            their daily needs.
          </p>
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
          <h3 className="text-xl font-bold">About Halvi</h3>
          <p>
            Halvi was founded with the vision of creating a centralized platform where Muslims 
            could easily find and support halal businesses. Our team consists of passionate 
            individuals committed to serving the Muslim community's unique needs.
          </p>
          <p>
            What sets us apart is our dedication to verification and authenticity. We personally 
            review each business to ensure they meet halal standards before they appear on our platform.
          </p>
        </div>
      ),
    },
    {
      id: 'faqs',
      title: 'FAQs',
      icon: <HelpCircle className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium">How does Halvi verify businesses?</h4>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                Our team reviews each business application, checking for halal certifications and practices. 
                We also conduct interviews when necessary to ensure compliance with Islamic principles.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium">Can I sell non-food products on Halvi?</h4>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                Yes! Halvi welcomes all types of halal products and services, from fashion and beauty to 
                books and home goods. The key requirement is that all products comply with Islamic principles.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium">How do I get my business featured on Halvi?</h4>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                After being approved as a seller, you can apply for featured placement through your dashboard. 
                Featured businesses typically have excellent reviews and consistent sales performance.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'community',
      title: 'Community',
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Our Community</h3>
          <p>
            Halvi is more than just a marketplace—it's a community of Muslims supporting each other. 
            We believe in the power of community to strengthen the ummah and create economic 
            opportunities for all.
          </p>
          <p>
            Join our growing community of shoppers and business owners who are passionate about 
            supporting halal businesses and products.
          </p>
        </div>
      ),
    },
    {
      id: 'for-business',
      title: 'For Businesses',
      icon: <HeartHandshake className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">For Business Owners</h3>
          <p>
            Joining Halvi as a business owner gives you access to a targeted audience of Muslims 
            looking specifically for halal products and services. Our platform provides you with 
            all the tools you need to succeed online.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium mb-2">Benefits</h4>
              <ul className="space-y-1 list-disc pl-5 text-sm">
                <li>Access to Muslim shoppers specifically seeking halal products</li>
                <li>Easy-to-use dashboard to manage your products</li>
                <li>Verified badge to build customer trust</li>
                <li>Built-in marketing tools to grow your business</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium mb-2">How to Join</h4>
              <ul className="space-y-1 list-disc pl-5 text-sm">
                <li>Create a business account</li>
                <li>Complete your shop profile</li>
                <li>Submit required verification documents</li>
                <li>Wait for approval (usually within 48 hours)</li>
                <li>Start selling!</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'future',
      title: 'Future Vision',
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Our Vision for the Future</h3>
          <p>
            At Halvi, we envision a future where finding and supporting halal businesses is 
            seamless. We're continuously working to expand our platform with new features
            and services that benefit both consumers and business owners.
          </p>
          <p>
            Our roadmap includes expanding to more regions, introducing in-app halal verification
            tools, and building stronger communities around shared values and interests.
          </p>
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
        className="mb-6 text-center"
      >
        <h1 className="text-3xl font-serif font-bold mb-2">Help & Information</h1>
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

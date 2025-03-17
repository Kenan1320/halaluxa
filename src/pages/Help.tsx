
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Help = () => {
  const { mode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">About Halvi</h1>
        
        <div className="max-w-4xl mx-auto space-y-8 mb-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-lg">
              Halvi is dedicated to connecting Muslim consumers with authentic halal businesses, 
              products, and services. We aim to be the most trusted and comprehensive platform for the 
              Muslim community to discover, shop, and support halal-certified businesses.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Our Vision</h2>
            <p className="text-lg">
              We envision a world where Muslim consumers can easily find and support ethical, 
              halal-certified businesses with complete confidence and peace of mind. Halvi strives to 
              empower both consumers and business owners within the halal economy.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Our Core Values</h2>
            <ul className="list-disc pl-6 text-lg space-y-2">
              <li><strong>Authenticity:</strong> We verify all businesses to ensure they meet halal standards.</li>
              <li><strong>Transparency:</strong> We provide clear information about products, services, and practices.</li>
              <li><strong>Community:</strong> We support and strengthen the Muslim community by facilitating ethical commerce.</li>
              <li><strong>Innovation:</strong> We leverage technology to make halal shopping easier and more accessible.</li>
              <li><strong>Excellence:</strong> We strive for the highest quality in all aspects of our platform.</li>
            </ul>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">How Halvi Works</h2>
            <p className="text-lg">
              Halvi connects Muslim consumers with local and online halal businesses through our 
              curated marketplace. We verify businesses for halal compliance, facilitate secure 
              transactions, and help the Muslim community discover new products and services.
            </p>
            <p className="text-lg">
              For business owners, Halvi offers a platform to reach a targeted audience of Muslim 
              consumers actively seeking halal products and services.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Join Our Community</h2>
            <p className="text-lg">
              Whether you're a consumer looking for authentic halal products or a business owner wanting 
              to reach more customers, Halvi welcomes you to join our growing community.
            </p>
          </section>
          
          <div className="pt-8 flex justify-center">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-haluna-primary hover:bg-haluna-primary-dark"
              onClick={() => navigate('/admin')}
            >
              Admin Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;

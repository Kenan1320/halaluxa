
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Package, Phone, CircleDollarSign, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategoryIcon } from '@/components/icons/CategoryIcons';

const ServicesPage = () => {
  return (
    <Container className="py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Our Services</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover how Halvi can help connect you with the best halal products and services in your area.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="rounded-lg border bg-card shadow-sm p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Local Discovery</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
            Find halal shops, restaurants, and services near you. Support local businesses with confidence.
          </p>
          <Link to="/nearby">
            <Button className="w-full mt-auto">
              Explore Nearby Shops <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-card shadow-sm p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Halvi Mall</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
            Shop online from verified halal stores. Discover unique products from around the world.
          </p>
          <Link to="/shops?type=online">
            <Button className="w-full mt-auto">
              Shop Online <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-16">
        {[
          { name: 'Restaurants', icon: 'Restaurants' },
          { name: 'Groceries', icon: 'Groceries' },
          { name: 'Halal Meat', icon: 'Halal Meat' },
          { name: 'Modest Wear', icon: 'Modest Wear' },
          { name: 'Home', icon: 'Home' },
          { name: 'Beauty', icon: 'Beauty' },
        ].map((category) => (
          <Link 
            key={category.name} 
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors"
          >
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-2">
              {getCategoryIcon(category.icon, "w-6 h-6")}
            </div>
            <span className="text-sm font-medium text-center">{category.name}</span>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="bg-primary/10 p-4 rounded-full inline-flex justify-center mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Discover</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Find halal shops and products near you or browse online options
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary/10 p-4 rounded-full inline-flex justify-center mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Follow your favorite shops and get notifications about new products
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary/10 p-4 rounded-full inline-flex justify-center mb-4">
            <CircleDollarSign className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Support</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Buy with confidence and support halal businesses in your community
          </p>
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Delivery', icon: 'Delivery', description: 'Get halal food delivered directly to your door' },
            { name: 'Shop Tours', icon: 'Shop', description: 'Virtual tours of halal shops and businesses' },
            { name: 'Halal Verification', icon: 'CheckCircle', description: 'Verified halal certification information' },
          ].map((service) => (
            <div key={service.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  {getCategoryIcon(service.icon, "w-5 h-5")}
                </div>
                <h3 className="font-medium">{service.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Our customer support team is available to assist you with any questions or issues you might have.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="flex items-center justify-center">
            <Phone className="mr-2 h-4 w-4" /> Contact Support
          </Button>
          <Button variant="outline" className="flex items-center justify-center">
            <Clock className="mr-2 h-4 w-4" /> View FAQ
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ServicesPage;

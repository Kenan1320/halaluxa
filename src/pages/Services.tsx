
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Map, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryIcon } from '@/components/icons/CategoryIcons';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '@/services/categoryService';

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      const allCategories = await getAllCategories();
      setCategories(allCategories.slice(0, 8)); // Top 8 categories
      
      // For demo purposes, create featured services
      setFeaturedServices([
        {
          id: 'grocery-delivery',
          title: 'Grocery Delivery',
          description: 'Fresh groceries delivered to your doorstep',
          icon: 'Grocery',
          color: 'bg-green-500'
        },
        {
          id: 'food-delivery',
          title: 'Food Delivery',
          description: 'Your favorite restaurants at your fingertips',
          icon: 'Restaurant',
          color: 'bg-orange-500'
        },
        {
          id: 'pharmacy',
          title: 'Pharmacy',
          description: 'Order medicine and healthcare products',
          icon: 'Pharmacy',
          color: 'bg-blue-500'
        },
        {
          id: 'ride-sharing',
          title: 'Ride Sharing',
          description: 'Book a ride to your destination',
          icon: 'Transportation',
          color: 'bg-purple-500'
        }
      ]);
    };
    
    loadCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 pt-6 pb-24">
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-gray-500 mt-1">Discover and explore available services</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSearch}
          className="relative"
          variants={item}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for services..."
            className="pl-10 pr-16 py-6 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            Search
          </Button>
        </motion.form>

        <motion.div variants={item}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Featured Services</h2>
            <Button variant="ghost" size="sm" className="text-haluna-primary">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {featuredServices.map((service) => (
              <motion.div 
                key={service.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className={`${service.color} h-24 flex items-center justify-center`}>
                      <CategoryIcon name={service.icon} className="text-white h-12 w-12" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{service.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button variant="ghost" size="sm" className="text-haluna-primary" onClick={() => navigate('/shops')}>
              All Shops
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category) => (
              <motion.div 
                key={category.id}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/browse?category=${category.name}`)}
              >
                <div className="bg-haluna-primary/10 dark:bg-haluna-primary/20 rounded-full p-3">
                  <CategoryIcon name={category.icon} className="text-haluna-primary h-6 w-6" />
                </div>
                <span className="text-xs mt-2 text-center">{category.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Explore Nearby</h2>
            <Button variant="ghost" size="sm" className="text-haluna-primary" onClick={() => navigate('/nearby')}>
              See Map
              <Map className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Map view of nearby services</p>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                <Button size="sm" variant="outline" className="whitespace-nowrap">
                  <Filter className="mr-1 h-4 w-4" />
                  All
                </Button>
                <Button size="sm" variant="outline" className="whitespace-nowrap">Restaurants</Button>
                <Button size="sm" variant="outline" className="whitespace-nowrap">Grocery</Button>
                <Button size="sm" variant="outline" className="whitespace-nowrap">Pharmacy</Button>
                <Button size="sm" variant="outline" className="whitespace-nowrap">More</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Services;

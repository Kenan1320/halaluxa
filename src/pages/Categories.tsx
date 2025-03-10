
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ShoppingBag, Home, BookOpen, Utensils, HeartPulse, Gift, Shirt, Laptop, Baby, Drumstick, Palette, Camera, Briefcase, Car, Coffee, Cog, Dumbbell, Gamepad, Plant, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categoriesData = [
  { id: 1, name: 'Groceries', icon: ShoppingCart, description: 'Halal-verified groceries and everyday essentials' },
  { id: 2, name: 'Food', icon: Utensils, description: 'Ready-to-eat meals and specialty food items' },
  { id: 3, name: 'Modest Clothing', icon: Shirt, description: 'Modest fashion for men, women, and children' },
  { id: 4, name: 'Home', icon: Home, description: 'Home goods, decor, and furnishings' },
  { id: 5, name: 'Electronics', icon: Laptop, description: 'Consumer electronics and gadgets' },
  { id: 6, name: 'Books', icon: BookOpen, description: 'Islamic literature, educational books, and more' },
  { id: 7, name: 'Health', icon: HeartPulse, description: 'Health supplements and wellness products' },
  { id: 8, name: 'Baby', icon: Baby, description: 'Baby care products and children\'s items' },
  { id: 9, name: 'Gifts', icon: Gift, description: 'Unique gift ideas for all occasions' },
  { id: 10, name: 'Art', icon: Palette, description: 'Islamic art, calligraphy, and crafts' },
  { id: 11, name: 'Halal Meat', icon: Drumstick, description: 'Certified halal meat and poultry' },
  { id: 12, name: 'Photography', icon: Camera, description: 'Cameras, equipment, and photography services' },
  { id: 13, name: 'Business', icon: Briefcase, description: 'Business supplies and services' },
  { id: 14, name: 'Automotive', icon: Car, description: 'Auto parts, accessories, and services' },
  { id: 15, name: 'Cafe', icon: Coffee, description: 'Coffee shops and halal cafes' },
  { id: 16, name: 'Technology', icon: Cog, description: 'Tech gadgets and software solutions' },
  { id: 17, name: 'Fitness', icon: Dumbbell, description: 'Fitness equipment and sportswear' },
  { id: 18, name: 'Gaming', icon: Gamepad, description: 'Video games and gaming accessories' },
  { id: 19, name: 'Garden', icon: Plant, description: 'Plants, gardening tools, and outdoor products' },
  { id: 20, name: 'Pick Up Halal Food Nearby', icon: MapPin, description: 'Locate halal food options in your vicinity' }
];

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = categoriesData.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen pt-20 pb-10 bg-background dark:bg-[#0d1b2a]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-giaza font-bold mb-3 text-center">
            Browse by Category
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Explore our curated collection of halal products and services arranged by category
          </p>
          
          {/* Search box */}
          <div className="mb-10">
            <div className="relative w-full max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full pl-4 pr-10 py-3 rounded-full border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none bg-background dark:bg-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {/* Categories grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => {
              const Icon = category.icon;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link 
                    to={`/browse?category=${encodeURIComponent(category.name)}`}
                    className="block bg-card dark:bg-dark-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full border border-border dark:border-primary/10"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-medium">{category.name}</h3>
                      </div>
                      
                      <p className="text-muted-foreground text-sm flex-grow mb-4">
                        {category.description}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-between group"
                      >
                        Browse Products
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;

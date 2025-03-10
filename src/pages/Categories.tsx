
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ShoppingBag, Home, BookOpen, Utensils, HeartPulse, Gift, Shirt, Laptop, Baby, Drumstick, Palette, Camera, Briefcase, Car, Coffee, Cog, Dumbbell, Plane, MapPin } from 'lucide-react';

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
  { id: 18, name: 'Travel', icon: Plane, description: 'Travel services and accessories' },
  { id: 19, name: 'Pick Up Halal Food Nearby', icon: MapPin, description: 'Locate halal food options in your vicinity' }
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
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-giaza font-bold mb-3 text-center">
            Categories
          </h1>
          
          {/* Search box */}
          <div className="mb-10">
            <div className="relative w-full max-w-md mx-auto">
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
          
          {/* Categories in circular layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredCategories.map((category, index) => {
              const Icon = category.icon;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex justify-center"
                >
                  <Link 
                    to={`/browse?category=${encodeURIComponent(category.name)}`}
                    className="flex flex-col items-center"
                  >
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-card dark:bg-dark-card flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 border border-border dark:border-primary/10 mb-2"
                      whileHover={{ 
                        scale: 1.1, 
                        boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--primary)/0.2))'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    
                    <span className="text-sm text-center font-medium">
                      {category.name}
                    </span>
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

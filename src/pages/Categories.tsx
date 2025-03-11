
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Search } from 'lucide-react';
import { categories } from '@/constants/categories';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryType, setCategoryType] = useState<'all' | 'local' | 'transitioning' | 'online'>('all');
  
  const filteredCategories = categories.filter(category => 
    (category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    category.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryType === 'all' || category.type === categoryType)
  );
  
  return (
    <div className="min-h-screen pt-20 pb-10 bg-background dark:bg-[#0d1b2a] black:bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-giaza font-bold mb-3 text-center">
            Categories
          </h1>
          
          {/* Search & Filter */}
          <div className="mb-8">
            <div className="relative w-full max-w-md mx-auto mb-6">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full pl-4 pr-10 py-3 rounded-full border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none bg-background dark:bg-secondary black:bg-muted"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            
            {/* Category type filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => setCategoryType('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${categoryType === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary/60 text-foreground hover:bg-secondary'}`}
              >
                All Categories
              </button>
              <button
                onClick={() => setCategoryType('local')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${categoryType === 'local' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary/60 text-foreground hover:bg-secondary'}`}
              >
                Local
              </button>
              <button
                onClick={() => setCategoryType('transitioning')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${categoryType === 'transitioning' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary/60 text-foreground hover:bg-secondary'}`}
              >
                In-Store & Online
              </button>
              <button
                onClick={() => setCategoryType('online')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${categoryType === 'online' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary/60 text-foreground hover:bg-secondary'}`}
              >
                Online
              </button>
            </div>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredCategories.map((category, index) => (
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
                    className="w-24 h-24 rounded-full bg-card dark:bg-dark-card black:bg-black/50 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 border border-border dark:border-primary/10 black:border-primary/10 mb-3"
                    whileHover={{ 
                      scale: 1.1, 
                      boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                      background: 'linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--primary)/0.2))'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={category.iconSrc} 
                      alt={category.name}
                      className="h-12 w-12 object-contain" 
                    />
                  </motion.div>
                  
                  <span className="text-sm text-center font-medium line-clamp-2 max-w-32">
                    {category.displayName}
                  </span>
                  
                  <span className="text-xs text-muted-foreground mt-1 text-center line-clamp-2 max-w-32">
                    {category.description}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* No results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground opacity-30" />
              <h3 className="mt-4 text-lg font-medium">No categories found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filters
              </p>
              <button 
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryType('all');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;


import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getShops } from '@/services/shopService';
import { Link, useSearchParams } from 'react-router-dom';
import { Store, Star, MapPin, Search, ArrowUpDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { categories } from '@/constants/categories';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    searchParams.get('category') || null
  );
  const [sortOption, setSortOption] = React.useState<'rating' | 'newest' | 'name'>('rating');
  
  React.useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);
  
  const { data: shops, isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: () => getShops()
  });
  
  // Filter shops based on search term and category
  const filteredShops = React.useMemo(() => {
    if (!shops) return [];
    
    return shops.filter(shop => {
      const matchesSearch = searchTerm === '' || 
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = selectedCategory === null || shop.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [shops, searchTerm, selectedCategory]);
  
  // Sort shops based on selected option
  const sortedShops = React.useMemo(() => {
    if (!filteredShops) return [];
    
    return [...filteredShops].sort((a, b) => {
      if (sortOption === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortOption === 'newest') {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [filteredShops, sortOption]);
  
  // Animation variants for the shop cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const handleCategoryChange = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    
    // Update URL search params
    if (categoryName) {
      searchParams.set('category', categoryName);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  // Group categories by type
  const localCategories = categories.filter(cat => cat.type === 'local');
  const transitioningCategories = categories.filter(cat => cat.type === 'transitioning');
  const onlineCategories = categories.filter(cat => cat.type === 'online');

  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#2A866A] dark:text-[#4ECBA5] black:text-primary mb-2">Browse Shops</h1>
        <p className="text-gray-600 dark:text-gray-400 black:text-gray-300">Discover local shops and their products</p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search shops by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 black:bg-gray-900"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">All Categories</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge 
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer hover:bg-[#2A866A] hover:text-white dark:hover:bg-[#4ECBA5] black:hover:bg-primary"
              onClick={() => handleCategoryChange(null)}
            >
              All
            </Badge>
          </div>
          
          <h3 className="text-sm font-medium mb-2">Local</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {localCategories.map(category => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className="cursor-pointer hover:bg-[#2A866A] hover:text-white dark:hover:bg-[#4ECBA5] black:hover:bg-primary"
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.displayName}
              </Badge>
            ))}
          </div>
          
          <h3 className="text-sm font-medium mb-2">In-Store & Online</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {transitioningCategories.map(category => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className="cursor-pointer hover:bg-[#2A866A] hover:text-white dark:hover:bg-[#4ECBA5] black:hover:bg-primary"
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.displayName}
              </Badge>
            ))}
          </div>
          
          <h3 className="text-sm font-medium mb-2">Online</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {onlineCategories.map(category => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className="cursor-pointer hover:bg-[#2A866A] hover:text-white dark:hover:bg-[#4ECBA5] black:hover:bg-primary"
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.displayName}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 black:text-gray-400">
            {sortedShops.length} shop{sortedShops.length !== 1 ? 's' : ''} found
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setSortOption(sortOption === 'rating' ? 'name' : 'rating')}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort: {sortOption === 'rating' ? 'Top Rated' : sortOption === 'newest' ? 'Newest' : 'Name'}</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Shop Listings */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedShops.length > 0 ? (
            sortedShops.map(shop => (
              <motion.div key={shop.id} variants={itemVariants}>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800 black:bg-gray-900">
                    {shop.cover_image ? (
                      <img 
                        src={shop.cover_image} 
                        alt={shop.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-primary/10">
                        <Store className="h-12 w-12 text-[#2A866A] dark:text-[#4ECBA5] black:text-primary" />
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3">
                      {shop.category && (
                        <Badge variant="secondary" className="bg-white/90 dark:bg-black/50 black:bg-black/70 text-gray-800 dark:text-gray-200 black:text-gray-200">
                          {
                            categories.find(cat => cat.name === shop.category)?.displayName || 
                            shop.category
                          }
                        </Badge>
                      )}
                    </div>
                    
                    {shop.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-[#FF7A45] hover:bg-[#FF7A45]">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-primary/20 flex items-center justify-center">
                        {shop.logo_url ? (
                          <img src={shop.logo_url} alt={shop.name} className="h-full w-full object-cover" />
                        ) : (
                          <Store className="h-5 w-5 text-[#2A866A] dark:text-[#4ECBA5] black:text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{shop.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 black:text-gray-400">
                          {shop.rating ? (
                            <div className="flex items-center text-amber-500 mr-2">
                              <Star className="h-4 w-4 fill-current mr-1" />
                              <span>{shop.rating.toFixed(1)}</span>
                              {shop.review_count && (
                                <span className="text-gray-400 dark:text-gray-500 black:text-gray-500 ml-1">({shop.review_count})</span>
                              )}
                            </div>
                          ) : (
                            <span className="mr-2">No ratings</span>
                          )}
                          
                          {shop.product_count && (
                            <span>· {shop.product_count} products</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 black:text-gray-400 line-clamp-2 mb-3">
                      {shop.description || "No description available"}
                    </p>
                    
                    {shop.location && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 black:text-gray-400 mb-2">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{shop.location}</span>
                      </div>
                    )}
                    
                    {shop.created_at && (
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 black:text-gray-400">
                        <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span>Joined {new Date(shop.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">
                      <Link to={`/shop/${shop.id}`}>
                        Visit Shop
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-[#E4F5F0] dark:bg-[#2A866A]/20 black:bg-primary/10 p-10 rounded-xl max-w-md mx-auto">
                <Search className="h-12 w-12 text-[#2A866A] dark:text-[#4ECBA5] black:text-primary mx-auto mb-4" />
                <h2 className="text-xl font-medium mb-2">No shops found</h2>
                <p className="text-gray-600 dark:text-gray-400 black:text-gray-400 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <Button onClick={() => {
                  setSearchTerm('');
                  handleCategoryChange(null);
                }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Browse;

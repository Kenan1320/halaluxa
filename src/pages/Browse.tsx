
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
import { getAllShops } from '@/services/shopService';
import { ProductCard } from '@/components/cards/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, SearchX, SlidersHorizontal, ChevronDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product, productCategories } from '@/models/product';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '@/components/icons/CategoryIcons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [shopFilters, setShopFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  // Fetch products and shops using react-query
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 60000, // 60 seconds
  });
  
  const { data: shopsData, isLoading: isLoadingShops } = useQuery({
    queryKey: ['shops'],
    queryFn: getAllShops,
    staleTime: 60000, // 60 seconds
  });
  
  useEffect(() => {
    if (productsData) {
      setProducts(productsData as Product[]);
    }
    if (shopsData) {
      setShops(shopsData as any[]);
    }
    setIsLoading(isLoadingProducts || isLoadingShops);
  }, [productsData, shopsData, isLoadingProducts, isLoadingShops]);
  
  useEffect(() => {
    // Check if a category was passed in URL
    const category = searchParams.get('category');
    if (category) {
      setCategoryFilters(category ? [category] : []);
    }
  }, [searchParams]);
  
  // Filter products based on search term, price range, categories, and shops
  const filteredProducts = products.filter((product) => {
    const searchTermMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const priceRangeMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const categoryMatch = categoryFilters.length === 0 || categoryFilters.includes(product.category);
    const shopMatch = shopFilters.length === 0 || shopFilters.includes(product.sellerId);
    
    return searchTermMatch && priceRangeMatch && categoryMatch && shopMatch;
  });
  
  // Sort products based on selected option
  const sortedProducts = useCallback(() => {
    switch (sortOption) {
      case 'price-asc':
        return [...filteredProducts].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filteredProducts].sort((a, b) => b.price - a.price);
      case 'date':
        return [...filteredProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return filteredProducts;
    }
  }, [filteredProducts, sortOption]);
  
  // Paginate products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts().slice(indexOfFirstProduct, indexOfLastProduct);
  
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchParams(term ? { q: term } : {});
    setCurrentPage(1);
  };
  
  const toggleCategoryFilter = (category: string) => {
    if (categoryFilters.includes(category)) {
      setCategoryFilters(categoryFilters.filter((c) => c !== category));
    } else {
      setCategoryFilters([...categoryFilters, category]);
    }
    setCurrentPage(1);
  };
  
  const toggleShopFilter = (shopId: string) => {
    if (shopFilters.includes(shopId)) {
      setShopFilters(shopFilters.filter((s) => s !== shopId));
    } else {
      setShopFilters([...shopFilters, shopId]);
    }
    setCurrentPage(1);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 1000]);
    setCategoryFilters([]);
    setShopFilters([]);
    setSortOption('relevance');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-black dark:text-white">Browse Products</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Explore our wide range of products from trusted Muslim businesses.
            </p>
          </div>
          
          {/* Search Bar and Sort/Filter UI - Uber-like */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="relative w-full md:flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <SearchX className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 py-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              {/* Sort Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1 md:flex-none flex items-center justify-between gap-2 py-6 px-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <span className="text-black dark:text-white">
                      {sortOption === 'relevance' && 'Relevance'}
                      {sortOption === 'price-asc' && 'Price: Low to High'}
                      {sortOption === 'price-desc' && 'Price: High to Low'}
                      {sortOption === 'date' && 'Newest'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                  <div className="py-2">
                    <button 
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white ${sortOption === 'relevance' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                      onClick={() => setSortOption('relevance')}
                    >
                      Relevance
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white ${sortOption === 'price-asc' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                      onClick={() => setSortOption('price-asc')}
                    >
                      Price: Low to High
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white ${sortOption === 'price-desc' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                      onClick={() => setSortOption('price-desc')}
                    >
                      Price: High to Low
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white ${sortOption === 'date' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                      onClick={() => setSortOption('date')}
                    >
                      Newest
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Filter Button - Mobile trigger */}
              <Button 
                variant="outline" 
                onClick={() => setShowMobileFilter(true)}
                className="py-6 px-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4 text-black dark:text-white" />
                <span className="text-black dark:text-white">Filters</span>
              </Button>
            </div>
          </div>
          
          {/* Selected Category Pills */}
          {categoryFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categoryFilters.map((category) => (
                <motion.div
                  key={category}
                  className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className="h-4 w-4">
                    {getCategoryIcon(category, "h-4 w-4")}
                  </div>
                  <span className="text-sm">{category}</span>
                  <button
                    onClick={() => toggleCategoryFilter(category)}
                    className="ml-1 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
              {categoryFilters.length > 0 && (
                <button
                  onClick={() => setCategoryFilters([])}
                  className="text-sm text-gray-500 dark:text-gray-400 underline"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Panel */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-28 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-medium mb-4 text-black dark:text-white">Filters</h2>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2 text-black dark:text-white">Price Range</h3>
                  <Slider
                    defaultValue={priceRange}
                    max={1000}
                    step={10}
                    onValueChange={(value) => setPriceRange(value)}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2 text-black dark:text-white">Categories</h3>
                  <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
                    {productCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`category-${category}`}
                          checked={categoryFilters.includes(category)}
                          onCheckedChange={() => toggleCategoryFilter(category)}
                          className="border-gray-300 dark:border-gray-600"
                        />
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5">
                            {getCategoryIcon(category, "h-4 w-4")}
                          </div>
                          <Label htmlFor={`category-${category}`} className="text-sm text-black dark:text-white cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Shops */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2 text-black dark:text-white">Shops</h3>
                  <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
                    {shops.map((shop) => (
                      <div key={shop.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`shop-${shop.id}`}
                          checked={shopFilters.includes(shop.id)}
                          onCheckedChange={() => toggleShopFilter(shop.id)}
                          className="border-gray-300 dark:border-gray-600"
                        />
                        <Label htmlFor={`shop-${shop.id}`} className="text-sm text-black dark:text-white cursor-pointer">
                          {shop.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reset Filters */}
                <Button 
                  onClick={resetFilters} 
                  variant="outline" 
                  className="w-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            
            <div className="lg:flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-40 w-full rounded-xl" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SearchX className="h-10 w-10 text-gray-400" />
                      </div>
                      <h2 className="text-2xl font-serif font-medium mb-4 text-black dark:text-white">No products found</h2>
                      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        We couldn't find any products matching your search criteria. Try adjusting your filters or search term.
                      </p>
                      <Button 
                        onClick={() => resetFilters()}
                        variant="outline"
                        className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                        {currentProducts.map((product, index) => (
                          <motion.div 
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-10">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                              variant="outline"
                              className="w-10 h-10 p-0 rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                              const pageNumber = i + 1;
                              const isActive = currentPage === pageNumber;
                              
                              return (
                                <Button
                                  key={i}
                                  onClick={() => paginate(pageNumber)}
                                  variant={isActive ? "default" : "outline"}
                                  className={`w-10 h-10 p-0 rounded-full ${
                                    isActive 
                                      ? 'bg-black text-white dark:bg-white dark:text-black' 
                                      : 'bg-white dark:bg-gray-800 text-black dark:text-white border-gray-200 dark:border-gray-700'
                                  }`}
                                >
                                  {pageNumber}
                                </Button>
                              );
                            })}
                            
                            {totalPages > 5 && <span className="text-gray-500 dark:text-gray-400">...</span>}
                            
                            <Button
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              variant="outline"
                              className="w-10 h-10 p-0 rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-black dark:text-white"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Mobile Filter Dialog */}
      <Dialog open={showMobileFilter} onOpenChange={setShowMobileFilter}>
        <DialogContent className="sm:max-w-[425px] p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-medium text-black dark:text-white">Filter Products</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Adjust filters to find exactly what you're looking for.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-2 text-black dark:text-white">Price Range</h3>
              <Slider
                defaultValue={priceRange}
                max={1000}
                step={10}
                onValueChange={(value) => setPriceRange(value)}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            
            {/* Categories with Icons */}
            <div>
              <h3 className="font-medium mb-2 text-black dark:text-white">Categories</h3>
              <div className="space-y-2 pr-2">
                {productCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2 py-1.5">
                    <Checkbox
                      id={`category-mobile-${category}`}
                      checked={categoryFilters.includes(category)}
                      onCheckedChange={() => toggleCategoryFilter(category)}
                      className="border-gray-300 dark:border-gray-600"
                    />
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5">
                        {getCategoryIcon(category, "h-4 w-4")}
                      </div>
                      <Label htmlFor={`category-mobile-${category}`} className="text-sm text-black dark:text-white cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shops */}
            <div>
              <h3 className="font-medium mb-2 text-black dark:text-white">Shops</h3>
              <div className="space-y-2 pr-2">
                {shops.map((shop) => (
                  <div key={shop.id} className="flex items-center space-x-2 py-1.5">
                    <Checkbox
                      id={`shop-mobile-${shop.id}`}
                      checked={shopFilters.includes(shop.id)}
                      onCheckedChange={() => toggleShopFilter(shop.id)}
                      className="border-gray-300 dark:border-gray-600"
                    />
                    <Label htmlFor={`shop-mobile-${shop.id}`} className="text-sm text-black dark:text-white cursor-pointer">
                      {shop.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              onClick={resetFilters} 
              variant="outline"
              className="flex-1 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            >
              Reset Filters
            </Button>
            <Button 
              type="button" 
              onClick={() => setShowMobileFilter(false)}
              className="flex-1 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Browse;

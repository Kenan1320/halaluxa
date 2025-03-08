
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
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product } from '@/models/product';

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
  const [productsPerPage] = useState(9);
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
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Browse Products</h1>
            <p className="text-haluna-text-light">
              Explore our wide range of products from trusted Muslim businesses.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              {/* Desktop Filters */}
              <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6 sticky top-28">
                <h2 className="text-xl font-medium mb-4">Filters</h2>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <Slider
                    defaultValue={priceRange}
                    max={1000}
                    step={10}
                    onValueChange={(value) => setPriceRange(value)}
                  />
                  <div className="flex justify-between text-sm text-haluna-text-light mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Categories</h3>
                  {Array.from(new Set(products.map((product) => product.category))).map((category) => (
                    <div key={category} className="flex items-center space-x-2 mb-1">
                      <Checkbox
                        id={`category-${category}`}
                        checked={categoryFilters.includes(category)}
                        onCheckedChange={() => toggleCategoryFilter(category)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {/* Shops */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Shops</h3>
                  {shops.map((shop) => (
                    <div key={shop.id} className="flex items-center space-x-2 mb-1">
                      <Checkbox
                        id={`shop-${shop.id}`}
                        checked={shopFilters.includes(shop.id)}
                        onCheckedChange={() => toggleShopFilter(shop.id)}
                      />
                      <Label htmlFor={`shop-${shop.id}`} className="text-sm">
                        {shop.name}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {/* Reset Filters */}
                <Button onClick={resetFilters} variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </div>
              
              {/* Mobile Filter Button */}
              <Button onClick={() => setShowMobileFilter(true)} className="lg:hidden w-full">
                Show Filters
              </Button>
            </div>
            
            <div className="lg:flex-1">
              {/* Search and Sort Options */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="mb-2 md:mb-0 md:w-1/2">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full"
                  />
                </div>
                
                <div className="md:w-auto">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border rounded-lg p-2 text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="date">Newest</option>
                  </select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-40 w-full rounded-md" />
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
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SearchX className="h-10 w-10 text-haluna-text-light" />
                      </div>
                      <h2 className="text-2xl font-serif font-medium mb-4">No products found</h2>
                      <p className="text-haluna-text-light mb-8 max-w-md mx-auto">
                        We couldn't find any products matching your search criteria. Try adjusting your filters or search term.
                      </p>
                      <Button 
                        onClick={() => resetFilters()}
                        variant="outline"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentProducts.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                      
                      {/* Pagination */}
                      <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            variant="outline"
                            className="w-10 h-10 p-0"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                              key={i}
                              onClick={() => paginate(i + 1)}
                              variant={currentPage === i + 1 ? "default" : "outline"}
                              className="w-10 h-10 p-0"
                            >
                              {i + 1}
                            </Button>
                          ))}
                          
                          <Button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            className="w-10 h-10 p-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
            <DialogDescription>
              Adjust filters to find exactly what you're looking for.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <Slider
                defaultValue={priceRange}
                max={1000}
                step={10}
                onValueChange={(value) => setPriceRange(value)}
              />
              <div className="flex justify-between text-sm text-haluna-text-light mt-1">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              {Array.from(new Set(products.map((product) => product.category))).map((category) => (
                <div key={category} className="flex items-center space-x-2 mb-1">
                  <Checkbox
                    id={`category-mobile-${category}`}
                    checked={categoryFilters.includes(category)}
                    onCheckedChange={() => toggleCategoryFilter(category)}
                  />
                  <Label htmlFor={`category-mobile-${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
            
            {/* Shops */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Shops</h3>
              {shops.map((shop) => (
                <div key={shop.id} className="flex items-center space-x-2 mb-1">
                  <Checkbox
                    id={`shop-mobile-${shop.id}`}
                    checked={shopFilters.includes(shop.id)}
                    onCheckedChange={() => toggleShopFilter(shop.id)}
                  />
                  <Label htmlFor={`shop-mobile-${shop.id}`} className="text-sm">
                    {shop.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" onClick={resetFilters} variant="outline">
              Reset Filters
            </Button>
            <Button type="button" onClick={() => setShowMobileFilter(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Browse;

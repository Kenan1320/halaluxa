
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, ChevronDown, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/models/product';
import { getProducts, getProductsByCategory } from '@/services/productService';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils";

const Browse = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [halalCertified, setHalalCertified] = useState(false);
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let fetchedProducts: Product[];
        if (selectedCategory) {
          fetchedProducts = await getProductsByCategory(selectedCategory);
        } else {
          fetchedProducts = await getProducts();
        }
        
        // Extract categories from products
        const uniqueCategories = [...new Set(fetchedProducts.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          title: "Error",
          description: "Failed to load products.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory]);
  
  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to add items to your cart.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    addToCart(product);
    toast({
      title: "Success",
      description: `${product.name} added to cart.`,
    });
  };
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const priceA = a.price;
    const priceB = b.price;
    
    if (sortOrder === 'asc') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  }).filter(product => {
    if (priceRange) {
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    }
    return true;
  }).filter(product => {
    if (ratingFilter) {
      return product.rating >= ratingFilter;
    }
    return true;
  }).filter(product => {
    if (halalCertified) {
      return product.isHalalCertified === true;
    }
    return true;
  });
  
  const SkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="w-full h-40 rounded-md" />
          <CardContent className="p-4">
            <Skeleton className="h-4 w-[80%] mb-2" />
            <Skeleton className="h-3 w-[60%]" />
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-28 pb-10">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-6">Browse Products</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 pl-10 rounded-lg border-border focus:ring-0 focus:border-haluna-primary dark-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Category
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select a category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>All Categories</DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>{category}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Sort by Price
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort products by price</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder('asc')}>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('desc')}>Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Product Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Customize your search</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-3">
                            <Label htmlFor="price">Price Range</Label>
                            <Slider
                                id="price"
                                defaultValue={priceRange}
                                max={1000}
                                step={10}
                                onValueChange={(value) => setPriceRange(value)}
                            />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>${priceRange[0]}</span>
                                <span>${priceRange[1]}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Minimum Rating</Label>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setRatingFilter(ratingFilter === 4 ? null : 4)}
                                    className={cn(
                                        "justify-start",
                                        ratingFilter === 4 ? "bg-secondary text-haluna-primary" : "bg-background"
                                    )}
                                >
                                    <Star className="h-4 w-4 mr-2" />
                                    4 Stars & Up
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="halal"
                                checked={halalCertified}
                                onCheckedChange={(checked) => {
                                    if (typeof checked === 'boolean') {
                                        setHalalCertified(checked);
                                    }
                                }}
                            />
                            <Label htmlFor="halal">Halal Certified</Label>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Product Grid */}
            <div className="md:col-span-3">
                {loading ? (
                    <SkeletonCards />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <Card key={product.id} className="bg-card text-card-foreground shadow-md overflow-hidden dark-card">
                                <Link to={`/product/${product.id}`}>
                                    <div className="relative">
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-48 object-cover rounded-t-md transition-transform duration-300 hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <Skeleton className="w-full h-48 rounded-t-md" />
                                        )}
                                    </div>
                                </Link>
                                <CardContent className="p-4">
                                    <CardTitle className="text-lg font-semibold line-clamp-1">{product.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                                    <div className="flex items-center mt-2">
                                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                        <span className="text-sm text-muted-foreground">{product.rating || 4.5}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex items-center justify-between p-4">
                                    <span className="text-haluna-primary font-semibold">${product.price}</span>
                                    
                                    <Button onClick={() => handleAddToCart(product)}>
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                        {filteredProducts.length === 0 && !loading && (
                            <div className="col-span-full text-center py-12">
                                <p className="text-muted-foreground">No products found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;

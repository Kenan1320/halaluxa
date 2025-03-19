
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/container";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import PageLayout from "@/components/layout/PageLayout";
import {
  Filter,
  Star,
  ShoppingBag,
  MapPin,
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Store,
  Bookmark,
  Sparkles,
  X
} from "lucide-react";

// Mall categories
const mallCategories = [
  { id: "all", name: "All Categories" },
  { id: "food", name: "Food & Groceries" },
  { id: "fashion", name: "Fashion" },
  { id: "beauty", name: "Beauty" },
  { id: "home", name: "Home" },
  { id: "electronics", name: "Electronics" },
  { id: "books", name: "Books" },
  { id: "health", name: "Health" },
];

// Featured stores
const featuredStores = [
  {
    id: 1,
    name: "Halal Delights",
    image: "/placeholder.svg",
    category: "Food & Groceries",
    rating: 4.8,
    reviews: 124,
    featured: true,
    verified: true,
    products: 120,
    description: "Premium halal food products from around the world",
    tags: ["Organic", "Imported", "Fresh"],
    banner: "/placeholder.svg",
    location: "New York, USA",
    followers: 1240,
    categoryId: "food",
  },
  {
    id: 2,
    name: "Modest Fashion",
    image: "/placeholder.svg",
    category: "Fashion",
    rating: 4.6,
    reviews: 89,
    featured: true,
    verified: true,
    products: 350,
    description: "Stylish and modest clothing for the modern Muslim",
    tags: ["Modest", "Trendy", "Affordable"],
    banner: "/placeholder.svg",
    location: "London, UK",
    followers: 980,
    categoryId: "fashion",
  },
  {
    id: 3,
    name: "Barakah Butchers",
    image: "/placeholder.svg",
    category: "Food & Groceries",
    rating: 4.9,
    reviews: 210,
    featured: false,
    verified: true,
    products: 45,
    description: "Premium quality halal meat and poultry",
    tags: ["Organic", "Local", "Fresh"],
    banner: "/placeholder.svg",
    location: "Chicago, USA",
    followers: 560,
    categoryId: "food",
  },
  {
    id: 4,
    name: "Islamic Books",
    image: "/placeholder.svg",
    category: "Books",
    rating: 4.7,
    reviews: 56,
    featured: false,
    verified: true,
    products: 230,
    description: "Extensive collection of Islamic literature and educational materials",
    tags: ["Educational", "Spiritual", "Children"],
    banner: "/placeholder.svg",
    location: "Toronto, Canada",
    followers: 320,
    categoryId: "books",
  },
  {
    id: 5,
    name: "Halal Cosmetics",
    image: "/placeholder.svg",
    category: "Beauty",
    rating: 4.5,
    reviews: 78,
    featured: true,
    verified: true,
    products: 85,
    description: "Natural and halal-certified beauty products",
    tags: ["Natural", "Vegan", "Cruelty-Free"],
    banner: "/placeholder.svg",
    location: "Dubai, UAE",
    followers: 750,
    categoryId: "beauty",
  },
  {
    id: 6,
    name: "Barakah Bakery",
    image: "/placeholder.svg",
    category: "Food & Groceries",
    rating: 4.8,
    reviews: 92,
    featured: false,
    verified: false,
    products: 65,
    description: "Freshly baked goods using traditional recipes",
    tags: ["Artisanal", "Fresh", "Traditional"],
    banner: "/placeholder.svg",
    location: "Paris, France",
    followers: 420,
    categoryId: "food",
  },
  {
    id: 7,
    name: "Tech Halal",
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.4,
    reviews: 45,
    featured: false,
    verified: true,
    products: 120,
    description: "Latest tech gadgets and accessories",
    tags: ["Innovative", "Quality", "Affordable"],
    banner: "/placeholder.svg",
    location: "Tokyo, Japan",
    followers: 280,
    categoryId: "electronics",
  },
  {
    id: 8,
    name: "Home Essentials",
    image: "/placeholder.svg",
    category: "Home",
    rating: 4.6,
    reviews: 67,
    featured: false,
    verified: true,
    products: 180,
    description: "Beautiful Islamic home decor and furnishings",
    tags: ["Handcrafted", "Elegant", "Traditional"],
    banner: "/placeholder.svg",
    location: "Istanbul, Turkey",
    followers: 510,
    categoryId: "home",
  },
];

// Featured collections
const featuredCollections = [
  {
    id: 1,
    title: "Ramadan Essentials",
    image: "/placeholder.svg",
    stores: 12,
    description: "Everything you need for the holy month",
  },
  {
    id: 2,
    title: "Modest Fashion",
    image: "/placeholder.svg",
    stores: 8,
    description: "Stylish and modest clothing for all occasions",
  },
  {
    id: 3,
    title: "Halal Food Market",
    image: "/placeholder.svg",
    stores: 15,
    description: "Discover a world of halal culinary delights",
  },
];

const DigitalMallPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [savedStores, setSavedStores] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // For animation on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Filter stores based on selected category and search query
  const filteredStores = featuredStores.filter(
    (store) =>
      (selectedCategory === "all" || store.categoryId === selectedCategory) &&
      (searchQuery === "" ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    console.log("Searching for:", searchQuery);
  };

  const toggleSaveStore = (storeId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSavedStores((prev) => {
      if (prev.includes(storeId)) {
        return prev.filter((id) => id !== storeId);
      } else {
        return [...prev, storeId];
      }
    });
  };

  const resetSearch = () => {
    setSearchQuery("");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="space-y-8 pb-16">
        {/* Hero Section */}
        <section className="relative -mt-6 overflow-hidden rounded-xl md:rounded-2xl">
          <div className="keen-slider" style={{ height: "400px" }}>
            {featuredCollections.map((collection, index) => (
              <div key={collection.id} className={`keen-slider__slide ${index === 0 ? 'block' : 'hidden'}`}>
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/90 to-[#111d42]/70 z-10 flex flex-col justify-center px-8 md:px-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="max-w-2xl text-white"
                    >
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">{collection.title}</h1>
                      <p className="text-lg md:text-xl mb-6 text-white/90">{collection.description}</p>
                      <p className="text-white/80 mb-8">{collection.stores} stores</p>
                      <Button size="lg" className="bg-white text-[#1e3a5f] hover:bg-white/90">
                        Explore Collection
                      </Button>
                    </motion.div>
                  </div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Digital Mall</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Discover and shop from a wide range of Halal stores
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Switch to Local</span>
                <span className="sm:hidden">Local</span>
              </Button>
              <Button className="bg-[#1e3a5f] hover:bg-[#111d42] shadow-md">
                <ShoppingBag className="h-4 w-4 mr-2" />
                My Shops
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for shops and businesses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={resetSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </form>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {mallCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-medium mb-3">Store Type</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="verified" />
                            <Label htmlFor="verified">Verified Stores Only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="featured" />
                            <Label htmlFor="featured">Featured Stores</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="new" />
                            <Label htmlFor="new">New Arrivals</Label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Rating</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="rating-4" />
                            <Label htmlFor="rating-4" className="flex items-center">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ))}
                              <span className="ml-1">& up</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="rating-3" />
                            <Label htmlFor="rating-3" className="flex items-center">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ))}
                              <span className="ml-1">& up</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="rating-2" />
                            <Label htmlFor="rating-2" className="flex items-center">
                              {Array.from({ length: 2 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ))}
                              <span className="ml-1">& up</span>
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Location</h3>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="All Locations" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem value="north-america">North America</SelectItem>
                            <SelectItem value="europe">Europe</SelectItem>
                            <SelectItem value="asia">Asia</SelectItem>
                            <SelectItem value="middle-east">Middle East</SelectItem>
                            <SelectItem value="africa">Africa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6 gap-2">
                      <Button variant="outline">Clear All</Button>
                      <Button className="bg-[#1e3a5f] hover:bg-[#111d42]">Apply Filters</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Categories */}
          <div className="mt-8 flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
            {mallCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={selectedCategory === category.id ? "bg-[#1e3a5f] hover:bg-[#111d42]" : ""}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Featured Collections */}
          <section className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Collections</h2>
              <Link to="/collections" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCollections.map((collection) => (
                <Link key={collection.id} to={`/collections/${collection.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 duration-300 h-full border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-900">
                    <CardContent className="p-0 h-full">
                      <div className="relative h-48">
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${collection.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-xl font-bold text-white">{collection.title}</h3>
                          <p className="text-white/80 text-sm">{collection.stores} stores</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-600 dark:text-gray-300">{collection.description}</p>
                        <Button className="w-full mt-4 bg-[#1e3a5f] hover:bg-[#111d42] shadow-md">
                          Explore Collection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Stores Grid */}
          <section className="mt-12">
            <Tabs defaultValue={viewMode} onValueChange={setViewMode} className="w-full">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredStores.length} stores
                  {selectedCategory !== "all" && 
                    ` in ${mallCategories.find((c) => c.id === selectedCategory)?.name}`}
                </div>
                <div className="flex items-center gap-4">
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="rating-high">Rating: High to Low</SelectItem>
                      <SelectItem value="rating-low">Rating: Low to High</SelectItem>
                      <SelectItem value="products-high">Most Products</SelectItem>
                      <SelectItem value="followers-high">Most Followers</SelectItem>
                    </SelectContent>
                  </Select>
                  <TabsList>
                    <TabsTrigger value="grid">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-3 h-3 bg-current rounded-sm"></div>
                        <div className="w-3 h-3 bg-current rounded-sm"></div>
                        <div className="w-3 h-3 bg-current rounded-sm"></div>
                        <div className="w-3 h-3 bg-current rounded-sm"></div>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="list">
                      <div className="flex flex-col gap-1">
                        <div className="w-6 h-2 bg-current rounded-sm"></div>
                        <div className="w-6 h-2 bg-current rounded-sm"></div>
                        <div className="w-6 h-2 bg-current rounded-sm"></div>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredStores.map((store) => (
                    <Link key={store.id} to={`/store/${store.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 duration-300 h-full border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-900 group">
                        <CardContent className="p-0 h-full">
                          <div className="relative h-32 bg-gradient-to-r from-[#1e3a5f] to-[#111d42]">
                            <div 
                              className="absolute inset-0 bg-cover bg-center opacity-60"
                              style={{ backgroundImage: `url(${store.banner})` }}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`absolute top-2 right-2 rounded-full ${
                                savedStores.includes(store.id)
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "bg-white/20 text-white hover:bg-white/30"
                              }`}
                              onClick={(e) => toggleSaveStore(store.id, e)}
                            >
                              <Bookmark
                                className="h-4 w-4"
                                fill={savedStores.includes(store.id) ? "currentColor" : "none"}
                              />
                            </Button>
                            <div className="absolute -bottom-10 left-4">
                              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800">
                                <div 
                                  className="absolute inset-0 bg-cover bg-center"
                                  style={{ backgroundImage: `url(${store.image})` }}
                                />
                                {store.verified && (
                                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 pt-12 flex-1 flex flex-col">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {store.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" /> {store.location}
                                </p>
                              </div>
                              {store.featured && (
                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                                  <Sparkles className="h-3 w-3 mr-1" /> Featured
                                </Badge>
                              )}
                            </div>

                            <div className="mt-3 flex items-center">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 font-medium">{store.rating}</span>
                              </div>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{store.reviews} reviews</span>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                              {store.description}
                            </p>

                            <div className="flex flex-wrap gap-1 mt-3">
                              {store.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-100">{store.products}</span>{" "}
                                products
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-100">{store.followers}</span>{" "}
                                followers
                              </div>
                            </div>
                          </div>

                          <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
                            <Button className="w-full bg-[#1e3a5f] hover:bg-[#111d42] shadow-md">
                              Visit Store
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <div className="space-y-4">
                  {filteredStores.map((store) => (
                    <Link key={store.id} to={`/store/${store.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-[1.01] duration-300 border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-900 group">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="relative md:w-64 h-48 md:h-auto bg-gradient-to-r from-[#1e3a5f] to-[#111d42]">
                              <div 
                                className="absolute inset-0 bg-cover bg-center opacity-60"
                                style={{ backgroundImage: `url(${store.banner})` }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800">
                                  <div 
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${store.image})` }}
                                  />
                                  {store.verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                                      <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="p-6 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="font-medium text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {store.name}
                                    </h3>
                                    {store.featured && (
                                      <Badge className="ml-2 bg-gradient-to-r from-orange-500 to-red-500">
                                        <Sparkles className="h-3 w-3 mr-1" /> Featured
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                    <MapPin className="h-3 w-3 mr-1" /> {store.location}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`rounded-full ${
                                    savedStores.includes(store.id)
                                      ? "text-blue-500 hover:text-blue-600"
                                      : "text-gray-400 hover:text-gray-600"
                                  }`}
                                  onClick={(e) => toggleSaveStore(store.id, e)}
                                >
                                  <Bookmark
                                    className="h-5 w-5"
                                    fill={savedStores.includes(store.id) ? "currentColor" : "none"}
                                  />
                                </Button>
                              </div>

                              <div className="mt-3 flex items-center flex-wrap">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="ml-1 font-medium">{store.rating}</span>
                                </div>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {store.reviews} reviews
                                </span>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {store.products} products
                                </span>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {store.followers} followers
                                </span>
                              </div>

                              <p className="text-gray-600 dark:text-gray-300 mt-3">
                                {store.description}
                              </p>

                              <div className="flex flex-wrap gap-1 mt-4">
                                {store.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="mt-6 flex justify-end">
                                <Button className="bg-[#1e3a5f] hover:bg-[#111d42] shadow-md">
                                  Visit Store
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            {filteredStores.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">4</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">5</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </section>

          {/* Become a Seller */}
          <section className="mt-16 bg-gradient-to-r from-[#1e3a5f] to-[#111d42] text-white rounded-xl md:rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-pattern"></div>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Become a Seller on Halvi</h2>
                <p className="text-base md:text-lg text-white/90 mb-6">
                  Join our growing community of Halal businesses and reach thousands of customers worldwide.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-[#1e3a5f] hover:bg-white/90 shadow-md">
                    Apply Now
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-orange-500 animate-pulse"></div>
                  <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-blue-500 animate-pulse delay-300"></div>
                  <div className="relative w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Store className="h-24 w-24 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </PageLayout>
  );
};

export default DigitalMallPage;

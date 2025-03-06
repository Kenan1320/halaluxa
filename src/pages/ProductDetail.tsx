
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingBag, Check, Store, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/shop/ImageGallery';
import { useCart } from '@/context/CartContext';
import { mockProducts, Product } from '@/models/product';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { getProductById } from '@/services/productService'; 
import { addReview, getReviewsForProduct } from '@/services/reviewService';
import ReviewList from '@/components/shop/ReviewList';
import AddReviewForm from '@/components/shop/AddReviewForm';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [reviews, setReviews] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Fetch product data - first from localStorage, then fallback to mock data
    const fetchProduct = () => {
      setIsLoading(true);
      // Try to get the product from localStorage first
      const localProduct = getProductById(productId || '');
      
      // If not found in localStorage, check mock data
      const foundProduct = localProduct || mockProducts.find((p) => p.id === productId);
      
      setTimeout(() => {
        setProduct(foundProduct || null);
        setIsLoading(false);
      }, 500);
    };
    
    fetchProduct();
    loadReviews();
  }, [productId]);
  
  const loadReviews = () => {
    if (productId) {
      const productReviews = getReviewsForProduct(productId);
      setReviews(productReviews);
    }
  };
  
  const handleAddReview = (reviewData: any) => {
    if (product && user) {
      const newReview = addReview({
        productId: product.id,
        userId: user.id,
        username: user.username || user.email.split('@')[0],
        ...reviewData
      });
      
      toast({
        title: "Review Added",
        description: "Thank you for your feedback!",
      });
      
      loadReviews();
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    }
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-24 bg-gray-200 rounded mb-8"></div>
              <div className="h-12 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">Sorry, the product you are looking for does not exist or has been removed.</p>
            <Button onClick={() => navigate('/shop')}>
              Back to Shop
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/shop')}
              className="flex items-center text-haluna-text-light hover:text-haluna-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ImageGallery images={product.images} altText={product.name} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
                
                {/* Shop info */}
                <div className="flex items-center gap-2 mb-4">
                  <Link to={`/shop/${product.sellerId}`} className="flex items-center text-haluna-text-light hover:text-haluna-primary transition-colors">
                    <Store className="h-4 w-4 mr-1" />
                    <span>{product.sellerName || "Haluna Seller"}</span>
                  </Link>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < (product.rating || 5) ? 'fill-current' : ''}`} />
                    ))}
                    <span className="text-xs text-haluna-text-light ml-1">{product.rating || 5.0}</span>
                    <span className="text-xs text-haluna-text-light ml-1">({reviews.length} reviews)</span>
                  </div>
                  
                  {product.isHalalCertified && (
                    <span className="bg-haluna-primary text-white text-xs px-2 py-1 rounded-full">
                      Halal Certified
                    </span>
                  )}
                </div>
                
                <p className="text-2xl font-bold text-haluna-primary mb-4">
                  ${product.price.toFixed(2)}
                </p>
                
                <p className="text-haluna-text leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <div className="mb-8">
                  <h3 className="font-medium mb-2">Product Details</h3>
                  <ul className="space-y-2">
                    {product.details && Object.entries(product.details).map(([key, value]) => (
                      <li key={key} className="flex gap-2 text-sm">
                        <span className="font-medium text-haluna-text-light">{key}:</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="mr-6">
                    <h3 className="font-medium mb-2">Quantity</h3>
                    <div className="flex border rounded-md">
                      <button 
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-3 py-2 border-r hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-16 text-center"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        min={1}
                        max={product.stock}
                      />
                      <button 
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-3 py-2 border-l hover:bg-gray-100"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Availability</h3>
                    <div className="flex items-center gap-1">
                      {product.stock > 0 ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">In Stock</span>
                          <span className="text-haluna-text-light ml-1">({product.stock} available)</span>
                        </>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button variant="outline" className="p-3">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Tabs for description and reviews */}
          <div className="mt-16">
            <div className="border-b mb-8">
              <div className="flex gap-8">
                <button
                  className={`pb-4 px-2 font-medium ${activeTab === 'description' 
                    ? 'border-b-2 border-haluna-primary text-haluna-primary' 
                    : 'text-haluna-text-light'}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`pb-4 px-2 font-medium flex items-center ${activeTab === 'reviews' 
                    ? 'border-b-2 border-haluna-primary text-haluna-primary' 
                    : 'text-haluna-text-light'}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{reviews.length}</span>
                </button>
              </div>
            </div>
            
            {activeTab === 'description' ? (
              <div className="prose max-w-none">
                <p className="mb-6">{product.description}</p>
                
                {product.longDescription && (
                  <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-medium mb-6">Customer Reviews ({reviews.length})</h3>
                
                {isLoggedIn ? (
                  <AddReviewForm onSubmit={handleAddReview} />
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-4 text-haluna-text-light" />
                    <h4 className="font-medium mb-2">Share Your Thoughts</h4>
                    <p className="text-haluna-text-light mb-4">Login to leave a review for this product.</p>
                    <Button href="/login" variant="outline" size="sm">Login to Review</Button>
                  </div>
                )}
                
                <ReviewList reviews={reviews} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;

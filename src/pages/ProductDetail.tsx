
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product } from '@/models/product';
import { getProductById } from '@/services/productService';
import { ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import ReviewList from '@/components/shop/ReviewList';
import { useAuth } from '@/context/AuthContext';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'Aisha Khan',
      rating: 5,
      comment: 'Absolutely love this product! The quality is amazing and it arrived quickly.',
      createdAt: new Date(2024, 5, 1).toISOString(),
    },
    {
      id: '2',
      userId: 'user2',
      username: 'Omar Hassan',
      rating: 4,
      comment: 'Good product, but the shipping took a bit longer than expected.',
      createdAt: new Date(2024, 5, 5).toISOString(),
    },
    {
      id: '3',
      userId: 'user3',
      username: 'Fatima Ali',
      rating: 5,
      comment: 'Excellent customer service and a fantastic product. Highly recommend!',
      createdAt: new Date(2024, 5, 10).toISOString(),
    },
  ]);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    window.scrollTo(0, 0);

    if (productId) {
      setIsLoading(true);
      const fetchedProduct = getProductById(productId);
      setProduct(fetchedProduct);
      setIsLoading(false);
    }
  }, [productId]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const handleSubmitReview = (reviewData: { rating: number; comment: string }) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "You must be logged in to leave a review",
        variant: "destructive",
      });
      return;
    }

    const newReview = {
      id: `review-${Date.now()}`,
      userId: user?.id || 'anonymous',
      username: user?.name || (user?.email ? user.email.split('@')[0] : 'Anonymous User'),
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setReviewData({ rating: 5, comment: '' });
    toast({
      title: "Review Added",
      description: "Thank you for your feedback!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                <div className="flex justify-between">
                  <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
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
            <h2 className="text-3xl font-serif font-bold mb-4">Product Not Found</h2>
            <p className="text-haluna-text-light">
              The requested product could not be found. Please check the URL or browse our other products.
            </p>
            <Button href="/shop" variant="outline" className="mt-6">
              Browse Products
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="rounded-xl overflow-hidden shadow-sm">
              <img
                src={product.images[0] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>
              <div className="flex items-center text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="text-haluna-text-light ml-2">5.0 (35 reviews)</span>
              </div>
              <p className="text-haluna-text-light mb-6">{product.description}</p>

              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold text-haluna-primary">${product.price.toFixed(2)}</div>
                {product.isHalalCertified && (
                  <span className="bg-haluna-primary text-white text-xs px-2 py-1 rounded-full">
                    Halal Certified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-haluna-text">
                  Availability: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-haluna-text">
                  Category: {product.category}
                </span>
              </div>

              <Button
                size="lg"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
                className="w-full flex items-center justify-center"
              >
                {product.stock > 0 ? (
                  <>
                    Add to Cart <ShoppingBag className="ml-2" />
                  </>
                ) : (
                  'Out of Stock'
                )}
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-serif font-bold mb-6">Customer Reviews</h2>
            <ReviewList reviews={reviews} />
          </section>

          {/* Add Review Form */}
          {isLoggedIn && (
            <section className="mt-12">
              <h2 className="text-xl font-serif font-bold mb-4">Leave a Review</h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-4">
                  <Label htmlFor="rating" className="block text-sm font-medium text-haluna-text">
                    Rating
                  </Label>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 cursor-pointer ${i < reviewData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        onClick={() => setReviewData({ ...reviewData, rating: i + 1 })}
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="comment" className="block text-sm font-medium text-haluna-text">
                    Comment
                  </Label>
                  <Textarea
                    id="comment"
                    rows={4}
                    className="shadow-sm focus:ring-haluna-primary focus:border-haluna-primary mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  />
                </div>
                <Button onClick={() => handleSubmitReview(reviewData)}>Submit Review</Button>
              </div>
            </section>
          )}

          {!isLoggedIn && (
            <div className="mt-8 text-center">
              <p className="text-haluna-text-light">
                You must be <Link to="/login" className="text-haluna-primary hover:underline">logged in</Link> to leave a review.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;

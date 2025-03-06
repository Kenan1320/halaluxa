
interface Review {
  id: string;
  productId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Get all reviews from localStorage
export const getReviews = (): Review[] => {
  const storedReviews = localStorage.getItem('reviews');
  if (storedReviews) {
    return JSON.parse(storedReviews);
  }
  return [];
};

// Get reviews for a specific product
export const getReviewsForProduct = (productId: string): Review[] => {
  const reviews = getReviews();
  return reviews.filter(review => review.productId === productId);
};

// Add a new review
export const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>): Review => {
  const reviews = getReviews();
  
  const newReview: Review = {
    ...reviewData,
    id: `review-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  const updatedReviews = [...reviews, newReview];
  localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  
  return newReview;
};

// Delete a review
export const deleteReview = (reviewId: string): void => {
  const reviews = getReviews();
  const updatedReviews = reviews.filter(r => r.id !== reviewId);
  localStorage.setItem('reviews', JSON.stringify(updatedReviews));
};

// Update a review
export const updateReview = (reviewId: string, updates: Partial<Omit<Review, 'id' | 'createdAt'>>): Review | null => {
  const reviews = getReviews();
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);
  
  if (reviewIndex === -1) {
    return null;
  }
  
  const updatedReview = { ...reviews[reviewIndex], ...updates };
  reviews[reviewIndex] = updatedReview;
  
  localStorage.setItem('reviews', JSON.stringify(reviews));
  return updatedReview;
};

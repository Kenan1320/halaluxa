
import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg text-center">
        <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-haluna-text-light text-lg">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 hover:bg-gray-50 p-4 rounded-lg transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium flex items-center">
                <div className="w-8 h-8 rounded-full bg-haluna-primary-light flex items-center justify-center text-haluna-primary mr-2">
                  {review.username.charAt(0).toUpperCase()}
                </div>
                {review.username}
              </div>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm text-haluna-text-light">
                  {review.rating}/5
                </span>
              </div>
            </div>
            <div className="text-xs text-haluna-text-light bg-gray-100 px-2 py-1 rounded-full">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </div>
          </div>
          <p className="mt-3 text-haluna-text">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;

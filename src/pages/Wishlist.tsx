
import React from 'react';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-20">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg">
        <Heart className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 text-center mb-6">Add items to your wishlist to keep track of products you love.</p>
        <a 
          href="/" 
          className="px-6 py-2 bg-[#2A866A] text-white rounded-lg hover:bg-[#237558] transition-colors"
        >
          Start shopping
        </a>
      </div>
    </div>
  );
};

export default Wishlist;

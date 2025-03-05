
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Shop = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Shop</h1>
            <p className="text-haluna-text-light text-lg mb-8">
              Browse our collection of halal products from verified Muslim businesses.
            </p>
            
            {/* Placeholder for future shop content */}
            <div className="py-20 text-center">
              <p className="text-haluna-text-light">Shop content coming soon...</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;


import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

const Hero = () => {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-haluna-primary-light to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
            <span className="inline-block px-4 py-1 rounded-full bg-haluna-accent text-haluna-text text-sm font-medium mb-4 animate-fade-in">
              Discover Halal Treasures
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 animate-fade-in animate-delay-100">
              The Premier <span className="text-haluna-primary">Halal</span> Marketplace
            </h1>
            <p className="text-haluna-text-light text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in animate-delay-200">
              Connect with authentic Muslim businesses and discover ethically sourced products that align with your values.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in animate-delay-300">
              <Button href="/shop" size="lg" className="flex items-center">
                Start Shopping <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button href="/sellers" variant="outline" size="lg">
                Sell Your Products
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0 animate-fade-in animate-delay-400">
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-haluna-primary">250+</p>
                <p className="text-haluna-text-light text-sm">Muslim Sellers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-haluna-primary">2,500+</p>
                <p className="text-haluna-text-light text-sm">Halal Products</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-haluna-primary">10,000+</p>
                <p className="text-haluna-text-light text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
          
          {/* Hero Image - Placeholder */}
          <div className="lg:w-1/2 relative">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden shadow-xl animate-float bg-haluna-secondary h-80 md:h-96 flex items-center justify-center">
                <div className="text-center p-6">
                  <h3 className="text-2xl font-serif font-bold text-haluna-primary mb-2">Haluna Marketplace</h3>
                  <p className="text-haluna-text">Your one-stop destination for halal products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

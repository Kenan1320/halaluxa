
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

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
          
          {/* Hero Image */}
          <div className="lg:w-1/2 relative">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden shadow-xl animate-float">
                <img 
                  src="/lovable-uploads/d4ab324c-23f0-4fcc-9069-0afbc77d1c3e.png" 
                  alt="Haluna Marketplace" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-8 -left-8 bg-white rounded-lg p-3 shadow-lg animate-float-slow">
                <img 
                  src="/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png" 
                  alt="Product category" 
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-3 shadow-lg animate-float-slow">
                <img 
                  src="/lovable-uploads/0780684a-9c7f-4f32-affc-6f9ea641b814.png" 
                  alt="Shopping cart" 
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

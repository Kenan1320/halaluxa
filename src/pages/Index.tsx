
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import CategoryCard from '@/components/home/CategoryCard';
import Stats from '@/components/home/Stats';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <Features />
        
        {/* Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-haluna-primary-light text-haluna-primary text-sm font-medium mb-4">
                Browse By Category
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Discover Our Collection
              </h2>
              <p className="text-haluna-text-light max-w-2xl mx-auto">
                Explore a wide range of halal products across multiple categories curated for quality and authenticity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CategoryCard 
                title="Clothing & Fashion"
                description="Modest apparel with contemporary designs"
                imageSrc="/lovable-uploads/26c50a86-ec95-4072-8f0c-ac930a65b34d.png"
                backgroundColor="bg-haluna-primary-light"
                link="/shop"
              />
              <CategoryCard 
                title="Food & Cuisine"
                description="Authentic halal delicacies and ingredients"
                imageSrc="/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png"
                backgroundColor="bg-haluna-beige"
                link="/shop"
              />
              <CategoryCard 
                title="Beauty & Wellness"
                description="Natural and halal-certified care products"
                imageSrc="/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png"
                backgroundColor="bg-haluna-sage"
                link="/shop"
              />
              <CategoryCard 
                title="Home & Decor"
                description="Elegant Islamic art and home accessories"
                imageSrc="/lovable-uploads/d8db1529-74b3-4d86-b64a-f0c8b0f92c5c.png"
                backgroundColor="bg-haluna-cream"
                link="/shop"
              />
            </div>
            
            <div className="text-center mt-12">
              <Button href="/shop" variant="outline" className="inline-flex items-center">
                View All Categories <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <Stats />
        
        {/* Call To Action Section */}
        <section className="py-20 bg-haluna-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Ready to Join the Haluna Community?
              </h2>
              <p className="text-haluna-text-light text-lg mb-8 max-w-2xl mx-auto">
                Whether you're looking to shop ethically sourced halal products or grow your business reach, Haluna is the platform for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/shop" size="lg">
                  Start Shopping
                </Button>
                <Button href="/sellers" variant="outline" size="lg">
                  Become a Seller
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

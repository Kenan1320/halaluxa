
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const About = () => {
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Haluna</h1>
            <p className="text-haluna-text-light text-lg mb-8">
              A curated marketplace connecting Muslim artisans and shoppers through beautiful, ethically sourced products.
            </p>
            
            {/* Placeholder for future about content */}
            <div className="py-20 text-center">
              <p className="text-haluna-text-light">About content coming soon...</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

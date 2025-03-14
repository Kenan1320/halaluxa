
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

const HomeHero = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();

  return (
    <section className={`py-10 ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Discover the Finest <span className={`${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Halal Products</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Shop with confidence from verified halal sellers. Find everything from groceries to home goods, all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl px-6 py-3 font-medium"
              >
                Start Shopping
              </Button>
              <Button 
                onClick={() => navigate('/shops')}
                variant="outline"
                className="bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-6 py-3 flex items-center justify-center font-medium"
              >
                Browse Shops <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl overflow-hidden aspect-square md:aspect-[4/3] bg-gray-200 dark:bg-gray-800"
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">Hero Image</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default HomeHero;

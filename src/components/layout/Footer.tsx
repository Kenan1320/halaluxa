
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, Globe, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  // Don't show footer on dashboard pages
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show back to top button when scrolled down
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    });
  }

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & About */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src="/logo.png" alt="Haluna" className="h-10 w-auto" />
            </Link>
            <p className="text-gray-600 mb-4">
              Discover and order from the best halal shops and products near you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="font-medium text-lg mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Business Owners */}
          <div>
            <h3 className="font-medium text-lg mb-4">For Business Owners</h3>
            <p className="text-gray-600 mb-4">
              Ready to grow your halal business? Join our platform and reach more customers.
            </p>
            <Link to="/business/login">
              <motion.div
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg px-6 py-3 shadow-md"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Sign Up or Login as Business
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Haluna. All rights reserved.
          </p>
          <div className="flex space-x-4 items-center">
            <Mail size={16} className="text-gray-400" />
            <span className="text-gray-600 text-sm">support@haluna.com</span>
            <Globe size={16} className="text-gray-400 ml-4" />
            <span className="text-gray-600 text-sm">English (US)</span>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 bg-emerald-500 text-white p-3 rounded-full shadow-lg z-50"
            onClick={scrollToTop}
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}

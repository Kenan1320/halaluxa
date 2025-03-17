
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* HALVI Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6 uppercase">HALVI</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/become-seller" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg transition">
                  Become a Seller
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link to="/affiliates" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg transition">
                  Affiliate & Drivers
                </Link>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">New</span>
              </li>
              <li>
                <Link to="/shops" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg transition">
                  Find Shops
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6 uppercase">HELP</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6 uppercase">LEGAL</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* FOLLOW US Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6 uppercase">FOLLOW US</h3>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <Facebook className="w-8 h-8" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <Instagram className="w-8 h-8" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <Twitter className="w-8 h-8" />
              </a>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              © {currentYear} Halvi, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

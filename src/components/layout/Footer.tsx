
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-10 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* HALVI Section */}
          <div>
            <h3 className="text-xl font-bold mb-5 uppercase">HALVI</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/become-seller" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Become a Seller
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link to="/affiliates" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Affiliate & Drivers
                </Link>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
              </li>
              <li>
                <Link to="/shops" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Find Shops
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP Section */}
          <div>
            <h3 className="text-xl font-bold mb-5 uppercase">HELP</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL Section */}
          <div>
            <h3 className="text-xl font-bold mb-5 uppercase">LEGAL</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition flex items-center">
                  Admin Portal <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </li>
            </ul>
          </div>

          {/* FOLLOW US Section */}
          <div>
            <h3 className="text-xl font-bold mb-5 uppercase">FOLLOW US</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} Halvi, Inc. All rights reserved.
            </p>
            
            <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Made with love for the community
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

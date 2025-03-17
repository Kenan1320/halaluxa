
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0F1B44] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* HALVI Section */}
          <div>
            <h3 className="text-xl font-bold mb-5">HALVI</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/become-seller" className="text-gray-300 hover:text-white transition">
                  Become a Seller
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link to="/affiliates" className="text-gray-300 hover:text-white transition">
                  Affiliate Program
                </Link>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP Section */}
          <div>
            <h3 className="text-xl font-bold mb-5">HELP</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white transition">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white transition">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL Section */}
          <div>
            <h3 className="text-xl font-bold mb-5">LEGAL</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-300 hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-300 hover:text-white transition">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT US Section */}
          <div>
            <h3 className="text-xl font-bold mb-5">CONTACT US</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-300" />
                <span className="text-gray-300">123 Halal Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-gray-300" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-300" />
                <span className="text-gray-300">support@halvi.com</span>
              </li>
            </ul>
            
            <div className="mt-5">
              <h4 className="text-lg font-medium mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-sky-500 p-2 rounded-full hover:bg-sky-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            © {currentYear} Halvi, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

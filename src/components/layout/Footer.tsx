
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-[#1e3a5f] to-[#111d42] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main company info */}
          <div>
            <h3 className="relative inline-block text-xl font-bold mb-4">
              <span className="text-white">Halvi</span>
              <span className="text-orange-400 absolute -right-2.5 top-0">.</span>
            </h3>
            <p className="text-gray-300 mb-4">
              The Halal Village - Your one-stop platform for all Halal products and services.
            </p>
            <div className="flex items-center mt-3 text-gray-300 text-sm">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              Made with love for the community
            </div>
          </div>

          {/* HELP & LEGAL Sections */}
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
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
                <Link to="/shops" className="text-gray-300 hover:text-white transition">
                  Find Shops
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP Section */}
          <div>
            <h4 className="font-medium mb-4">Help & Support</h4>
            <ul className="space-y-2">
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
                <Link to="/contact" className="text-gray-300 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
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
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div>
            <h4 className="font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
            
            <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition flex items-center mt-4">
              Admin Portal <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Bottom footer with copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-wrap justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <Link to="/about" className="hover:text-white transition">About Us</Link>
            <span>|</span>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <span>|</span>
            <Link to="/help" className="hover:text-white transition">Help</Link>
          </div>
          <div className="text-center text-sm text-gray-400">
            © {currentYear} Halvi. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

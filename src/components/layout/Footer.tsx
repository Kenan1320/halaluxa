
import { Link } from 'react-router-dom';
import { ExternalLink, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DirectAdminAccess, AdminAccessCode } from '@/components/admin/DirectAdminAccess';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-12 pb-8 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        {/* Dev-only Admin Access Section */}
        {import.meta.env.DEV && (
          <div className="mb-8 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Developer Tools</h3>
                <p className="text-sm text-muted-foreground">Quick access to admin features in dev mode</p>
              </div>
              <div className="flex flex-col gap-2">
                <DirectAdminAccess className="w-full sm:w-auto" variant="default" />
                <AdminAccessCode />
              </div>
            </div>
          </div>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Our Story</Link></li>
              <li><Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Careers</Link></li>
              <li><Link to="/press" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Press</Link></li>
              <li><Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/orders/tracking" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Order Tracking</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/returns" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Return Policy</Link></li>
              <li><Link to="/accessibility" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">Accessibility</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">123 Market Street, San Francisco, CA</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">support@example.com</span>
              </li>
            </ul>
            
            <div className="mt-4 flex items-center gap-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">© 2023 Your Company. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/sellers" className="hover:text-gray-900 dark:hover:text-white transition flex items-center gap-1">
              Become a Seller
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link to="/affiliate-program" className="hover:text-gray-900 dark:hover:text-white transition flex items-center gap-1">
              Affiliates
              <ExternalLink className="w-3 h-3" />
            </Link>
            {import.meta.env.DEV && (
              <Link to="/admin" className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition flex items-center gap-1 font-medium">
                Admin Portal
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

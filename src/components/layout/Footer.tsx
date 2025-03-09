
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import BusinessSignupButton from "./BusinessSignupButton";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src="/logo.png" alt="Haluna" className="h-12" />
            </Link>
            <p className="text-haluna-text-light mb-6 max-w-xs">
              Connecting you with Muslim-owned businesses offering halal products and services
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-haluna-primary hover:text-haluna-primary-dark transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-haluna-primary hover:text-haluna-primary-dark transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-haluna-primary hover:text-haluna-primary-dark transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-haluna-text-light hover:text-haluna-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shops" className="text-haluna-text-light hover:text-haluna-primary transition-colors">
                  Browse Shops
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-haluna-text-light hover:text-haluna-primary transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/business/login" className="text-haluna-text-light hover:text-haluna-primary transition-colors">
                  Business Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-haluna-text-light hover:text-haluna-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-haluna-text-light hover:text-haluna-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-haluna-text-light hover:text-haluna-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-haluna-text-light hover:text-haluna-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Business Owners</h3>
            <p className="text-haluna-text-light mb-6">
              Start selling your halal products online today
            </p>
            <BusinessSignupButton />
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-haluna-text-light text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Haluna. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-haluna-text-light hover:text-haluna-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-haluna-text-light hover:text-haluna-primary transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-haluna-text-light hover:text-haluna-primary transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

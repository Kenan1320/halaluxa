
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-haluna-secondary pt-16 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <h2 className="text-haluna-primary text-3xl font-serif">Haluna</h2>
              <span className="ml-1 h-3 w-3 rounded-full bg-haluna-accent inline-block mt-1"></span>
            </Link>
            <p className="text-haluna-text-light">
              A curated marketplace connecting Muslim artisans and shoppers through beautiful, ethically sourced products.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="#" 
                className="p-2 rounded-full bg-white text-haluna-primary hover:bg-haluna-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-white text-haluna-primary hover:bg-haluna-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-white text-haluna-primary hover:bg-haluna-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-xl mb-6 text-haluna-text">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/sellers" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Sellers</Link>
              </li>
              <li>
                <Link to="/about" className="text-haluna-text-light hover:text-haluna-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="#" className="text-haluna-text-light hover:text-haluna-primary transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="#" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="#" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-medium text-xl mb-6 text-haluna-text">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Clothing & Fashion</Link>
              </li>
              <li>
                <Link to="#" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Food & Cuisine</Link>
              </li>
              <li>
                <Link to="#" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Beauty & Wellness</Link>
              </li>
              <li>
                <Link to="#" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Home & Decor</Link>
              </li>
              <li>
                <Link to="#" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Books & Stationery</Link>
              </li>
              <li>
                <Link to="#" className="text-haluna-text-light hover:text-haluna-primary transition-colors">Islamic Art</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="font-medium text-xl mb-6 text-haluna-text">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 text-haluna-primary mt-1 flex-shrink-0" />
                <span className="text-haluna-text-light">123 Halal Street, Dubai, UAE</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 text-haluna-primary flex-shrink-0" />
                <span className="text-haluna-text-light">+971 50 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-haluna-primary flex-shrink-0" />
                <span className="text-haluna-text-light">hello@haluna.com</span>
              </li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-haluna-border">
              <h4 className="font-medium mb-3 text-haluna-text">Join Our Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-l-full border-y border-l border-haluna-border focus:outline-none focus:border-haluna-primary flex-1"
                />
                <button className="bg-haluna-primary text-white px-4 py-2 rounded-r-full hover:bg-haluna-primary-dark transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-haluna-border mt-12 pt-6 text-center text-haluna-text-light">
          <p>&copy; {new Date().getFullYear()} Haluna. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

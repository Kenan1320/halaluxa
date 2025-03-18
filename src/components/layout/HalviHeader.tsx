
import { useState, useEffect } from "react";
import { Search, Menu, MapPin, ChevronDown, ChevronRight, ShoppingCart, User, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function HalviHeader() {
  const [searchPlaceholder, setSearchPlaceholder] = useState("Your Halal Village, All in One Place");
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("Good morning");
  const { mode } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Alternate search placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchPlaceholder((prev) =>
        prev === "Your Halal Village, All in One Place"
          ? "Search The Hal Village with Halvi"
          : "Your Halal Village, All in One Place"
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Update time and greeting
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
      setCurrentTime(formattedTime);

      if (hours >= 5 && hours < 12) {
        setGreeting("Good morning");
      } else if (hours >= 12 && hours < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    "Clothing",
    "Electronics",
    "Grocery",
    "Home",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Automotive",
    "Health",
    "Pets",
    "Garden",
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput = e.currentTarget.querySelector('input') as HTMLInputElement;
    if (searchInput?.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.value.trim())}`);
    }
  };

  return (
    <div className="w-full">
      {/* Main header with gradient background */}
      <header className="w-full bg-gradient-to-br from-[#B3E5FC] via-[#6A8CF7] to-[#4F46E5] text-white">
        {/* Top navigation bar */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Menu and Logo */}
            <div className="flex items-center">
              <button className="mr-6">
                <Menu className="w-8 h-8" />
                <span className="sr-only">Menu</span>
              </button>
              <Link to="/" className="text-4xl font-serif">
                Halvi<span className="text-orange-400">.</span>
              </Link>
            </div>

            {/* Right side - Shop, Cart, Profile icons */}
            <div className="flex items-center space-x-4">
              {/* Shop icon with notification */}
              <Link to="/shops" className="relative">
                <div className="bg-white rounded-full p-3">
                  <Store className="w-6 h-6 text-gray-700" />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </Link>

              {/* Cart icon with notification */}
              <Link to="/cart" className="relative">
                <div className="bg-orange-500 rounded-full p-3">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* Profile icon */}
              <Link to={isLoggedIn ? "/profile" : "/login"} className="bg-emerald-500 rounded-full p-3">
                <User className="w-6 h-6 text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Location bar - Talabat style */}
        <div className="container mx-auto px-4 pb-3">
          <div className="flex items-center text-white">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Deliver to</span>
            <span className="ml-2 text-sm font-medium truncate max-w-[250px] sm:max-w-md">
              Togary Street, Halvi Center
            </span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Search bar with transitioning placeholder */}
        <div className="container mx-auto px-4 pb-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 bg-gray-100/90"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              {currentTime}
            </div>
          </form>
        </div>

        {/* Greeting */}
        <div className="container mx-auto px-4 pb-3">
          <h2 className="text-xl">{greeting}, {isLoggedIn && user ? user.name : 'Guest'}</h2>
        </div>

        {/* Promotional banner - Talabat style */}
        <div className="relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-10 top-10 text-white/10">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="absolute right-10 top-5 text-white/10">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6 relative">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 bg-white rounded-full opacity-20"></div>
                  <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                      <circle cx="12" cy="12" r="5" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Halal Shopping Made Easy</h2>
                <p className="text-lg opacity-90">Discover, shop, enjoy!</p>
              </div>
            </div>
          </div>

          {/* Wave effect at bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 C1150,100 1350,0 1440,50 L1440,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        {/* Category buttons - horizontal scrollable */}
        <div className="bg-white pt-4 pb-6 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category, index) => (
                <CategoryButton key={index} label={category} />
              ))}

              {/* Navigation arrow */}
              <button className="bg-white dark:bg-gray-800 rounded-full p-2 flex items-center justify-center shadow-sm dark:shadow-gray-800">
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

function CategoryButton({ label }: { label: string }) {
  return (
    <button className="bg-[#4F46E5]/10 text-[#4F46E5] dark:bg-[#4F46E5]/20 dark:text-[#A5B4FC] rounded-full px-6 py-3 whitespace-nowrap shadow-sm hover:bg-[#4F46E5]/20 dark:hover:bg-[#4F46E5]/30 transition-all">
      {label}
    </button>
  );
}

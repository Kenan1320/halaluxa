
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, ShoppingCart, User, Menu, MapPin, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const categories = [
  "Clothing",
  "Electronics",
  "Grocery",
  "Home",
  "Beauty",
  "Sports",
  "Books",
  "Toys",
];

export default function Header() {
  const [searchPlaceholder, setSearchPlaceholder] = useState("Your Halal Village, All in One Place");
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("Good morning");
  const { user, isLoading } = useAuth();
  const isAuthenticated = user !== null && !isLoading;

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

  const CategoryButton = ({ label }: { label: string }) => {
    return (
      <button className="bg-[#4F46E5]/10 text-[#4F46E5] rounded-full px-6 py-3 whitespace-nowrap shadow-sm hover:bg-[#4F46E5]/20 transition-all dark:bg-[#4F46E5]/30 dark:text-white">
        {label}
      </button>
    );
  };

  return (
    <div className="w-full">
      {/* Main header with gradient background */}
      <header className="w-full bg-gradient-to-br from-[#B3E5FC] via-[#6A8CF7] to-[#4F46E5] text-white dark:from-[#1e3a5f] dark:to-[#111d42]">
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
              <div className="relative">
                <Link to="/shops" className="block">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-gray-700" />
                  </div>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </span>
                </Link>
              </div>

              {/* Cart icon with notification */}
              <div className="relative">
                <Link to="/cart" className="block">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Link>
              </div>

              {/* Profile icon */}
              {isAuthenticated ? (
                <Link to="/profile" className="block">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    {user && user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name || 'Profile'} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                </Link>
              ) : (
                <Link to="/login" className="block">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </Link>
              )}
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
          <div className="relative">
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
          </div>
        </div>

        {/* Greeting */}
        <div className="container mx-auto px-4 pb-3">
          <h2 className="text-xl">{greeting}, {isAuthenticated && user ? user.name : 'Guest'}</h2>
        </div>

        {/* Category buttons - horizontal scrollable */}
        <div className="bg-white dark:bg-gray-900 pt-4 pb-6">
          <div className="container mx-auto px-4">
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category, index) => (
                <CategoryButton key={index} label={category} />
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

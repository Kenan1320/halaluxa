
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define categories with new names and image paths for the uploaded icons
const categories = [
  { id: 1, name: 'Local Halal Restaurants', icon: '/lovable-uploads/33473605-0fc6-42cb-b43f-611ca39e7974.png', color: '#2A866A' },
  { id: 2, name: 'Halal Butcher Shops', icon: '/lovable-uploads/f6d6f4f3-7512-4062-a680-623cc1fedbeb.png', color: '#2A866A' },
  { id: 3, name: 'Local Halal Grocery Stores', icon: '/lovable-uploads/945fdb0b-0a69-4959-8bbd-7e04b4d2c302.png', color: '#2A866A' },
  { id: 4, name: 'Halal Wellness & Therapy Centers', icon: '/lovable-uploads/afa25d90-d483-4dc6-869f-7ae45dc603c1.png', color: '#2A866A' },
  { id: 5, name: 'Home & Furniture Stores', icon: '/lovable-uploads/7dc19b16-ff98-421a-b0eb-0a361c1d2b71.png', color: '#2A866A' },
  { id: 6, name: 'Islamic Home Decor & Accessories', icon: '/lovable-uploads/ce21c020-0b24-44ca-b4ae-d65aeb2c1521.png', color: '#2A866A' },
  { id: 7, name: 'Islamic Art & Calligraphy Services', icon: '/lovable-uploads/1965192d-c719-48ca-bdc0-a04304367fa1.png', color: '#2A866A' },
  { id: 8, name: 'Islamic Gifts & Specialty Shops', icon: '/lovable-uploads/4405a5c7-2649-47d1-b9c6-23aed24cbd78.png', color: '#2A866A' },
  { id: 9, name: 'Halvi Marketplace', icon: '/lovable-uploads/90ba1157-a6f3-48db-a573-42025b1b9b8f.png', color: '#2A866A' },
  { id: 10, name: 'Learn Arabic', icon: '/lovable-uploads/c37a7b51-ecf8-41f5-80b4-ce2b04638ccf.png', color: '#2A866A' },
  { id: 11, name: 'Modest Wear - Hijabs', icon: '/lovable-uploads/8273b5a9-f0c1-42f0-9379-3066df673278.png', color: '#2A866A' },
  { id: 12, name: 'Modest Wear - Abayas & Dresses', icon: '/lovable-uploads/b715b790-ea10-4ff3-8580-ebe7a7170ee4.png', color: '#2A866A' },
  { id: 13, name: 'Men\'s Islamic Wear - Thobes & Jubbas', icon: '/lovable-uploads/42d710d1-d270-40bf-8c4a-7c152adaad99.png', color: '#2A866A' },
  { id: 14, name: 'Islamic Books & more', icon: '/lovable-uploads/b7391005-ab3c-4698-85d5-1192b4fc4df6.png', color: '#2A866A' }
];

const CategoryScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    let animationId: number;
    let scrollPosition = 0;
    let scrollDirection = 1;
    let isPaused = false;
    
    const autoScroll = () => {
      if (!scrollContainer || isPaused) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }
      
      scrollPosition += 0.5 * scrollDirection;
      scrollContainer.scrollLeft = scrollPosition;
      
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollDirection = -1;
      } else if (scrollPosition <= 0) {
        scrollDirection = 1;
      }
      
      animationId = requestAnimationFrame(autoScroll);
    };
    
    animationId = requestAnimationFrame(autoScroll);
    
    const handlePause = () => { isPaused = true; };
    const handleResume = () => { isPaused = false; };
    
    scrollContainer.addEventListener('mouseenter', handlePause);
    scrollContainer.addEventListener('mouseleave', handleResume);
    scrollContainer.addEventListener('touchstart', handlePause);
    scrollContainer.addEventListener('touchend', handleResume);
    
    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handlePause);
      scrollContainer.removeEventListener('mouseleave', handleResume);
      scrollContainer.removeEventListener('touchstart', handlePause);
      scrollContainer.removeEventListener('touchend', handleResume);
    };
  }, []);
  
  const handleCategoryClick = (category: string) => {
    navigate(`/browse?category=${encodeURIComponent(category)}`);
  };
  
  return (
    <div className="relative w-full my-1">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide py-1 space-x-3"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className="flex-shrink-0 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-1 border border-gray-100"
            style={{ minWidth: '70px', height: '70px' }}
            whileHover={{ scale: 1.05, backgroundColor: '#F8F8F8' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.name)}
          >
            <img 
              src={category.icon} 
              alt={category.name}
              className="h-7 w-7 mb-1"
            />
            <span className="text-gray-800 text-xs font-medium text-center line-clamp-1 px-1">
              {category.name.split(' ')[0]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;

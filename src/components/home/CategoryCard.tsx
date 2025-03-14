
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  description: string;
  imageSrc: string;
  backgroundColor: string;
  link: string;
}

const CategoryCard = ({ title, description, imageSrc, backgroundColor, link }: CategoryCardProps) => {
  // Replace all mint or green colors with deep night blue gradient
  const bgColor = backgroundColor.includes('haluna-primary') || 
                  backgroundColor.includes('primary-light') || 
                  backgroundColor.includes('mint') || 
                  backgroundColor.includes('green') ? 
                  'deep-night-blue-gradient' : backgroundColor;
  
  return (
    <div 
      className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full ${bgColor}`}
    >
      <div className="p-8 flex flex-col h-full">
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-serif font-medium mb-3 text-white">{title}</h3>
          <p className="text-white/80">{description}</p>
        </div>
        
        <Link 
          to={link} 
          className="mt-auto inline-flex items-center text-white font-medium group"
        >
          Browse Collection{' '}
          <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default CategoryCard;

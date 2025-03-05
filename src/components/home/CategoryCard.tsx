
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
  return (
    <div 
      className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full ${backgroundColor}`}
    >
      <div className="p-8 flex flex-col h-full">
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-serif font-medium mb-3">{title}</h3>
          <p className="text-haluna-text-light">{description}</p>
        </div>
        
        <Link 
          to={link} 
          className="mt-auto inline-flex items-center text-haluna-primary font-medium group"
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


import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  viewAllLink?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  viewAllLink,
  className = ""
}) => {
  const { mode } = useTheme();
  
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h2 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h2>
      
      {viewAllLink && (
        <Link 
          to={viewAllLink}
          className={`flex items-center text-sm font-medium ${mode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
        >
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;

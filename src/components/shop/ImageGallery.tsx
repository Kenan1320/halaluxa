
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  altText: string;
}

const ImageGallery = ({ images, altText }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg">
        <p className="text-haluna-text-light">No images available</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="h-96 overflow-hidden rounded-lg">
        <img 
          src={images[0]} 
          alt={altText} 
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative h-96">
      <div className="h-full overflow-hidden rounded-lg">
        <img 
          src={images[currentIndex]} 
          alt={`${altText} - Image ${currentIndex + 1}`} 
          className="w-full h-full object-contain transition-opacity duration-300"
        />
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5 text-haluna-text" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5 text-haluna-text" />
      </button>
      
      {/* Thumbnail navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-haluna-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

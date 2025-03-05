
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface Slide {
  title: string;
  description: string;
  imageSrc: string;
}

interface OnboardingCarouselProps {
  slides: Slide[];
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingCarousel = ({ slides, onComplete, onSkip }: OnboardingCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const goToNextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (currentSlide === slides.length - 1) {
      onComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  const goToPrevSlide = () => {
    if (isAnimating || currentSlide === 0) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev) => prev - 1);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  // Auto advance slides every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        goToNextSlide();
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length]);
  
  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onSkip}
          className="px-4 py-2 text-haluna-text-light hover:text-haluna-primary transition-colors"
        >
          Skip
        </button>
      </div>
      
      {/* Carousel content */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className="min-w-full h-full flex flex-col items-center justify-center px-6"
            >
              <div className="max-w-md mx-auto text-center">
                <div className="mb-8 relative w-64 h-64 mx-auto">
                  <img 
                    src={slide.imageSrc} 
                    alt={slide.title} 
                    className="w-full h-full object-contain animate-float"
                  />
                </div>
                
                <h2 className="text-3xl font-serif font-bold mb-4 text-haluna-text animate-fade-in">
                  {slide.title}
                </h2>
                <p className="text-haluna-text-light mb-8 animate-fade-in animate-delay-200">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center items-center space-x-2 py-6">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-haluna-primary w-8' 
                : 'bg-haluna-primary/30'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Next/Prev buttons */}
      <div className="flex justify-between items-center px-6 py-6">
        <button
          onClick={goToPrevSlide}
          disabled={currentSlide === 0}
          className={`p-2 rounded-full ${
            currentSlide === 0 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-haluna-primary hover:bg-haluna-primary-light'
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <Button 
          onClick={goToNextSlide}
          size="lg"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          {currentSlide !== slides.length - 1 && <ChevronRight size={18} className="ml-1" />}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCarousel;

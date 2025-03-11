
import { useState, useEffect } from 'react';

interface RotatingPlaceholderProps {
  texts: string[];
  defaultText: string;
  rotationInterval?: number;
  defaultInterval?: number;
  onChange?: (text: string) => void;
}

const RotatingPlaceholder = ({
  texts,
  defaultText,
  rotationInterval = 3000,
  defaultInterval = 30000,
  onChange
}: RotatingPlaceholderProps) => {
  const [placeholder, setPlaceholder] = useState(defaultText);
  
  useEffect(() => {
    let currentIndex = 0;
    let isShowingDefault = true;
    let timer: NodeJS.Timeout;
    
    const rotatePlaceholder = () => {
      if (isShowingDefault) {
        // Switch to rotating texts
        isShowingDefault = false;
        setPlaceholder(texts[currentIndex]);
        if (onChange) onChange(texts[currentIndex]);
        currentIndex = (currentIndex + 1) % texts.length;
        timer = setTimeout(rotatePlaceholder, rotationInterval);
      } else if (currentIndex >= texts.length) {
        // Go back to default text after cycling through all rotating texts
        isShowingDefault = true;
        setPlaceholder(defaultText);
        if (onChange) onChange(defaultText);
        timer = setTimeout(rotatePlaceholder, defaultInterval);
        currentIndex = 0;
      } else {
        // Continue with rotating texts
        setPlaceholder(texts[currentIndex]);
        if (onChange) onChange(texts[currentIndex]);
        currentIndex = (currentIndex + 1) % texts.length;
        timer = setTimeout(rotatePlaceholder, rotationInterval);
      }
    };
    
    // Start the rotation
    timer = setTimeout(rotatePlaceholder, defaultInterval);
    
    // Clean up on unmount
    return () => clearTimeout(timer);
  }, [texts, defaultText, rotationInterval, defaultInterval, onChange]);
  
  return placeholder;
};

export default RotatingPlaceholder;

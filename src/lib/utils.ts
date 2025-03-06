
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function generateInitials(name: string): string {
  if (!name) return '';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

export function getRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getInitialCharacter(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function getGradientStyle(startColor: string, endColor: string, direction = 'to-b'): string {
  return `bg-gradient-${direction} from-[${startColor}] to-[${endColor}]`;
}

export function createAnimatedGradient(startColor: string, midColor: string, endColor: string) {
  return `linear-gradient(to bottom, ${startColor}, ${midColor}, ${endColor})`;
}

// New animation helpers
export function createPremiumGradient(colors: string[]) {
  return `linear-gradient(to bottom, ${colors.join(', ')})`;
}

export function getAnimationDelay(index: number, baseDelay = 0.1): number {
  return baseDelay * index;
}

export function getStaggeredAnimation(index: number, type: 'fade' | 'scale' | 'slide' = 'fade') {
  const delay = getAnimationDelay(index);
  
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5, delay }
    },
    scale: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.5, delay }
    },
    slide: {
      initial: { y: 10, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.5, delay }
    }
  };
  
  return animations[type];
}


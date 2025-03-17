
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

interface StylizedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StylizedLogo({ className = "", size = 'md' }: StylizedLogoProps) {
  const { mode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Map size to actual pixel dimensions
  const dimensions = {
    sm: { width: 80, height: 24 },
    md: { width: 100, height: 30 },
    lg: { width: 140, height: 42 }
  }[size];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set the canvas to be high resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Style properties
    const fontFamily = "'Playfair Display', serif";
    const fontSize = size === 'lg' ? "30px" : size === 'md' ? "22px" : "16px";
    const fontWeight = "bold";
    
    // Start the animation
    let animationFrame: number;
    let hue = 0;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a gradient from deep blue to green
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      
      const baseHue = (hue % 360);
      gradient.addColorStop(0, `hsl(${baseHue}, 80%, 35%)`); // Deep blue
      gradient.addColorStop(0.5, `hsl(${(baseHue + 30) % 360}, 80%, 40%)`); // Mid blue-green
      gradient.addColorStop(1, `hsl(${(baseHue + 60) % 360}, 80%, 35%)`); // Deep green
      
      // Text styling
      ctx.fillStyle = mode === 'dark' ? 'white' : gradient;
      ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Apply subtle shadow in dark mode
      if (mode === 'dark') {
        ctx.shadowColor = gradient;
        ctx.shadowBlur = 8;
      }
      
      // Draw text
      ctx.fillText("HALVI", canvas.width / (2 * dpr), canvas.height / (2 * dpr));
      
      // Increment hue for animation
      hue = (hue + 0.3) % 360;
      
      // Continue animation
      animationFrame = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => cancelAnimationFrame(animationFrame);
  }, [mode, size, dimensions]);
  
  return (
    <Link to="/" className={`inline-block overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        width={dimensions.width}
        height={dimensions.height}
        style={{ width: dimensions.width, height: dimensions.height }}
        className="cursor-pointer"
      />
    </Link>
  );
}

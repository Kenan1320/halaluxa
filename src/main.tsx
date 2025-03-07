
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Optimize animation performance
if (typeof window !== 'undefined') {
  // Add hardware acceleration hints for smoother animations
  document.documentElement.style.setProperty('--webkit-transform', 'translate3d(0,0,0)');
  document.documentElement.style.setProperty('--webkit-backface-visibility', 'hidden');
  document.documentElement.style.setProperty('--webkit-perspective', '1000px');
  
  // Prevent FOUC (Flash of Unstyled Content)
  document.documentElement.classList.add('no-fouc');
  
  // Additional performance optimizations for wave animations
  document.documentElement.style.setProperty('--webkit-font-smoothing', 'antialiased');
  document.documentElement.style.setProperty('--moz-osx-font-smoothing', 'grayscale');
  
  // Force GPU acceleration for smoother wave animations
  const style = document.createElement('style');
  style.textContent = `
    .force-gpu {
      transform: translateZ(0);
      will-change: transform;
    }
    .wave-animation {
      will-change: transform, opacity;
    }
  `;
  document.head.appendChild(style);
  
  // Handle PWA display modes
  if (window.matchMedia('(display-mode: standalone)').matches) {
    // The app is running in standalone mode (installed on home screen)
    document.documentElement.classList.add('pwa-standalone');
  }
}

createRoot(document.getElementById("root")!).render(<App />);

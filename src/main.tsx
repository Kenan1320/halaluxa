
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
}

createRoot(document.getElementById("root")!).render(<App />);

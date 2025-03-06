
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Optimize animation performance
if (typeof window !== 'undefined') {
  // Add hardware acceleration hint for smoother animations
  document.documentElement.style.setProperty('--webkit-transform', 'translate3d(0,0,0)');
}

createRoot(document.getElementById("root")!).render(<App />);

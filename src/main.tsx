
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/globals.css'
import SplashScreen from './components/SplashScreen.tsx'

const Root = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initialization time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return isLoading ? (
    <SplashScreen onComplete={() => setIsLoading(false)} />
  ) : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);

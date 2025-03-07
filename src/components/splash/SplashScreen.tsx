
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // If splash screen is done, continue to app
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#01BFB3] via-[#0E77D1] to-[#6A3DE8] w-full h-full"></div>
      <div className="relative z-10">
        <h1 className="text-white text-7xl font-serif font-semibold">Haluna</h1>
      </div>
      <div className="absolute bottom-8 w-48 h-1 bg-white rounded-full"></div>
    </div>
  );
};

export default SplashScreen;

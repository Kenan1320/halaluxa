
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BusinessSignupButton = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="relative inline-block"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Button 
        onClick={() => navigate('/business/signup')}
        className="bg-gradient-to-r from-haluna-primary to-emerald-600 hover:from-haluna-primary hover:to-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg text-white px-5 py-6 rounded-lg flex items-center gap-3"
      >
        <Store className="h-5 w-5" />
        <span className="font-medium">Sign up as a Business Owner</span>
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-white opacity-0"
          animate={{
            opacity: [0, 0.2, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </Button>
    </motion.div>
  );
}

export default BusinessSignupButton;

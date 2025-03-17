
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <Container className="min-h-[70vh] flex items-center justify-center">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center px-4"
      >
        {/* Animated 404 */}
        <motion.div
          className="mb-6 relative"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, 0, -2, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          }}
        >
          <motion.span
            className="text-8xl font-bold bg-gradient-to-r from-haluna-primary to-purple-500 text-transparent bg-clip-text"
            variants={itemVariants}
          >
            404
          </motion.span>
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-bold mb-2"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto"
          variants={itemVariants}
        >
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track!
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="rounded-full flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="rounded-full flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default NotFound;

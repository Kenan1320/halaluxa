
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { Container } from './container';

interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
}

export const ComingSoon = ({
  title,
  description = "We're working hard to bring you this feature soon. Stay tuned for updates!",
  icon,
  showHomeButton = true
}: ComingSoonProps) => {
  const navigate = useNavigate();
  
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
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { 
        delay: i * 0.2,
        duration: 0.5
      }
    }),
    hover: { 
      scale: 1.1,
      transition: { 
        duration: 0.3,
        yoyo: Infinity
      }
    }
  };
  
  const colors = [
    "bg-blue-100 dark:bg-blue-900/30",
    "bg-green-100 dark:bg-green-900/30",
    "bg-purple-100 dark:bg-purple-900/30",
    "bg-yellow-100 dark:bg-yellow-900/30",
    "bg-pink-100 dark:bg-pink-900/30"
  ];

  return (
    <Container className="py-10 md:py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center text-center"
      >
        {/* Floating bubbles effect */}
        <div className="relative mb-8 h-48 w-48">
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={bubbleVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className={`absolute rounded-full ${colors[i % colors.length]}`}
                style={{
                  width: `${40 + i * 10}px`,
                  height: `${40 + i * 10}px`,
                  top: `${Math.sin(i * 1.5) * 30 + 50}px`,
                  left: `${Math.cos(i * 1.5) * 30 + 50}px`,
                  zIndex: 5 - i
                }}
              />
            ))}
          </div>
          
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            animate={{ 
              y: [0, -10, 0], 
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5, 
              ease: "easeInOut" 
            }}
          >
            {icon || (
              <div className="h-20 w-20 bg-haluna-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold">
                {title.substring(0, 2)}
              </div>
            )}
          </motion.div>
        </div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-haluna-primary to-haluna-deepblue-light bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mb-8"
        >
          {description}
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          {showHomeButton && (
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="rounded-full"
            >
              Return to Home
            </Button>
          )}
          
          <Button
            onClick={() => window.history.back()}
            className="rounded-full"
          >
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
};

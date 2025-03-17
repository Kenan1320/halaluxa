
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Clock, Home } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  description?: string;
  showHomeButton?: boolean;
}

export function ComingSoon({ 
  title = "Coming Soon", 
  description = "We're working on something amazing!", 
  showHomeButton = true 
}: ComingSoonProps) {
  return (
    <Container className="py-16 text-center">
      <div className="relative mx-auto max-w-2xl">
        {/* Animated background bubbles */}
        <div className="absolute top-20 left-10 coming-soon-bubble w-20 h-20 bubble-animation-1"></div>
        <div className="absolute top-40 right-20 coming-soon-bubble w-32 h-32 bubble-animation-2"></div>
        <div className="absolute bottom-20 left-1/4 coming-soon-bubble w-24 h-24 bubble-animation-3"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <Clock className="mx-auto h-16 w-16 text-primary mb-4" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold tracking-tight mb-4"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8"
        >
          {description}
        </motion.p>
        
        {showHomeButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button to="/" size="lg">
              <Link to="/" className="inline-flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </Container>
  );
}


import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomersPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-haluna-text">Customers</h1>
        <p className="text-haluna-text-light">View and manage your customers</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-haluna-primary" />
              </div>
              
              {/* Animated particles */}
              <motion.div
                className="absolute top-0 right-0 h-6 w-6 bg-haluna-primary-light rounded-full"
                animate={{
                  y: [0, -20, -15, -25, 0],
                  x: [0, 15, 20, 25, 0],
                  opacity: [0, 1, 0.8, 0.2, 0],
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 h-4 w-4 bg-haluna-accent rounded-full"
                animate={{
                  y: [0, 15, 20, 10, 0],
                  x: [0, -10, -15, -20, 0],
                  opacity: [0, 0.7, 1, 0.2, 0],
                }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              />
            </div>
          </motion.div>
          
          <motion.h3 
            variants={itemVariants}
            className="text-xl font-medium mb-2"
          >
            Customers Coming Soon
          </motion.h3>
          
          <motion.p 
            variants={itemVariants}
            className="text-haluna-text-light max-w-md mx-auto"
          >
            We're building tools to help you manage your customer relationships effectively. 
            Soon you'll be able to view customer data, track purchase history, and manage 
            customer loyalty programs from here.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="mt-6 pt-6 border-t border-gray-100"
          >
            <div className="bg-blue-50 text-haluna-deepblue-dark rounded-lg p-4 text-sm inline-block">
              Check back soon for updates!
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomersPage;

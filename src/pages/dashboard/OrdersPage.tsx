
import { Package, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const OrdersPage = () => {
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

  const circleAnimation = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: custom * 0.2,
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    })
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-haluna-text">Orders</h1>
        <p className="text-haluna-text-light">Manage your customer orders</p>
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
              <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
                <Package className="h-10 w-10 text-haluna-primary" />
              </div>
              
              {/* Feature preview circles */}
              <motion.div 
                custom={1}
                variants={circleAnimation}
                initial="hidden"
                animate="visible"
                className="absolute top-6 right-0 transform translate-x-16"
              >
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <span className="block text-xs mt-1 text-gray-600">Tracking</span>
              </motion.div>
              
              <motion.div 
                custom={2}
                variants={circleAnimation}
                initial="hidden"
                animate="visible"
                className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-6"
              >
                <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-amber-500" />
                </div>
                <span className="block text-xs mt-1 text-gray-600">Analytics</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h3 
            variants={itemVariants}
            className="text-xl font-medium mb-2"
          >
            Order Management Coming Soon
          </motion.h3>
          
          <motion.p 
            variants={itemVariants}
            className="text-haluna-text-light max-w-md mx-auto"
          >
            We're building a powerful order management system that will help you process 
            orders efficiently, track shipments, and manage customer requests. Soon you'll 
            be able to handle your entire order lifecycle from here.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="mt-6 grid grid-cols-2 gap-3 max-w-xs mx-auto"
          >
            <div className="bg-green-50 rounded-lg p-3 text-green-800 text-sm">
              <div className="font-medium">Order Tracking</div>
              <div className="text-xs opacity-75">Real-time updates</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-purple-800 text-sm">
              <div className="font-medium">Notifications</div>
              <div className="text-xs opacity-75">SMS & Email alerts</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrdersPage;

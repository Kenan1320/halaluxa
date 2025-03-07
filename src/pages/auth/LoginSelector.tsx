
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Store } from 'lucide-react';

interface LoginSelectorProps {
  onSelect: (type: 'shopper' | 'business') => void;
  selectedType: 'shopper' | 'business' | null;
}

const LoginSelector = ({ onSelect, selectedType }: LoginSelectorProps) => {
  return (
    <div className="flex flex-col sm:flex-row w-full gap-4 mb-6">
      <motion.div
        className={`flex-1 border rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center ${
          selectedType === 'shopper' 
            ? 'border-[#01BFB3] bg-gradient-to-r from-[#01BFB3]/10 via-[#0E77D1]/10 to-[#6A3DE8]/10' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect('shopper')}
      >
        <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
          selectedType === 'shopper' 
            ? 'bg-haluna-gradient text-white' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          <ShoppingBag size={24} />
        </div>
        <h3 className="font-medium mb-2">Shopper</h3>
        <p className="text-sm text-center text-gray-600">I want to shop and buy products</p>
      </motion.div>

      <motion.div
        className={`flex-1 border rounded-xl p-6 cursor-pointer flex flex-col items-center justify-center ${
          selectedType === 'business' 
            ? 'border-[#01BFB3] bg-gradient-to-r from-[#01BFB3]/10 via-[#0E77D1]/10 to-[#6A3DE8]/10' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect('business')}
      >
        <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
          selectedType === 'business' 
            ? 'bg-haluna-gradient text-white' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          <Store size={24} />
        </div>
        <h3 className="font-medium mb-2">Business Owner</h3>
        <p className="text-sm text-center text-gray-600">I want to sell products</p>
      </motion.div>
    </div>
  );
};

export default LoginSelector;

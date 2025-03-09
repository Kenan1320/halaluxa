
import React from 'react';
import { PaymentMethodType } from '@/models/payment';

interface PaymentMethodIconsProps {
  methods?: PaymentMethodType[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PaymentMethodIcons: React.FC<PaymentMethodIconsProps> = ({ 
  methods = ['bank', 'paypal', 'stripe', 'applepay'], 
  size = 'md',
  className = ''
}) => {
  const getSize = () => {
    switch(size) {
      case 'sm': return 'h-6';
      case 'lg': return 'h-10';
      default: return 'h-8';
    }
  };
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {methods.includes('bank') && (
        <div className="text-gray-500 font-semibold">Bank Transfer</div>
      )}
      
      {methods.includes('paypal') && (
        <img 
          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
          alt="PayPal" 
          className={getSize()} 
        />
      )}
      
      {methods.includes('stripe') && (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
          alt="Stripe" 
          className={getSize()} 
        />
      )}
      
      {methods.includes('applepay') && (
        <img 
          src="https://developer.apple.com/assets/elements/icons/apple-pay/apple-pay.svg" 
          alt="Apple Pay" 
          className={getSize()} 
        />
      )}
    </div>
  );
};

export default PaymentMethodIcons;

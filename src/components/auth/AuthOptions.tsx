
import { useState } from 'react';
import { ShoppingBag, Store, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

interface AuthOptionsProps {
  onRoleSelect: (role: 'shopper' | 'seller') => void;
}

const AuthOptions = ({ onRoleSelect }: AuthOptionsProps) => {
  const [selectedRole, setSelectedRole] = useState<'shopper' | 'seller' | null>(null);
  
  const handleRoleSelection = (role: 'shopper' | 'seller') => {
    setSelectedRole(role);
  };
  
  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-haluna-secondary p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 animate-scale-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-haluna-text mb-3">Welcome to Haluna</h2>
          <p className="text-haluna-text-light">Please select your role to continue</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={() => handleRoleSelection('shopper')}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center ${
              selectedRole === 'shopper'
                ? 'border-haluna-primary bg-haluna-primary-light'
                : 'border-gray-200 hover:border-haluna-primary/30'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
              selectedRole === 'shopper' ? 'bg-haluna-primary text-white' : 'bg-gray-100 text-haluna-text'
            }`}>
              <ShoppingBag size={24} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-medium text-lg">I'm a Shopper</h3>
              <p className="text-sm text-haluna-text-light">I want to browse and purchase products</p>
            </div>
            {selectedRole === 'shopper' && (
              <div className="ml-2">
                <div className="w-6 h-6 rounded-full bg-haluna-primary text-white flex items-center justify-center">
                  <ChevronRight size={16} />
                </div>
              </div>
            )}
          </button>
          
          <button
            onClick={() => handleRoleSelection('seller')}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center ${
              selectedRole === 'seller'
                ? 'border-haluna-primary bg-haluna-primary-light'
                : 'border-gray-200 hover:border-haluna-primary/30'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
              selectedRole === 'seller' ? 'bg-haluna-primary text-white' : 'bg-gray-100 text-haluna-text'
            }`}>
              <Store size={24} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-medium text-lg">I'm a Business</h3>
              <p className="text-sm text-haluna-text-light">I want to sell my products</p>
            </div>
            {selectedRole === 'seller' && (
              <div className="ml-2">
                <div className="w-6 h-6 rounded-full bg-haluna-primary text-white flex items-center justify-center">
                  <ChevronRight size={16} />
                </div>
              </div>
            )}
          </button>
        </div>
        
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AuthOptions;


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Store } from 'lucide-react';

type UserRole = 'shopper' | 'business';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Here we would integrate with authentication provider
      // For now, we'll simulate a successful sign up
      
      // Store user info in localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        role: selectedRole,
        id: Math.random().toString(36).substr(2, 9)
      }));
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      
      // Redirect based on role
      if (selectedRole === 'business') {
        navigate('/dashboard');
      } else {
        navigate('/shop');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-haluna-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-serif font-bold text-haluna-text">Create an Account</h1>
          <p className="text-haluna-text-light mt-2">Join Haluna's halal marketplace</p>
        </div>
        
        {!selectedRole ? (
          <div className="space-y-4 mb-6">
            <p className="text-sm text-center text-haluna-text-light mb-4">I want to join as:</p>
            
            <button
              onClick={() => handleRoleSelect('shopper')}
              className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-haluna-primary/30 transition-all flex items-center"
              type="button"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 text-haluna-text flex items-center justify-center mr-4">
                <ShoppingBag size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-lg">Shopper</h3>
                <p className="text-sm text-haluna-text-light">I want to browse and purchase products</p>
              </div>
            </button>
            
            <button
              onClick={() => handleRoleSelect('business')}
              className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-haluna-primary/30 transition-all flex items-center"
              type="button"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 text-haluna-text flex items-center justify-center mr-4">
                <Store size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-lg">Business Owner</h3>
                <p className="text-sm text-haluna-text-light">I want to sell my products</p>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-haluna-primary-light text-haluna-primary p-3 rounded-lg text-sm mb-4 flex items-center">
              {selectedRole === 'business' ? (
                <Store className="h-5 w-5 mr-2" />
              ) : (
                <ShoppingBag className="h-5 w-5 mr-2" />
              )}
              <span>
                Signing up as a {selectedRole === 'business' ? 'Business Owner' : 'Shopper'} 
                <button 
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="underline ml-2 focus:outline-none"
                >
                  Change
                </button>
              </span>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-haluna-text mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-haluna-text mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-haluna-text mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-haluna-text mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        )}
        
        <p className="text-center mt-6 text-haluna-text-light">
          Already have an account?{' '}
          <Link to="/login" className="text-haluna-primary font-medium hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

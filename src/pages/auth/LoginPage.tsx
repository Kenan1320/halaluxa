
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Get the intended destination, if any
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        
        // Navigate to the intended destination or role-specific page
        navigate(from === '/' ? (success === 'business' ? '/dashboard' : '/shop') : from);
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-haluna-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <Link to="/" className="inline-flex items-center text-haluna-text-light hover:text-haluna-primary mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-serif font-bold text-haluna-text">Welcome Back</h1>
          <p className="text-haluna-text-light mt-2">Log in to your Haluna account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-haluna-primary border-haluna-text-light rounded focus:ring-haluna-primary focus:ring-1"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-haluna-text">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-haluna-primary hover:underline">
              Forgot password?
            </a>
          </div>
          
          <Button type="submit" className="w-full flex items-center justify-center" disabled={loading}>
            {loading ? 'Logging in...' : (
              <>
                <LogIn size={18} className="mr-2" />
                Log In
              </>
            )}
          </Button>
        </form>
        
        <p className="text-center mt-6 text-haluna-text-light">
          Don't have an account?{' '}
          <Link to="/signup" className="text-haluna-primary font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

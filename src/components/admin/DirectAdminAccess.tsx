
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Key, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const DirectAdminAccess = ({ variant = 'default', size = 'default', className = '' }) => {
  const navigate = useNavigate();

  const accessAdminPanel = () => {
    // Direct access without authentication in development mode
    if (import.meta.env.DEV) {
      navigate('/admin');
      toast({
        title: "Admin Access Granted",
        description: "You now have access to the admin dashboard.",
      });
    } else {
      toast({
        title: "Admin Access",
        description: "In production, authentication is required.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={accessAdminPanel} 
      variant={variant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"} 
      size={size as "default" | "sm" | "lg" | "icon"}
      className={`relative ${className}`}
    >
      <Shield className="h-4 w-4 mr-2" />
      <span>Admin Access</span>
      {!import.meta.env.DEV && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Lock className="h-3 w-3" />
        </div>
      )}
    </Button>
  );
};

export const AdminAccessCode = () => {
  const code = "DEV-ADMIN-1234";
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mt-2 text-center">
      <p className="text-sm text-muted-foreground mb-2">Dev Mode Admin Access Code:</p>
      <code className="bg-black text-white px-3 py-1 rounded font-mono">{code}</code>
      <p className="text-xs text-muted-foreground mt-2">
        This code is for development purposes only.
      </p>
    </div>
  );
};

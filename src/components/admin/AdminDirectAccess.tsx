
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Key, Lock, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AdminAccessCode } from './DirectAdminAccess';

const AdminDirectAccess = () => {
  const navigate = useNavigate();
  const [showAccessCode, setShowAccessCode] = useState(false);

  const accessAdminPanel = () => {
    // In development mode, allow direct access
    if (import.meta.env.DEV) {
      navigate('/admin');
      toast({
        title: "Admin Access Granted",
        description: "You now have direct access to the admin dashboard.",
      });
    } else {
      toast({
        title: "Admin Access Restricted",
        description: "In production, proper authentication is required.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-dashed border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/10">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Dashboard Access
            </CardTitle>
            <CardDescription className="text-orange-100 mt-1">
              Direct admin access in development mode
            </CardDescription>
          </div>
          <Shield className="h-8 w-8 text-orange-100" />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-1">One-Click Admin Access</h3>
              <p className="text-sm text-muted-foreground">
                Bypass authentication in development mode for immediate access to the admin dashboard
              </p>
            </div>
            <Button 
              onClick={accessAdminPanel}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Access Admin
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-1">Admin Access Code</h3>
              <p className="text-sm text-muted-foreground">
                Use this code for admin authentication if needed
              </p>
            </div>
            <Button
              variant="outline" 
              onClick={() => setShowAccessCode(!showAccessCode)}
              className="flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              {showAccessCode ? "Hide Code" : "Show Code"}
            </Button>
          </div>
          
          {showAccessCode && <AdminAccessCode />}
        </div>
      </CardContent>
      
      <CardFooter className="bg-orange-100/50 dark:bg-orange-950/20 px-6 py-3">
        <div className="flex items-center text-xs text-muted-foreground">
          <Lock className="h-3 w-3 mr-1" />
          For development purposes only. Proper authentication is required in production.
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdminDirectAccess;

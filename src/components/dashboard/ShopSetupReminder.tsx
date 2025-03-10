
import React, { useState } from 'react';
import { Store, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShopSetupReminderProps {
  userName: string;
}

const ShopSetupReminder: React.FC<ShopSetupReminderProps> = ({ userName }) => {
  const [dismissed, setDismissed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  if (dismissed) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm mb-6 p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
            <Store className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">Welcome to Haluna, {userName}!</h3>
              <button 
                onClick={() => setDismissed(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="mt-1 text-gray-600">
              Your business account is ready! Would you like to set up your shop details now?
            </p>
            
            <div className="mt-4 flex space-x-3">
              <Button 
                onClick={() => navigate('/dashboard/settings')}
              >
                Create My Shop
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDialog(true)}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Setting up your shop</DialogTitle>
            <DialogDescription>
              Creating your shop profile is the first step to selling on Haluna.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="font-medium mb-2">Here's what you need:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Shop name and description</li>
              <li>Shop category</li>
              <li>Shop location</li>
              <li>Logo and cover image (optional)</li>
            </ul>
            
            <p className="mt-4 text-sm text-gray-600">
              You can update these details anytime from your dashboard settings.
            </p>
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => {
                setShowDialog(false);
                navigate('/dashboard/settings');
              }}
            >
              Set Up My Shop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShopSetupReminder;

import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";

const UserProfilePage = () => {
  const { updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await updateUserProfile(profile);
      
      if (success === true) {
        toast({
          title: 'Profile updated',
          description: 'Your profile information has been updated successfully.',
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Update the handleProfileSubmit method to check the boolean return value properly

const handleProfileSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const success = await updateUserProfile(profile);
    
    if (success === true) {
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } else {
      throw new Error('Failed to update profile');
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update profile. Please try again.',
      variant: 'destructive',
    });
  }
};
};

export default UserProfilePage;

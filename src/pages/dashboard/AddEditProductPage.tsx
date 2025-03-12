import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { listCategories } from '@/services/categoryService';

const AddEditProductPage = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await listCategories();
        // Ensure we're getting an array of strings
        const categoryNames: string[] = Array.isArray(categoryList) 
          ? categoryList.map(cat => typeof cat === 'string' ? cat : cat.name || cat.toString())
          : [];
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories.",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, [toast]);

  return (
    <div>
      {/* Add your component's JSX here */}
    </div>
  );
};

export default AddEditProductPage;


// Update the useEffect that fetches categories to handle string[] properly

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

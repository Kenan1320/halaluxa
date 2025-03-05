
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, CheckCircle } from 'lucide-react';

const AddEditProductPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    isHalalCertified: true
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    console.log('Image:', imagePreview);
    
    toast({
      title: "Success",
      description: "Product added successfully",
    });
    
    // Navigate back to products page
    navigate('/dashboard/products');
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-haluna-text">Add New Product</h1>
        <p className="text-haluna-text-light">Create a new product listing for your store</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-haluna-text mb-1">
              Product Name *
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
            <label htmlFor="category" className="block text-sm font-medium text-haluna-text mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
              required
            >
              <option value="">Select a category</option>
              <option value="Food">Food</option>
              <option value="Clothing">Clothing</option>
              <option value="Beauty">Beauty</option>
              <option value="Home">Home</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-haluna-text mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-haluna-text mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
              min="0"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-haluna-text mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-haluna-text mb-3">
              Product Image
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-haluna-text-light mx-auto mb-2" />
                  <p className="text-haluna-text mb-2">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-haluna-text-light mb-4">
                    Recommended: Square JPG or PNG, 1000x1000px or larger
                  </p>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  className="w-full max-h-60 object-contain border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  <X className="h-5 w-5 text-red-500" />
                </button>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isHalalCertified"
                name="isHalalCertified"
                checked={formData.isHalalCertified}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-haluna-primary border-haluna-text-light rounded focus:ring-haluna-primary focus:ring-1"
              />
              <label htmlFor="isHalalCertified" className="flex items-center text-sm font-medium text-haluna-text">
                <CheckCircle className="h-4 w-4 text-haluna-primary mr-1" />
                This product is Halal certified
              </label>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/products')}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProductPage;

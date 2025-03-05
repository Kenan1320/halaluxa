
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, CheckCircle, Plus, Image as ImageIcon } from 'lucide-react';
import { productCategories } from '@/models/product';

const AddEditProductPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    isHalalCertified: true,
    details: {} as Record<string, string>
  });
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [detailFields, setDetailFields] = useState<{key: string, value: string}[]>([
    { key: '', value: '' }
  ]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPreviews: string[] = [];
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleDetailChange = (index: number, field: 'key' | 'value', value: string) => {
    const newDetails = [...detailFields];
    newDetails[index][field] = value;
    setDetailFields(newDetails);
    
    // Update formData.details
    const details: Record<string, string> = {};
    newDetails.forEach(detail => {
      if (detail.key && detail.value) {
        details[detail.key] = detail.value;
      }
    });
    
    setFormData(prev => ({ ...prev, details }));
  };
  
  const addDetailField = () => {
    setDetailFields(prev => [...prev, { key: '', value: '' }]);
  };
  
  const removeDetailField = (index: number) => {
    const newDetails = detailFields.filter((_, i) => i !== index);
    setDetailFields(newDetails);
    
    // Update formData.details
    const details: Record<string, string> = {};
    newDetails.forEach(detail => {
      if (detail.key && detail.value) {
        details[detail.key] = detail.value;
      }
    });
    
    setFormData(prev => ({ ...prev, details }));
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
    
    if (imagePreviews.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one product image",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    console.log('Images:', imagePreviews);
    console.log('Details:', detailFields);
    
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
              {productCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
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
              Product Images *
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden border h-32">
                  <img 
                    src={preview} 
                    alt={`Product preview ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex flex-col items-center justify-center text-center">
                <ImageIcon className="h-8 w-8 text-haluna-text-light mb-2" />
                <p className="text-sm text-haluna-text-light mb-2">Add more images</p>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('images')?.click()}
                >
                  Browse
                </Button>
              </div>
            </div>
            
            {imagePreviews.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-haluna-text-light mx-auto mb-2" />
                  <p className="text-haluna-text mb-2">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-haluna-text-light mb-4">
                    Recommended: Square JPG or PNG, 1000x1000px or larger
                  </p>
                  <input
                    type="file"
                    id="initial-images"
                    name="initial-images"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('initial-images')?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-haluna-text mb-3">
              Product Details
            </label>
            
            {detailFields.map((detail, index) => (
              <div key={index} className="flex gap-4 items-start mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Property (e.g., Weight, Size)"
                    value={detail.key}
                    onChange={(e) => handleDetailChange(index, 'key', e.target.value)}
                    className="w-full border rounded-lg p-2.5 mb-2 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Value (e.g., 1kg, Medium)"
                    value={detail.value}
                    onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
                    className="w-full border rounded-lg p-2.5 mb-2 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDetailField(index)}
                  className="mt-2 p-1 text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDetailField}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Detail
            </Button>
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

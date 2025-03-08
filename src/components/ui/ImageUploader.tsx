
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadProductImage } from '@/services/shopService';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  initialImage?: string;
  className?: string;
}

// For multiple images
interface MultipleImagesUploaderProps {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  initialImage,
  className = '',
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Call the uploadProductImage function with just the file parameter
      const url = await uploadProductImage(file);
      if (url) {
        setImage(url);
        onImageUpload(url);
        toast({
          title: 'Image uploaded',
          description: 'Your image has been uploaded successfully.',
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was a problem uploading your image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      {image ? (
        <div className="relative">
          <img 
            src={image} 
            alt="Uploaded" 
            className="w-full h-full object-cover" 
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      ) : (
        <div className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
          <ImageIcon className="h-10 w-10 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500 mb-4">Upload an image</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="image-uploader"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-sm"
          >
            {isUploading ? (
              'Uploading...'
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export const MultipleImagesUploader: React.FC<MultipleImagesUploaderProps> = ({
  onImagesChange,
  initialImages = [],
  className = ''
}) => {
  const [images, setImages] = useState<string[]>(initialImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadProductImage(file);
      if (url) {
        const newImages = [...images, url];
        setImages(newImages);
        onImagesChange(newImages);
        toast({
          title: 'Image uploaded',
          description: 'Your image has been uploaded successfully.',
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'There was a problem uploading your image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {images.map((img, index) => (
          <div key={index} className="relative border rounded-md overflow-hidden aspect-square">
            <img 
              src={img} 
              alt={`Product ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        ))}
        
        {/* Add image button */}
        <div 
          className="border border-dashed rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50 transition-colors aspect-square"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus className="h-10 w-10 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">{isUploading ? 'Uploading...' : 'Add Image'}</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

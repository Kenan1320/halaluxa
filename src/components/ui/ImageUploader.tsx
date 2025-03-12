
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, Image } from 'lucide-react';

export interface ImageUploaderProps {
  value?: string[];
  onChange: (newImages: string[]) => void;
  maxFiles?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  value = [], 
  onChange, 
  maxFiles = 5 
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Don't exceed maxFiles
    const filesToUpload = acceptedFiles.slice(0, maxFiles - value.length);
    if (filesToUpload.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Mock upload - in a real app, this would upload to your storage
      const newImageUrls = filesToUpload.map(file => URL.createObjectURL(file));
      
      // Update the parent component with the new images
      onChange([...value, ...newImageUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange, maxFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles || isUploading,
  });
  
  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };
  
  return (
    <div className="space-y-4">
      {/* Image preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((imageUrl, index) => (
            <div 
              key={index} 
              className="relative group aspect-square border rounded-md overflow-hidden"
            >
              <img 
                src={imageUrl} 
                alt={`Product image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload dropzone */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 dark:border-gray-700'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center space-y-2">
            {isDragActive ? (
              <>
                <Image className="w-10 h-10 text-primary" />
                <p>Drop your images here</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400" />
                <p>Drag & drop images here, or click to select</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {value.length > 0 
                    ? `You can add ${maxFiles - value.length} more image${maxFiles - value.length !== 1 ? 's' : ''}`
                    : `You can add up to ${maxFiles} images`
                  }
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

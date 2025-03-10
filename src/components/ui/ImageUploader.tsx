
import React, { useState, useEffect } from 'react';
import { Upload, X, Image, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadProductImage } from '@/services/shopService';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  initialImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImages = [],
  onImagesChange,
  maxImages = 5,
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [failedUploads, setFailedUploads] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can upload a maximum of ${maxImages} images`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setFailedUploads([]);

    const newImages: string[] = [...images];
    let failedFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Maximum size is 5MB.`,
          variant: "destructive"
        });
        failedFiles.push(file);
        continue;
      }
      
      try {
        setUploadProgress(Math.floor(i / files.length * 50));
        
        const imageUrl = await uploadProductImage(file);
        
        if (imageUrl) {
          newImages.push(imageUrl);
        } else {
          failedFiles.push(file);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        failedFiles.push(file);
        toast({
          title: "Upload error",
          description: `Error uploading ${file.name}`,
          variant: "destructive"
        });
      }
    }

    setImages(newImages);
    onImagesChange(newImages);
    setIsUploading(false);
    setUploadProgress(100);
    setFailedUploads(failedFiles);
    
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
  };
  
  const retryFailedUploads = async () => {
    if (failedUploads.length === 0) return;
    
    const dataTransfer = new DataTransfer();
    failedUploads.forEach(file => dataTransfer.items.add(file));
    
    const event = {
      target: {
        files: dataTransfer.files,
        value: ""
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    setFailedUploads([]);
    await handleUpload(event);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative w-24 h-24 border rounded-md overflow-hidden group"
          >
            <img 
              src={image}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(index)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {isUploading && (
          <div className="w-24 h-24 border border-dashed rounded-md flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-haluna-primary animate-spin" />
            <span className="text-xs mt-1">{uploadProgress}%</span>
          </div>
        )}
        
        {failedUploads.length > 0 && (
          <div 
            className="w-24 h-24 border border-dashed border-red-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
            onClick={retryFailedUploads}
          >
            <RefreshCw className="h-6 w-6 text-red-500 mb-1" />
            <span className="text-xs text-red-500">Retry {failedUploads.length} failed</span>
          </div>
        )}
        
        {images.length < maxImages && !isUploading && (
          <label className="w-24 h-24 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="h-8 w-8 text-haluna-text-light" />
            <span className="text-xs text-haluna-text-light mt-1">Upload</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
      
      {images.length === 0 && (
        <div className="text-sm text-haluna-text-light flex items-center">
          <Image className="h-4 w-4 mr-2" />
          Upload product images (max {maxImages})
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

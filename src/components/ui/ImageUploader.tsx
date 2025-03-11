
import React, { useState, useCallback } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  initialImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImages = [],
  onImagesChange,
  maxImages = 5
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Mock file upload function
  const uploadFile = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would call an API to upload the file
    return URL.createObjectURL(file);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      if (images.length + acceptedFiles.length > maxImages) {
        toast({
          title: "Too many images",
          description: `You can only upload a maximum of ${maxImages} images.`,
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      
      const uploadPromises = acceptedFiles.map(async (file) => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: "Please upload only image files.",
            variant: "destructive",
          });
          return null;
        }
        
        try {
          // Use our uploadFile function instead of the missing uploadProductImage
          return await uploadFile(file);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Upload failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          return null;
        }
      });
      
      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      const newImages = [...images, ...uploadedUrls];
      
      setImages(newImages);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error handling file upload:', error);
      toast({
        title: "Upload error",
        description: "An error occurred while uploading images.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [images, maxImages, onImagesChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    disabled: isUploading || images.length >= maxImages
  });

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        } ${isUploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Drop the images here..."
            : `Drag & drop images here, or click to select`}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {images.length} of {maxImages} images
        </p>
        {isUploading && <p className="text-xs text-primary mt-2">Uploading...</p>}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

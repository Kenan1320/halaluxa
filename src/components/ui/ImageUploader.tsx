
import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

// Mock function for image upload (to be implemented with actual upload service)
const uploadProductImage = async (file: File, onProgress?: (event: any) => void): Promise<string> => {
  // Simulate upload progress
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress({ lengthComputable: true, loaded: progress, total: 100 });
      if (progress >= 100) {
        clearInterval(interval);
        // Return a fake URL - in production this would be the actual uploaded image URL
        resolve(URL.createObjectURL(file));
      }
    }, 100);
  });
};

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
  onImagesChange?: (urls: string[]) => void; // Added for compatibility
  maxImages?: number;
  initialImages?: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesUploaded,
  onImagesChange,
  maxImages = 5,
  initialImages = [],
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding these files would exceed maxImages
    if (images.length + files.length > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    setUploading(true);
    setProgress(0);
    
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Set progress based on current file index
        const currentProgress = Math.round(((i) / files.length) * 100);
        setProgress(currentProgress);
        
        // Upload the file
        const uploadedUrl = await uploadProductImage(file, (progressEvent: any) => {
          if (progressEvent.lengthComputable) {
            const fileProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            const overallProgress = Math.round(((i + (fileProgress / 100)) / files.length) * 100);
            setProgress(overallProgress);
          }
        });
        
        uploadedUrls.push(uploadedUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    
    setProgress(100);
    
    // Update state with new images
    const updatedImages = [...images, ...uploadedUrls];
    setImages(updatedImages);
    onImagesUploaded(updatedImages);
    if (onImagesChange) onImagesChange(updatedImages); // Support both prop names
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Reset upload state after brief delay to show 100% progress
    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 500);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesUploaded(updatedImages);
    if (onImagesChange) onImagesChange(updatedImages); // Support both prop names
  };

  return (
    <div className="space-y-4">
      {/* Image upload button */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={handleClickUpload}
          variant="outline"
          disabled={uploading || images.length >= maxImages}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Images
        </Button>
        <span className="text-sm text-muted-foreground">
          {images.length} of {maxImages} images
        </span>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
        </div>
      )}

      {/* Image preview grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {images.map((image, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover rounded-md border border-border"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Empty slots */}
        {images.length < maxImages &&
          Array.from({ length: maxImages - images.length }).map((_, index) => (
            <button
              key={`empty-${index}`}
              type="button"
              onClick={handleClickUpload}
              disabled={uploading}
              className="aspect-square border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">Add Image</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default ImageUploader;

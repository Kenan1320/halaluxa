
/**
 * Uploads a product image and returns the URL
 */
export const uploadProductImage = async (file: File, onProgress?: (event: any) => void): Promise<string> => {
  // Mock implementation
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress({ lengthComputable: true, loaded: progress, total: 100 });
      if (progress >= 100) {
        clearInterval(interval);
        resolve(URL.createObjectURL(file));
      }
    }, 100);
  });
};

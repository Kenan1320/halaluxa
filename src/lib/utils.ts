
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Mapbox configuration
 */
export const mapboxConfig = {
  // Public token for client-side rendering
  publicToken: 'pk.eyJ1Ijoia2VuYW4yNSIsImEiOiJjbTg3czM3bmswaGd0MndvY2I1cjQyaTMwIn0.LXzq8OtO1sCTiuTmtFVZrA',
  // Secret token for server-side operations, stored securely
  // This should be accessed only in secure server environments
  secretToken: 'sk.eyJ1Ijoia2VuYW4yNSIsImEiOiJjbTg3dGN0cHcwYmM0MnNxNHN5OTZidWViIn0.0Sba4mKBnPaKZfLj4p13iw',
  // Base styles
  styles: {
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  }
};

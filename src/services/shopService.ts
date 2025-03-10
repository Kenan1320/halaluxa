
// This file serves as a central export point for backward compatibility

// Import and re-export from the new modular files
import { 
  fetchAllShops, 
  fetchNearbyShops, 
  getShopById, 
  getMainShop, 
  saveMainShop,
  getShops,
  getAllShops,
  setMainShop
} from './shops/shopOperations';

import { getShopProducts } from './products/productOperations';
import { uploadProductImage } from './utils/fileUpload';

// Export everything to maintain backward compatibility
export {
  fetchAllShops,
  fetchNearbyShops,
  getShopById,
  getShopProducts,
  getMainShop,
  saveMainShop,
  uploadProductImage,
  getShops,
  getAllShops,
  setMainShop
};

// Default export for backward compatibility
export default {
  fetchAllShops,
  fetchNearbyShops,
  getShopById,
  getShopProducts,
  getMainShop,
  saveMainShop
};

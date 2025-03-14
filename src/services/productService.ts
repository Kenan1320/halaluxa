import { Product as ModelProduct } from '@/models/product';
import { Product } from '@/types/database';

// Mock data - replace with actual API calls later
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Dates",
    description: "Finest quality dates, perfect for Ramadan.",
    price: 15.99,
    shop_id: "101",
    category: "Groceries",
    images: ["/lovable-uploads/8028e660-8690-4cb9-a7d3-0eb169394591.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: true,
    in_stock: true,
    details: {
      origin: "Saudi Arabia",
      weight: "500g"
    },
    long_description: "These premium dates are hand-picked and perfect for breaking your fast during Ramadan.",
    is_published: true,
    stock: 50,
    seller_id: "user_123"
  },
  {
    id: "2",
    name: "Organic Honey",
    description: "Pure and natural honey from local farms.",
    price: 22.50,
    shop_id: "102",
    category: "Groceries",
    images: ["/lovable-uploads/f052daba-ba6b-4375-9602-6e077f496a21.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: true,
    in_stock: true,
    details: {
      origin: "Qatar",
      volume: "750ml"
    },
    long_description: "Our organic honey is sourced from local farms, ensuring purity and natural goodness.",
    is_published: true,
    stock: 30,
    seller_id: "user_234"
  },
  {
    id: "3",
    name: "Prayer Rug",
    description: "Comfortable and beautifully designed prayer rug.",
    price: 35.00,
    shop_id: "103",
    category: "Home",
    images: ["/lovable-uploads/8028e660-8690-4cb9-a7d3-0eb169394591.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: false,
    in_stock: true,
    details: {
      material: "Cotton",
      size: "120x80 cm"
    },
    long_description: "This prayer rug is designed for comfort and features a beautiful Islamic pattern.",
    is_published: true,
    stock: 40,
    seller_id: "user_345"
  },
  {
    id: "4",
    name: "Islamic Art Canvas",
    description: "Elegant canvas print with Islamic calligraphy.",
    price: 45.00,
    shop_id: "104",
    category: "Home",
    images: ["/lovable-uploads/f052daba-ba6b-4375-9602-6e077f496a21.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: false,
    in_stock: true,
    details: {
      material: "Canvas",
      size: "60x40 cm"
    },
    long_description: "Enhance your home decor with this elegant canvas print featuring Islamic calligraphy.",
    is_published: true,
    stock: 25,
    seller_id: "user_456"
  },
  {
    id: "5",
    name: "Eid Mubarak Card",
    description: "Beautiful greeting card for Eid celebrations.",
    price: 5.00,
    shop_id: "101",
    category: "Gifts",
    images: ["/lovable-uploads/8028e660-8690-4cb9-a7d3-0eb169394591.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: false,
    in_stock: true,
    details: {
      occasion: "Eid",
      type: "Greeting Card"
    },
    long_description: "Send your warm wishes with this beautifully designed Eid Mubarak greeting card.",
    is_published: true,
    stock: 100,
    seller_id: "user_123"
  },
  {
    id: "6",
    name: "Halal Chocolate Box",
    description: "Delicious assortment of halal-certified chocolates.",
    price: 29.99,
    shop_id: "102",
    category: "Gifts",
    images: ["/lovable-uploads/f052daba-ba6b-4375-9602-6e077f496a21.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: true,
    in_stock: true,
    details: {
      type: "Chocolate",
      weight: "300g"
    },
    long_description: "Indulge in this delicious assortment of halal-certified chocolates, perfect for gifting.",
    is_published: true,
    stock: 35,
    seller_id: "user_234"
  },
  {
    id: "7",
    name: "Men's Thobe",
    description: "Traditional men's thobe, perfect for daily wear.",
    price: 79.99,
    shop_id: "105",
    category: "Clothing",
    images: ["/lovable-uploads/8028e660-8690-4cb9-a7d3-0eb169394591.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: false,
    in_stock: true,
    details: {
      material: "Cotton",
      size: "Large"
    },
    long_description: "This traditional men's thobe is made from high-quality cotton, perfect for daily wear.",
    is_published: true,
    stock: 60,
    seller_id: "user_567"
  },
  {
    id: "8",
    name: "Women's Abaya",
    description: "Elegant women's abaya, suitable for all occasions.",
    price: 89.99,
    shop_id: "106",
    category: "Clothing",
    images: ["/lovable-uploads/f052daba-ba6b-4375-9602-6e077f496a21.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: false,
    in_stock: true,
    details: {
      material: "Silk",
      size: "Medium"
    },
    long_description: "This elegant women's abaya is made from high-quality silk, suitable for all occasions.",
    is_published: true,
    stock: 45,
    seller_id: "user_678"
  },
  {
    id: "9",
    name: "Kids Islamic Storybook",
    description: "Engaging storybook for children with Islamic themes.",
    price: 12.50,
    shop_id: "103",
    category: "Books",
    images: ["/lovable-uploads/8028e660-8690-4cb9-a7d3-0eb169394591.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: false,
    in_stock: true,
    details: {
      age_group: "5-8 years",
      type: "Storybook"
    },
    long_description: "This engaging storybook introduces children to Islamic themes and values.",
    is_published: true,
    stock: 70,
    seller_id: "user_345"
  },
  {
    id: "10",
    name: "Quran with Translation",
    description: "High-quality Quran with clear translation.",
    price: 55.00,
    shop_id: "104",
    category: "Books",
    images: ["/lovable-uploads/f052daba-ba6b-4375-9602-6e077f496a21.png"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_halal_certified: false,
    in_stock: true,
    details: {
      language: "English",
      type: "Quran"
    },
    long_description: "This high-quality Quran comes with a clear and easy-to-understand translation.",
    is_published: true,
    stock: 55,
    seller_id: "user_456"
  }
];

type DbProduct = Product;

// Update the adaptDbProductToModelProduct function to properly handle in_stock
const adaptDbProductToModelProduct = (product: DbProduct): ModelProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    images: product.images || [],
    shopId: product.shop_id,
    shop_id: product.shop_id,
    created_at: product.created_at,
    updated_at: product.updated_at,
    isHalalCertified: product.is_halal_certified,
    is_halal_certified: product.is_halal_certified,
    inStock: product.in_stock ?? true,
    in_stock: product.in_stock ?? true,
    sellerId: product.seller_id,
    seller_id: product.seller_id,
    details: product.details || {},
    isPublished: product.is_published,
    is_published: product.is_published,
    longDescription: product.long_description || '',
    long_description: product.long_description || ''
  };
};

export const getFeaturedProducts = async (): Promise<ModelProduct[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.map(adaptDbProductToModelProduct);
};

export const getProductById = async (id: string): Promise<ModelProduct | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const product = mockProducts.find(p => p.id === id);
  return product ? adaptDbProductToModelProduct(product) : null;
};

export const getProductsByShopId = async (shopId: string): Promise<ModelProduct[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.filter(p => p.shop_id === shopId).map(adaptDbProductToModelProduct);
};

export const getProductsByCategory = async (category: string): Promise<ModelProduct[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.filter(p => p.category === category).map(adaptDbProductToModelProduct);
};

export const searchProducts = async (query: string): Promise<ModelProduct[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const searchTerm = query.toLowerCase();
  return mockProducts
    .filter(p => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm))
    .map(adaptDbProductToModelProduct);
};

// Ensure all functions properly include in_stock when creating/updating products
export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    // Ensure in_stock is included
    const productToCreate = {
      ...productData,
      in_stock: productData.in_stock ?? productData.inStock ?? true
    };
    
    // Mock implementation - replace with actual API call
    const newProduct: Product = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      name: productToCreate.name || 'New Product',
      description: productToCreate.description || '',
      price: productToCreate.price || 0,
      shop_id: productToCreate.shop_id || 'default_shop_id',
      category: productToCreate.category || 'General',
      images: productToCreate.images || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_halal_certified: productToCreate.is_halal_certified || false,
      in_stock: productToCreate.in_stock ?? true,
      details: productToCreate.details || {},
      long_description: productToCreate.long_description || '',
      is_published: productToCreate.is_published || false,
      stock: productToCreate.stock || 0,
      seller_id: productToCreate.seller_id || 'default_seller_id'
    };
    
    mockProducts.push(newProduct);
    
    const mockProduct = {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      category: newProduct.category,
      images: newProduct.images || [],
      shopId: newProduct.shop_id,
      shop_id: newProduct.shop_id,
      created_at: newProduct.created_at,
      updated_at: newProduct.updated_at,
      isHalalCertified: newProduct.is_halal_certified,
      is_halal_certified: newProduct.is_halal_certified,
      inStock: newProduct.in_stock ?? true,
      in_stock: newProduct.in_stock ?? true,
      sellerId: newProduct.seller_id,
      seller_id: newProduct.seller_id,
      details: newProduct.details || {},
      isPublished: newProduct.is_published,
      is_published: newProduct.is_published,
      longDescription: newProduct.long_description || '',
      long_description: newProduct.long_description || ''
    };
    
    return mockProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<ModelProduct | null> => {
  try {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.log(`Product with id ${id} not found`);
      return null;
    }
    
    // Ensure in_stock is included
    const productToUpdate = {
      ...productData,
      in_stock: productData.in_stock ?? productData.inStock ?? true
    };
    
    // Mock implementation - replace with actual API call
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...productToUpdate,
      updated_at: new Date().toISOString()
    };
    
    const updatedProduct = mockProducts[productIndex];
    
    const mockProduct = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      category: updatedProduct.category,
      images: updatedProduct.images || [],
      shopId: updatedProduct.shop_id,
      shop_id: updatedProduct.shop_id,
      created_at: updatedProduct.created_at,
      updated_at: updatedProduct.updated_at,
      isHalalCertified: updatedProduct.is_halal_certified,
      is_halal_certified: updatedProduct.is_halal_certified,
      inStock: updatedProduct.in_stock ?? true,
      in_stock: updatedProduct.in_stock ?? true,
      sellerId: updatedProduct.seller_id,
      seller_id: updatedProduct.seller_id,
      details: updatedProduct.details || {},
      isPublished: updatedProduct.is_published,
      is_published: updatedProduct.is_published,
      longDescription: updatedProduct.long_description || '',
      long_description: updatedProduct.long_description || ''
    };
    
    return mockProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.log(`Product with id ${id} not found`);
      return false;
    }
    
    // Mock implementation - replace with actual API call
    mockProducts.splice(productIndex, 1);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};


export interface ProductDetails {
  weight?: string;
  servings?: string;
  ingredients?: string;
  origin?: string;
  isShippingAvailable?: boolean;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory?: string;
  subSubcategory?: string;
  shopId: string;
  isHalalCertified: boolean;
  inStock?: boolean;
  createdAt: string;
  // Additional properties needed by components
  sellerId?: string;
  sellerName?: string;
  rating?: number;
  details?: ProductDetails;
  isShippingAvailable?: boolean;
  isLocalPickupAvailable?: boolean;
}

// Product categories with updated names to match the provided icons
export const productCategories = [
  "Groceries",
  "Restaurants",
  "Halal Meat",
  "Furniture",
  "Books",
  "Thobes",
  "Hijab",
  "Decorations",
  "Abaya",
  "Online Shops",
  "Gifts",
  "Arabic Calligraphy",
  "Muslim Therapists"
];

// Subcategories mapped to their parent categories
export const productSubcategories: Record<string, string[]> = {
  "Books": ["Islamic Books", "Educational Books"],
  "Furniture": ["Living Room Furniture", "Bedroom Furniture", "Kitchen Furniture", "Islamic-Themed Decor"],
  "Thobes": ["Men's Clothing", "Women's Clothing", "Children's Clothing", "Different Styles"],
  "Halal Meat": ["Beef", "Chicken", "Lamb", "Fish", "Other Meats"],
  "Groceries": [
    "Fresh Produce", 
    "Halal Meat Products", 
    "Dairy and Cheese", 
    "Bakery and Bread", 
    "Pantry Staples", 
    "Sweets and Desserts", 
    "Beverages", 
    "Canned and Preserved Goods", 
    "Nuts and Dried Fruits", 
    "Snacks and Ready-to-Eat", 
    "Personal Care"
  ],
  "Decorations": ["Ramadan Decor", "Eid Decor", "Prayer Area Items"],
  "Arabic Calligraphy": ["Quranic Verses", "Names", "Islamic Phrases"],
  "Gifts": ["Religious Artifacts", "Decorative Items", "Occasion Gifts"],
  "Restaurants": ["Fast Food", "Casual Dining", "Fine Dining", "Specific Cuisines"]
};

// Sub-subcategories for specific subcategories
export const productSubSubcategories: Record<string, Record<string, string[]>> = {
  "Furniture": {
    "Living Room Furniture": ["Sofas", "Chairs", "Tables"],
    "Bedroom Furniture": ["Beds", "Dressers", "Wardrobes"],
    "Kitchen Furniture": ["Tables", "Chairs", "Cabinets"],
    "Islamic-Themed Decor": ["Paintings", "Calligraphies", "Rugs", "Praying Mats and Areas"]
  },
  "Thobes": {
    "Men's Clothing": ["Thobes", "Kufis", "Dishdashas"],
    "Women's Clothing": ["Abayas", "Hijabs", "Niqabs", "Burqas"],
    "Children's Clothing": ["Boys' Clothing", "Girls' Clothing"],
    "Different Styles": ["Moroccan", "Turkish", "Indian"]
  },
  "Groceries": {
    "Fresh Produce": [
      "Dates", "Olives", "Pomegranates", "Figs", "Zucchini", "Okra", 
      "Eggplant", "Cucumbers", "Tomatoes", "Parsley", "Mint", "Coriander", "Dill"
    ],
    "Halal Meat Products": [
      "Beef", "Chicken", "Lamb", "Goat", "Camel", "Turkey", "Fish"
    ],
    "Dairy and Cheese": [
      "Camel Milk", "Goat Milk", "Sheep Milk", "Cow Milk", 
      "Sheep Cheese", "Labneh", "Yogurt", "Halal Butter and Ghee", "Cream"
    ]
  },
  "Restaurants": {
    "Specific Cuisines": ["Middle Eastern", "Turkish", "Indian"]
  }
};

// Function to get all subcategories flattened into an array
export const getAllSubcategories = (): string[] => {
  return Object.values(productSubcategories).flat();
};

// Function to get all sub-subcategories flattened into an array
export const getAllSubSubcategories = (): string[] => {
  const result: string[] = [];
  
  Object.values(productSubSubcategories).forEach(subcategoryMap => {
    Object.values(subcategoryMap).forEach(subSubcategories => {
      result.push(...subSubcategories);
    });
  });
  
  return result;
};

// Function to get the parent category of a subcategory
export const getParentCategory = (subcategory: string): string | null => {
  for (const [category, subcategories] of Object.entries(productSubcategories)) {
    if (subcategories.includes(subcategory)) {
      return category;
    }
  }
  return null;
};

// Function to get the parent subcategory of a sub-subcategory
export const getParentSubcategory = (subSubcategory: string): { category: string, subcategory: string } | null => {
  for (const [category, subcategoryMap] of Object.entries(productSubSubcategories)) {
    for (const [subcategory, subSubcategories] of Object.entries(subcategoryMap)) {
      if (subSubcategories.includes(subSubcategory)) {
        return { category, subcategory };
      }
    }
  }
  return null;
};

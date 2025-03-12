
export interface ProductDetails {
  weight?: string;
  servings?: string;
  ingredients?: string;
  origin?: string;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  shopId: string;
  isHalalCertified: boolean;
  inStock?: boolean;
  createdAt: string;
  // Additional properties needed by components
  sellerId?: string;
  sellerName?: string;
  rating?: number;
  details?: ProductDetails;
  subcategory?: string;
  subSubcategory?: string;
  availableForShipping?: boolean;
}

// Main product categories
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
  "Muslim Therapists",
  "Sweet Shops",
  "Jewelry Stores"
];

// Category to subcategories mapping
export const categorySubcategories: Record<string, string[]> = {
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
  "Restaurants": ["Fast Food", "Casual Dining", "Fine Dining", "Specific Cuisines"],
  "Sweet Shops": ["Chocolates", "Candies", "Traditional Desserts"],
  "Jewelry Stores": ["Rings", "Necklaces", "Bracelets", "Earrings", "Islamic-Themed Designs"]
};

// Subcategory to sub-subcategories mapping
export const subcategorySubSubcategories: Record<string, Record<string, string[]>> = {
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
      "Dates", "Olives", "Pomegranates", "Figs", "Zucchini", 
      "Okra", "Eggplant", "Cucumbers", "Tomatoes", "Parsley", 
      "Mint", "Coriander", "Dill"
    ],
    "Halal Meat Products": [
      "Beef", "Chicken", "Lamb", "Goat", "Camel", "Turkey", "Fish"
    ],
    "Dairy and Cheese": [
      "Camel Milk", "Goat Milk", "Sheep Milk", "Cow Milk",
      "Sheep Cheese", "Labneh", "Yogurt", "Halal Butter and Ghee", "Cream"
    ],
    "Bakery and Bread": [
      "Arabic Bread", "Samoon", "Markook", "Manakish",
      "Fatayer Dough", "Samboosa Wrappers", "Baklava Dough", "Croissants"
    ],
    "Pantry Staples": [
      "Basmati Rice", "Jasmine Rice", "Freekeh", "Bulgur",
      "Lentils", "Chickpeas", "Fava Beans", "Tahini",
      "Hummus", "Sumac", "Za'atar", "Cumin",
      "Coriander Powder", "Turmeric", "Saffron", "Rose Water",
      "Orange Blossom Water", "Vinegar", "Honey"
    ],
    "Sweets and Desserts": [
      "Halal Marshmallows", "Turkish Delight", "Halva",
      "Qatayef", "Kunafa", "Maamoul", "Basbousa"
    ],
    "Beverages": [
      "Arabic Coffee", "Herbal Teas", "Tamarind Juice Mix",
      "Jallab Syrup", "Barley Water", "Lemon Mint Drink Mix"
    ],
    "Canned and Preserved Goods": [
      "Pickled Turnips", "Pickled Cucumbers", "Stuffed Grape Leaves",
      "Hummus", "Foul Medames", "Molokhia", "Tomato Paste", "Olive Oil"
    ],
    "Nuts and Dried Fruits": [
      "Almonds", "Pistachios", "Walnuts", "Cashews",
      "Raisins", "Apricots", "Prunes"
    ],
    "Snacks and Ready-to-Eat": [
      "Halal Jerky", "Roasted Chickpeas", "Date Bars",
      "Samosas", "Spring Rolls"
    ],
    "Personal Care": [
      "Olive Oil Soap", "Argan Oil", "Henna",
      "Miswak Toothpaste", "Kohl", "Perfume Oils"
    ]
  },
  "Decorations": {
    "Ramadan Decor": ["Lanterns", "Crescent Moon Ornaments"],
    "Eid Decor": ["Gift Boxes", "Fairy Lights"],
    "Prayer Area Items": ["Prayer Rugs", "Qibla Compasses"]
  },
  "Restaurants": {
    "Specific Cuisines": ["Middle Eastern", "Turkish", "Indian"]
  },
  "Sweet Shops": {
    "Chocolates": ["Halal Dark Chocolate", "Filled Chocolates"],
    "Candies": ["Hard Candies", "Gummies"],
    "Traditional Desserts": ["Baklava", "Gulab Jamun", "Luqaimat"]
  }
};

// Helper function to check if a category is typically available nearby
export const isNearbyCategoryByDefault = (category: string): boolean => {
  const nearbyCategories = ["Groceries", "Restaurants", "Halal Meat", "Furniture", "Books"];
  return nearbyCategories.includes(category);
};

// Helper function to get all subcategories for a specific category
export const getAllSubcategories = (category: string): string[] => {
  return categorySubcategories[category] || [];
};

// Helper function to get all sub-subcategories for a specific subcategory
export const getAllSubSubcategories = (category: string, subcategory: string): string[] => {
  if (subcategorySubSubcategories[category] && 
      subcategorySubSubcategories[category][subcategory]) {
    return subcategorySubSubcategories[category][subcategory];
  }
  return [];
};


import { toast } from "sonner";

// Types for product data
export interface PrintfulProduct {
  id: number;
  name: string;
  thumbnail_url: string;
  variants: number;
  external_id: string;
  synced: number;
  is_ignored: boolean;
}

export interface PrintfulResponse {
  code: number;
  result: PrintfulProduct[];
  extra: any[];
  paging: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size?: string;
  color?: string;
  price: string;
  currency: string;
  retail_price: string; // Added this property to match the API response
  files: any[];
}

export interface PrintfulProductDetail {
  sync_product: {
    id: number;
    external_id: string;
    name: string;
    variants: number;
    synced: number;
    thumbnail_url: string;
    is_ignored: boolean;
    description?: string;
  };
  sync_variants: PrintfulVariant[];
}

// Dummy product data
const dummyProducts: PrintfulProduct[] = [
  {
    id: 1,
    external_id: 'pm-001',
    name: 'Peak Mode Unisex Hoodie',
    variants: 8,
    synced: 8,
    thumbnail_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_ignored: false
  },
  {
    id: 2,
    external_id: 'pm-002',
    name: 'Performance Tech Tee',
    variants: 6,
    synced: 6,
    thumbnail_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_ignored: false
  },
  {
    id: 3,
    external_id: 'pm-003',
    name: 'Compression Leggings',
    variants: 4,
    synced: 4,
    thumbnail_url: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_ignored: false
  },
  {
    id: 4,
    external_id: 'pm-004',
    name: 'All-over Print Rash Guard',
    variants: 11,
    synced: 11,
    thumbnail_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_ignored: false
  },
  {
    id: 5,
    external_id: 'pm-005',
    name: 'Performance Joggers',
    variants: 5,
    synced: 5,
    thumbnail_url: 'https://images.unsplash.com/photo-1556301590-319c5b2ac83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    is_ignored: false
  }
];

// Dummy product details
const dummyProductDetails: Record<number, PrintfulProductDetail> = {
  1: {
    sync_product: {
      id: 1,
      external_id: 'pm-001',
      name: 'Peak Mode Unisex Hoodie',
      variants: 8,
      synced: 8,
      thumbnail_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_ignored: false,
      description: '<p>Stay warm and stylish with our premium unisex hoodie. Perfect for workouts or casual wear, this hoodie offers unmatched comfort with its soft interior and durable construction.</p><p>Features:</p><ul><li>80% cotton, 20% polyester</li><li>Adjustable drawstring hood</li><li>Kangaroo pocket</li><li>Ribbed cuffs and hem</li></ul>'
    },
    sync_variants: [
      {
        id: 101,
        product_id: 1,
        name: 'Peak Mode Unisex Hoodie - Black / S',
        size: 'S',
        color: 'Black',
        price: '59.99',
        retail_price: '59.99',
        currency: 'USD',
        files: []
      },
      {
        id: 102,
        product_id: 1,
        name: 'Peak Mode Unisex Hoodie - Black / M',
        size: 'M',
        color: 'Black',
        price: '59.99',
        retail_price: '59.99',
        currency: 'USD',
        files: []
      },
      {
        id: 103,
        product_id: 1,
        name: 'Peak Mode Unisex Hoodie - Black / L',
        size: 'L',
        color: 'Black',
        price: '59.99',
        retail_price: '59.99',
        currency: 'USD',
        files: []
      },
      {
        id: 104,
        product_id: 1,
        name: 'Peak Mode Unisex Hoodie - Gray / S',
        size: 'S',
        color: 'Gray',
        price: '59.99',
        retail_price: '59.99',
        currency: 'USD',
        files: []
      },
      {
        id: 105,
        product_id: 1,
        name: 'Peak Mode Unisex Hoodie - Gray / M',
        size: 'M',
        color: 'Gray',
        price: '59.99',
        retail_price: '59.99',
        currency: 'USD',
        files: []
      },
      {
        id: 106,
        product_id: 1,
        name: 'Peak Mode Unisex Hoodie - Gray / L',
        size: 'L',
        color: 'Gray',
        price: '59.99',
        retail_price: '59.99',
        currency: 'USD',
        files: []
      }
    ]
  },
  2: {
    sync_product: {
      id: 2,
      external_id: 'pm-002',
      name: 'Performance Tech Tee',
      variants: 6,
      synced: 6,
      thumbnail_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_ignored: false,
      description: '<p>Our Performance Tech Tee is designed for maximum comfort during your workouts. The moisture-wicking fabric keeps you dry while the lightweight material allows for full range of motion.</p><p>Features:</p><ul><li>100% polyester</li><li>Anti-microbial treatment</li><li>UPF 30+ sun protection</li><li>Flatlock seams to prevent chafing</li></ul>'
    },
    sync_variants: [
      {
        id: 201,
        product_id: 2,
        name: 'Performance Tech Tee - Blue / S',
        size: 'S',
        color: 'Blue',
        price: '34.99',
        retail_price: '34.99',
        currency: 'USD',
        files: []
      },
      {
        id: 202,
        product_id: 2,
        name: 'Performance Tech Tee - Blue / M',
        size: 'M',
        color: 'Blue',
        price: '34.99',
        retail_price: '34.99',
        currency: 'USD',
        files: []
      },
      {
        id: 203,
        product_id: 2,
        name: 'Performance Tech Tee - Red / S',
        size: 'S',
        color: 'Red',
        price: '34.99',
        retail_price: '34.99',
        currency: 'USD',
        files: []
      },
      {
        id: 204,
        product_id: 2,
        name: 'Performance Tech Tee - Red / M',
        size: 'M',
        color: 'Red',
        price: '34.99',
        retail_price: '34.99',
        currency: 'USD',
        files: []
      }
    ]
  },
  3: {
    sync_product: {
      id: 3,
      external_id: 'pm-003',
      name: 'Compression Leggings',
      variants: 4,
      synced: 4,
      thumbnail_url: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_ignored: false,
      description: '<p>Our premium compression leggings provide the perfect balance of support and flexibility. The four-way stretch material moves with you while the high waistband offers security during intense workouts.</p><p>Features:</p><ul><li>76% polyester, 24% spandex</li><li>Moisture-wicking fabric</li><li>Hidden waistband pocket</li><li>Flatlock seams</li></ul>'
    },
    sync_variants: [
      {
        id: 301,
        product_id: 3,
        name: 'Compression Leggings - Black / S',
        size: 'S',
        color: 'Black',
        price: '79.99',
        retail_price: '79.99',
        currency: 'USD',
        files: []
      },
      {
        id: 302,
        product_id: 3,
        name: 'Compression Leggings - Black / M',
        size: 'M',
        color: 'Black',
        price: '79.99',
        retail_price: '79.99',
        currency: 'USD',
        files: []
      }
    ]
  },
  4: {
    sync_product: {
      id: 4,
      external_id: 'pm-004',
      name: 'All-over Print Rash Guard',
      variants: 11,
      synced: 11,
      thumbnail_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_ignored: false,
      description: '<p>Our all-over print rash guard offers style and protection for water activities or training. The quick-drying fabric provides UV protection while the fitted design prevents chafing.</p><p>Features:</p><ul><li>82% polyester, 18% spandex</li><li>UPF 50+ sun protection</li><li>Four-way stretch</li><li>Anti-odor technology</li></ul>'
    },
    sync_variants: [
      {
        id: 401,
        product_id: 4,
        name: 'All-over Print Rash Guard - Blue / S',
        size: 'S',
        color: 'Blue',
        price: '49.99',
        retail_price: '49.99',
        currency: 'USD',
        files: []
      },
      {
        id: 402,
        product_id: 4,
        name: 'All-over Print Rash Guard - Blue / M',
        size: 'M',
        color: 'Blue',
        price: '49.99',
        retail_price: '49.99',
        currency: 'USD',
        files: []
      },
      {
        id: 403,
        product_id: 4,
        name: 'All-over Print Rash Guard - Black / S',
        size: 'S',
        color: 'Black',
        price: '49.99',
        retail_price: '49.99',
        currency: 'USD',
        files: []
      }
    ]
  },
  5: {
    sync_product: {
      id: 5,
      external_id: 'pm-005',
      name: 'Performance Joggers',
      variants: 5,
      synced: 5,
      thumbnail_url: 'https://images.unsplash.com/photo-1556301590-319c5b2ac83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      is_ignored: false,
      description: '<p>Our performance joggers offer the perfect blend of comfort and functionality. The tapered design provides a modern look while the stretchy fabric allows full range of motion for any activity.</p><p>Features:</p><ul><li>88% polyester, 12% elastane</li><li>Side pockets with zipper closure</li><li>Elastic waistband with drawcord</li><li>Ribbed cuffs</li></ul>'
    },
    sync_variants: [
      {
        id: 501,
        product_id: 5,
        name: 'Performance Joggers - Gray / S',
        size: 'S',
        color: 'Gray',
        price: '89.99',
        retail_price: '89.99',
        currency: 'USD',
        files: []
      },
      {
        id: 502,
        product_id: 5,
        name: 'Performance Joggers - Gray / M',
        size: 'M',
        color: 'Gray',
        price: '89.99',
        retail_price: '89.99',
        currency: 'USD',
        files: []
      },
      {
        id: 503,
        product_id: 5,
        name: 'Performance Joggers - Gray / L',
        size: 'L',
        color: 'Gray',
        price: '89.99',
        retail_price: '89.99',
        currency: 'USD',
        files: []
      }
    ]
  }
};

// Function to fetch all products from the API
export const fetchPrintfulProducts = async (): Promise<PrintfulProduct[]> => {
  try {
    const response = await fetch("https://peak-mode-server.vercel.app/api/products");
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    toast.error("Failed to load products. Please try again later.");
    return [];
  }
}

// Function to fetch a specific product's details from the API
export const fetchProductDetails = async (productId: string): Promise<PrintfulProductDetail | null> => {
  try {
    const response = await fetch(`https://peak-mode-server.vercel.app/api/products/${productId}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch product details for ID ${productId}:`, error);
    toast.error("Failed to load product details. Please try again later.");
    
    // Fallback to dummy data if API fails
    console.log("Falling back to dummy data");
    return dummyProductDetails[parseInt(productId)] || null;
  }
}

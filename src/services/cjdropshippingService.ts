
import { toast } from "sonner";

// Types for CJdropshipping product data
export interface CJProduct {
  id: string;
  productName: string;
  productNameEn: string;
  productSku: string;
  productImage: string;
  productWeight: number;
  productUnit: string;
  productCategoryId: number;
  sellingPrice: number;
  variants?: CJVariant[];
  categoryName?: string;
}

export interface CJVariant {
  id: string;
  variantId: string;
  variantName: string;
  variantNameEn: string;
  variantSku: string;
  variantImage: string;
  price: number;
  variantProperty: {
    propertyValueName: string;
    propertyValueNameEn: string;
  }[];
}

export interface CJResponse {
  code: number;
  result: {
    list: CJProduct[];
    total: number;
  };
  message: string;
  requestId: string;
  success: boolean;
}

// Base URL for CJdropshipping API
const CJ_API_BASE_URL = "https://developers.cjdropshipping.com";
const API_KEY = "5ce297580a0547a58dc39b42d1dec8cd";

// Get access token
export const getAccessToken = async (): Promise<string | null> => {
  try {
    // First check if we have a valid token in localStorage
    const storedToken = localStorage.getItem('cj_access_token');
    const tokenExpiry = localStorage.getItem('cj_token_expiry');
    
    if (storedToken && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
      return storedToken;
    }
    
    // If no valid token, get a new one
    const response = await fetch(`${CJ_API_BASE_URL}/api/authentication/getAccessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Key': API_KEY
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get access token');
    }
    
    // Store token and expiration
    localStorage.setItem('cj_access_token', data.data.accessToken);
    const expiryTime = new Date().getTime() + (data.data.expiresIn * 1000);
    localStorage.setItem('cj_token_expiry', expiryTime.toString());
    
    return data.data.accessToken;
  } catch (error) {
    console.error("Failed to get CJdropshipping access token:", error);
    toast.error("Failed to connect to CJdropshipping API");
    return null;
  }
};

// Function to fetch products from CJdropshipping
export const fetchCJProducts = async (pageNum = 1, pageSize = 20): Promise<CJProduct[]> => {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error("No access token available");
    }
    
    const response = await fetch(`${CJ_API_BASE_URL}/api/product/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': accessToken
      },
      body: JSON.stringify({
        pageNum,
        pageSize
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch products');
    }
    
    return data.data.list || [];
  } catch (error) {
    console.error("Failed to fetch CJdropshipping products:", error);
    toast.error("Failed to load products from CJdropshipping");
    
    // Return fallback products if API fails
    return getFallbackProducts();
  }
};

// Fallback products in case API fails
const getFallbackProducts = (): CJProduct[] => {
  return [
    {
      id: "cj1001",
      productName: "Wireless Bluetooth Earbuds",
      productNameEn: "Wireless Bluetooth Earbuds",
      productSku: "CJ-WBE-001",
      productImage: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      productWeight: 0.1,
      productUnit: "kg",
      productCategoryId: 1001,
      sellingPrice: 29.99,
      categoryName: "Electronics"
    },
    {
      id: "cj1002",
      productName: "Smart Fitness Tracker",
      productNameEn: "Smart Fitness Tracker",
      productSku: "CJ-SFT-002",
      productImage: "https://images.unsplash.com/photo-1576243345690-4e4b79135a5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      productWeight: 0.08,
      productUnit: "kg",
      productCategoryId: 1001,
      sellingPrice: 39.99,
      categoryName: "Electronics"
    },
    {
      id: "cj1003",
      productName: "Phone Camera Lens Kit",
      productNameEn: "Phone Camera Lens Kit",
      productSku: "CJ-PCLK-003",
      productImage: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      productWeight: 0.15,
      productUnit: "kg",
      productCategoryId: 1002,
      sellingPrice: 24.99,
      categoryName: "Phone Accessories"
    },
    {
      id: "cj1004",
      productName: "Portable Power Bank",
      productNameEn: "Portable Power Bank",
      productSku: "CJ-PPB-004",
      productImage: "https://images.unsplash.com/photo-1608751819407-8c8def432dad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      productWeight: 0.3,
      productUnit: "kg",
      productCategoryId: 1002,
      sellingPrice: 34.99,
      categoryName: "Phone Accessories"
    }
  ];
};

// Function to fetch a single product detail
export const fetchCJProductDetail = async (productId: string): Promise<CJProduct | null> => {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error("No access token available");
    }
    
    const response = await fetch(`${CJ_API_BASE_URL}/api/product/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': accessToken
      },
      body: JSON.stringify({
        pid: productId
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch product details');
    }
    
    return data.data || null;
  } catch (error) {
    console.error(`Failed to fetch CJdropshipping product details for ID ${productId}:`, error);
    toast.error("Failed to load product details from CJdropshipping");
    
    // Return fallback product if API fails
    return getFallbackProducts().find(p => p.id === productId) || null;
  }
};

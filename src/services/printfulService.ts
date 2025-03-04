
import { toast } from "sonner";

// Printful API key
const API_KEY = "JdCbzPYRxkKMjZu8rwdus48RyK0sX7u0tNrCaqeJ";

// Types for Printful API responses
export interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
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

// Function to fetch all products from Printful store
export const fetchPrintfulProducts = async (): Promise<PrintfulProduct[]> => {
  try {
    const response = await fetch("https://api.printful.com/store/products", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error ${response.status}: ${errorData}`);
    }

    const data: PrintfulResponse = await response.json();
    return data.result;
  } catch (error) {
    console.error("Failed to fetch Printful products:", error);
    toast.error("Failed to load products. Please try again later.");
    return [];
  }
}

// Function to fetch a specific product's details
export const fetchProductDetails = async (productId: number): Promise<any> => {
  try {
    const response = await fetch(`https://api.printful.com/store/products/${productId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`Failed to fetch product details for ID ${productId}:`, error);
    toast.error("Failed to load product details. Please try again later.");
    return null;
  }
}

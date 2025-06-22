export interface Product {
  id: number;
  name: string;
  thumbnail_url: string;
  price: string;
  currency: string;
  variants: number;
  external_id: string;
  synced: number;
  is_ignored: boolean;
  retail_price?: string;
  category_name?: string;
}

export interface UnifiedProduct {
  id: string;
  originalId: number;
  name: string;
  price: string;
  currency: string;
  category: string;
  image: string;
  isNew: boolean;
  source: ProductSource;
}

export enum ProductSource {
  PRINTFUL = 'printful',
  CJ = 'cj'
}

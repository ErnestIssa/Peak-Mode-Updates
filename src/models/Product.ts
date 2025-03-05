
export type ProductSource = 'printful' | 'cjdropshipping';

export interface UnifiedProduct {
  id: string | number;
  name: string;
  price: string;
  currency: string;
  category: string;
  image: string;
  isNew?: boolean;
  source: ProductSource;
  originalId: string | number;
}

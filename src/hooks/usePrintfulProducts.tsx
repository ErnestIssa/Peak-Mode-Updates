
import { useQuery } from "@tanstack/react-query";
import { fetchPrintfulProducts, fetchProductDetails } from "@/services/printfulService";

export const usePrintfulProducts = () => {
  return useQuery({
    queryKey: ["printful-products"],
    queryFn: async () => {
      const products = await fetchPrintfulProducts();
      
      // Fetch details for each product to get prices
      const productsWithPrices = await Promise.all(
        products.map(async (product) => {
          const details = await fetchProductDetails(product.id);
          const firstVariant = details?.sync_variants[0];
          const price = firstVariant ? firstVariant.retail_price : "499";
          
          return {
            ...product,
            price: `${price} SEK`
          };
        })
      );
      
      return productsWithPrices;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

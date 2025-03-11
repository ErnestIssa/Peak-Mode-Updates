
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
          try {
            const details = await fetchProductDetails(product.id);
            
            // If we have variant information, use the first variant's retail price
            let price = "499 SEK"; // Default fallback price
            let currency = "SEK";
            
            if (details?.sync_variants && details.sync_variants.length > 0) {
              const firstVariant = details.sync_variants[0];
              if (firstVariant.retail_price) {
                price = firstVariant.retail_price;
                currency = firstVariant.currency || "SEK";
                
                // Format price as "PRICE CURRENCY"
                if (!price.includes(currency)) {
                  price = `${price} ${currency}`;
                }
              }
            }
            
            return {
              ...product,
              price,
              currency
            };
          } catch (error) {
            console.error(`Error fetching details for product ${product.id}:`, error);
            return {
              ...product,
              price: "499 SEK", // Default fallback price
              currency: "SEK"
            };
          }
        })
      );
      
      return productsWithPrices;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

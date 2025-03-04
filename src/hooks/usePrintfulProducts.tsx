
import { useQuery } from "@tanstack/react-query";
import { fetchPrintfulProducts, PrintfulProduct } from "@/services/printfulService";

export const usePrintfulProducts = () => {
  return useQuery({
    queryKey: ["printful-products"],
    queryFn: fetchPrintfulProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};


import { useQuery } from "@tanstack/react-query";
import { fetchCJProducts, CJProduct } from "@/services/cjdropshippingService";

export const useCJProducts = () => {
  return useQuery({
    queryKey: ["cjdropshipping-products"],
    queryFn: () => fetchCJProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

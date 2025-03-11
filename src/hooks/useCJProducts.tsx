
import { useQuery } from "@tanstack/react-query";

// Modified to return empty data
export const useCJProducts = () => {
  return useQuery({
    queryKey: ["cjdropshipping-products"],
    queryFn: () => Promise.resolve([]), // Return empty array
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

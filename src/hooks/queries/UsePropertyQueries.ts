import { useQuery } from "@tanstack/react-query";
import { getProperties } from "@/api/properties";

export const useProperties = () => {
    return useQuery({ queryKey: ["properties"], queryFn: getProperties });
};
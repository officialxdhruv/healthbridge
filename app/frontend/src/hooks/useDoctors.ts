import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { Doctor } from "@healthbridge/types";

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors-list"],
    queryFn: async () => {
      const data = await api
        .get("doctor/list")
        .json<{ success: boolean; doctors: Doctor[] }>();
      return data.doctors;
    },
  });
}

import type { Doctor } from "@healthbridge/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

export function useGoogleCallback() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const status = searchParams.get("google");
    if (!status) return;

    if (status === "success") {
      toast.success("Google Calendar connected successfully!");
      queryClient.invalidateQueries({ queryKey: ["google-status"] });
    } else if (status === "error") {
      toast.error("Failed to connect Google Calendar");
    }

    setSearchParams({});
  }, [searchParams, queryClient, setSearchParams]);
}

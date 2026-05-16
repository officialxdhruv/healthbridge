import { useQuery } from "@tanstack/react-query";
import { CircleCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export function GoogleCalendarSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ["google-status"],
    queryFn: async () => {
      const res = await api
        .get("auth/google/status")
        .json<{ success: boolean; isGoogleLinked: boolean }>();
      console.log(res);
      return res.isGoogleLinked;
    },
  });

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Google Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        {data ? (
          <>
            <Button variant="ghost" className="text-green-500">
              <CircleCheckIcon className="size-3" />
              Active
            </Button>
            <Button
              size="sm"
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`)
              }
            >
              Connect Google
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Connect to enable Google Meet for appointments
            </p>
            <Button
              size="sm"
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`)
              }
            >
              Connect Google
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

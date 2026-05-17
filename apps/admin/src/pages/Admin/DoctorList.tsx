import type { Doctor } from "@healthbridge/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { api } from "@/lib/api";

export default function DoctorsList() {
  const queryClient = useQueryClient();

  const { data: doctors = [] } = useQuery({
    queryKey: ["admin", "doctors"],
    queryFn: async () => {
      const data = await api
        .get("admin/all-doctors")
        .json<{ success: boolean; doctors: Doctor[] }>();
      return data.doctors;
    },
  });

  const { mutate: changeAvailability } = useMutation({
    mutationFn: async (docId: string) => {
      await api.post("doctor/change-availability", { json: { docId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="m-5">
      <div className="w-full grid grid-cols-5 gap-4 gap-y-6">
        {doctors.map((doctor) => (
          <Card
            className="cursor-pointer hover:-translate-y-2.5 transition-all duration-500 overflow-hidden pt-0"
            key={doctor._id}
          >
            <div className="w-full h-48 overflow-hidden">
              <img
                className="w-full h-full object-cover bg-accent"
                src={doctor.image}
                alt={doctor.name}
              />
            </div>
            <CardContent className="pt-3">
              <div className="flex items-center gap-2 text-sm">
                <p
                  className={`size-2 rounded-full ${doctor.available ? "bg-green-500" : "bg-red-500"}`}
                />
                <p
                  className={
                    doctor.available ? "text-green-500" : "text-red-500"
                  }
                >
                  {doctor.available ? "Available" : "Not Available"}
                </p>
              </div>
              <p className="text-lg font-medium">{doctor.name}</p>
              <p className="text-sm text-muted-foreground">
                {doctor.speciality}
              </p>
              <Toggle
                pressed={doctor.available}
                onPressedChange={() => changeAvailability(doctor._id)}
                size="sm"
                variant="outline"
              >
                Available
              </Toggle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

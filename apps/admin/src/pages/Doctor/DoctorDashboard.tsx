import type { Appointment } from "@healthbridge/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeIndianRupeeIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

type DashData = {
  earnings: number;
  appointments: number;
  patients: number;
  latestAppointments: Appointment[];
};

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { data: dashData } = useQuery({
    queryKey: ["doctor", "dashboard"],
    queryFn: async () => {
      const data = await api
        .get("doctor/dashboard")
        .json<{ success: boolean; dashData: DashData }>();
      return data.dashData;
    },
  });

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: async (appointmentId: string) => {
      await api.post("doctor/cancel-appointment", { json: { appointmentId } });
    },
    onSuccess: () => {
      toast.success("Appointment cancelled");
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const formatSlotDate = (slotDate: string) => {
    const [day, month, year] = slotDate.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  if (!dashData) return null;

  const stats = [
    {
      label: "Earnings",
      value: `₹${dashData.earnings}`,
      icon: BadgeIndianRupeeIcon,
    },
    { label: "Appointments", value: dashData.appointments, icon: CalendarIcon },
    { label: "Patients", value: dashData.patients, icon: UsersIcon },
  ];

  return (
    <div className="m-5 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card
            key={label}
            className="hover:scale-105 transition-all cursor-pointer"
          >
            <CardContent className="flex items-center gap-4 pt-6">
              <Icon className="w-10 h-10 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {dashData.latestAppointments.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-3 py-2 border-b last:border-0"
            >
              <Avatar>
                <AvatarImage src={item.userData.image} alt={item.userData.name} />
                <AvatarFallback>
                  {item.userData.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{item.userData.name}</p>
                <p className="text-sm text-muted-foreground">
                  Booking on {formatSlotDate(item.slotDate)}
                </p>
              </div>
              {item.cancelled ? (
                <span className="text-red-400 text-xs font-medium">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className="text-green-500 text-xs font-medium">
                  Completed
                </span>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => cancelAppointment(item._id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

import type { Appointment } from "@healthbridge/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { useAppStore } from "@/state/useAppStore";

export default function DoctorAppointments() {
  const queryClient = useQueryClient();

  const { currencySymbol } = useAppStore();

  const { data: appointments = [] } = useQuery({
    queryKey: ["doctor", "appointments"],
    queryFn: async () => {
      const data = await api
        .get("doctor/appointments")
        .json<{ success: boolean; appointments: Appointment[] }>();
      return [...data.appointments].reverse();
    },
  });

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: async (appointmentId: string) => {
      await api.post("doctor/cancel-appointment", { json: { appointmentId } });
    },
    onSuccess: () => {
      toast.success("Appointment cancelled");
      queryClient.invalidateQueries({ queryKey: ["doctor", "appointments"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const { mutate: completeAppointment } = useMutation({
    mutationFn: async (appointmentId: string) => {
      await api.post("doctor/complete-appointment", {
        json: { appointmentId },
      });
    },
    onSuccess: () => {
      toast.success("Appointment completed");
      queryClient.invalidateQueries({ queryKey: ["doctor", "appointments"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const calculateAge = (dob: string | Date | null | undefined) => {
    if (!dob) return "N/A";
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

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

  return (
    <div className="w-full m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Meet Link</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Fees</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment, index) => (
            <TableRow key={appointment._id}>
              <TableCell>{appointments.length - index}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={appointment.userData.image}
                      alt={appointment.userData.name}
                    />
                    <AvatarFallback>
                      {appointment.userData.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p>{appointment.userData.name}</p>
                </div>
              </TableCell>
              <TableCell>
                {appointment.meetLink ? (
                  <a
                    href={appointment.meetLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      Join Meet
                    </Button>
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Not generated
                  </span>
                )}
              </TableCell>
              <TableCell>{calculateAge(appointment.userData.dob)}</TableCell>
              <TableCell>
                {formatSlotDate(appointment.slotDate)}, {appointment.slotTime}
              </TableCell>
              <TableCell>
                {currencySymbol}
                {appointment.amount}
              </TableCell>
              <TableCell>
                {appointment.cancelled ? (
                  <span className="text-red-400 text-xs font-medium">
                    Cancelled
                  </span>
                ) : appointment.isCompleted ? (
                  <span className="text-green-500 text-xs font-medium">
                    Completed
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => cancelAppointment(appointment._id)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => completeAppointment(appointment._id)}
                    >
                      Complete
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

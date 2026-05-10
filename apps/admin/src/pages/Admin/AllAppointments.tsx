import type { Appointment } from "@healthbridge/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import fallbackImg from "@/assets/upload_area.svg";
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

export default function AllAppointments() {
  const queryClient = useQueryClient();

  const { currencySymbol } = useAppStore();

  const { data: appointments = [] } = useQuery({
    queryKey: ["admin", "appointments"],
    queryFn: async () => {
      const data = await api
        .get("admin/appointments")
        .json<{ success: boolean; appointments: Appointment[] }>();
      return [...data.appointments].reverse();
    },
  });

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: async (appointmentId: string) => {
      await api.post("admin/cancel-appointment", { json: { appointmentId } });
    },
    onSuccess: () => {
      toast.success("Appointment cancelled");
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const calculateAge = (dob: string | undefined) => {
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
    <div className="m-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Doctor</TableHead>
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
                      src={appointment.userData.image ?? fallbackImg}
                      alt={appointment.userData.name}
                    />
                    <AvatarFallback>
                      {appointment.userData.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p>{appointment.userData.name}</p>
                </div>
              </TableCell>
              <TableCell>{calculateAge(appointment.userData.dob)}</TableCell>
              <TableCell>
                {formatSlotDate(appointment.slotDate)} {appointment.slotTime}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={appointment.docData.image ?? fallbackImg}
                      alt={appointment.docData.name}
                    />
                    <AvatarFallback>
                      {appointment.docData.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p>{appointment.docData.name}</p>
                </div>
              </TableCell>
              <TableCell>
                {currencySymbol}
                {appointment.amount}
              </TableCell>
              <TableCell>
                {appointment.cancelled ? (
                  <span className="text-destructive text-xs font-medium">
                    Cancelled
                  </span>
                ) : appointment.isCompleted ? (
                  <span className="text-green-500 text-xs font-medium">
                    Completed
                  </span>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => cancelAppointment(appointment._id)}
                  >
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import type { Appointment } from "@healthbridge/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const MyAppointments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const months = [
    " ",
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

  const slotDateFormat = (slotDate: string) => {
    const [day, month, year] = slotDate.split("-");
    return `${day} ${months[Number(month)]} ${year}`;
  };

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const data = await api
        .get("user/appointments")
        .json<{ success: boolean; appointments: Appointment[] }>();
      return [...data.appointments].reverse();
    },
  });

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: async (appointmentId: string) => {
      await api.post("user/cancel-appointment", { json: { appointmentId } });
    },
    onSuccess: () => {
      toast.success("Appointment cancelled");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const { mutate: payAppointment } = useMutation({
    mutationFn: async (appointmentId: string) => {
      await api.post("user/pay-appointment", { json: { appointmentId } });
    },
    onSuccess: () => {
      toast.success("Payment successful");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      navigate("/my-appointments");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium border-b">My appointments</p>
      <div className="">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            <div>
              <img className="w-36" src={item.docData.image} alt="" />
            </div>
            <div className="flex-1 text-sm">
              <p className="text-base font-semibold">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              {/* <p className="font-medium mt-1">Address:</p> */}
              {/* <p className=''>{item.docData.address.line1}</p> */}
              {/* <p className=''>{item.docData.address.line2}</p> */}
              <p className="mt-1">
                <span className="text-sm font-medium">Date & Time:</span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end text-sm text-center">
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <Button
                  onClick={() => payAppointment(item._id)}
                  className="rounded-sm w-48"
                  variant={"outline"}
                >
                  Pay Online
                </Button>
              )}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <Button className="rounded-sm w-48 bg-green-500" variant={"default"}>
                  Paid
                </Button>
              )}

              {item.isCompleted && (
                <Button className="rounded-sm w-48" variant={"outline"}>
                  Completed
                </Button>
              )}

              {!item.cancelled && !item.isCompleted && (
                <Button
                  onClick={() => cancelAppointment(item._id)}
                  className="rounded-sm w-48"
                  variant={"destructive"}
                >
                  Cancel appointment
                </Button>
              )}
              {item.cancelled && !item.isCompleted && (
                <Button className="rounded-sm w-48 border-destructive" variant={"destructive"}>
                  Appointment cancelled
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;

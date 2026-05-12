import type { Appointment } from "@healthbridge/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

const MyAppointments = () => {
  const queryClient = useQueryClient();

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

  const slotDateFormat = (slotDate: string) => {
    const [day, month, year] = slotDate.split("-");
    return `${day} ${months[Number(month) - 1]} ${year}`;
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

  const { Razorpay } = useRazorpay();

  const { mutate: payAppointment } = useMutation({
    mutationFn: async (appointmentId: string) => {
      const data = await api
        .post("user/create-razorpay-order", { json: { appointmentId } })
        .json<{ success: boolean; order: any }>();

      return new Promise((resolve, reject) => {
        const options: RazorpayOrderOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "HealthBridge",
          description: "Appointment Payment",
          order_id: data.order.id,
          handler: async (response) => {
            await api.post("user/verify-razorpay-payment", {
              json: { razorpay_order_id: response.razorpay_order_id },
            });
            resolve(response);
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
          prefill: {
            name: "HealthBridge User",
          },
          theme: {
            color: "#000000",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      });
    },
    onSuccess: () => {
      toast.success("Payment successful");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: Error) => {
      if (error.message !== "Payment cancelled") {
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="space-y-4 pt-5">
      <p className="text-lg font-medium pb-3">My Appointments</p>
      {appointments.map((item) => (
        <Card key={item._id}>
          <CardContent className="flex gap-4 pt-4">
            <Avatar className="size-20 rounded-lg shrink-0">
              <AvatarImage
                src={item.docData.image || undefined}
                alt={item.docData.name}
                className="object-cover bg-primary dark:bg-primary-foreground"
              />
              <AvatarFallback className="rounded-lg text-xl">
                {item.docData.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base">{item.docData.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.docData.speciality}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Date & Time: </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-center w-50">
              {item.cancelled ? (
                <Button variant="destructive" className="w-full">
                  Cancelled
                </Button>
              ) : item.isCompleted ? (
                <Button
                  variant="outline"
                  className="text-green-500 border-green-500 w-full"
                >
                  Completed
                </Button>
              ) : (
                <>
                  {!item.payment && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => payAppointment(item._id)}
                    >
                      Pay Online
                    </Button>
                  )}
                  {item.payment && (
                    <Button
                      size={"sm"}
                      variant="outline"
                      className="text-green-500 border-green-500 w-full"
                    >
                      Paid
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => cancelAppointment(item._id)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyAppointments;

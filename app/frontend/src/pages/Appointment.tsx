import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { assets } from "@/assets/assets_frontend/assets";
import RelatedDoctors from "@/components/RelatedDoctors";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDoctors } from "@/hooks/useDoctors";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/state/useAppStore";

export default function Appointment() {
  const daysOfWeeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const { docId } = useParams();
  const { currencySymbol } = useAppStore();
  const { data: doctors, isLoading } = useDoctors();

  // const doctors = useAppStore((state) => state.doctors)

  const docInfo = doctors?.find((doc) => doc._id === docId);

  const [docSlots, setDocSlots] = useState<
    { dateTime: Date; time: string }[][]
  >([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const { mutate: bookAppointment, isPending } = useMutation({
    mutationFn: async () => {
      const slotDate =
        docSlots[slotIndex]?.[0]?.dateTime.toLocaleDateString("en-CA");
      console.log("Booking appointment with details:", {
        docId,
        slotDate,
        slotTime,
      });
      await api.post("user/book-appointment", {
        json: { docId, slotDate, slotTime },
      });
    },
    onSuccess: () => toast.success("Appointment booked successfully"),
    onError: (error: Error) => toast.error(error.message),
  });

  const getAvailableSlots = () => {
    const today = new Date();
    const allSlots: { dateTime: Date; time: string }[][] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // start time
      const start = new Date(date);
      if (i === 0) {
        // today: start from next hour or 10AM whichever is later
        start.setHours(Math.max(today.getHours() + 1, 10), 0, 0, 0);
      } else {
        start.setHours(10, 0, 0, 0);
      }

      // end time 9PM
      const end = new Date(date);
      end.setHours(21, 0, 0, 0);

      // date key for checking booked slots
      const dateKey = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
      const bookedSlots = docInfo?.slotsBooked?.[dateKey] ?? [];

      const timeSlots: { dateTime: Date; time: string }[] = [];
      const current = new Date(start);

      while (current < end) {
        const time = current.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!bookedSlots.includes(time)) {
          timeSlots.push({ dateTime: new Date(current), time });
        }

        current.setMinutes(current.getMinutes() + 30);
      }

      if (timeSlots.length > 0) {
        allSlots.push(timeSlots);
      }
    }

    setDocSlots(allSlots); // single state update instead of one per iteration
  };

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  if (isLoading || !docInfo) return null;

  return (
    <div>
      {/* Doctors Detail */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-accent dark:bg-card w-full sm:max-w-72 rounded-lg"
            src={docInfo?.image}
            alt={docInfo?.name}
          />
        </div>
        <div className="flex-1 border border-accent rounded-lg p-8 py-7 mx-2 sm:mx-0 -mt-20 sm:mt-0">
          {/* doc info: name, degree, exp */}
          <p className="flex items-center gap-2 text-2xl font-medium ">
            {docInfo?.name}
            <img src={assets.verified_icon} className="w-5" alt="" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1">
            <p>
              {docInfo?.degree} - {docInfo?.speciality}
            </p>
            <Badge variant={"outline"}>{docInfo?.experience}</Badge>
          </div>

          {/* Doctor About */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium mt-3">
              About <img src={assets.info_icon} className="w-3" alt="" />
            </p>
            <p className="text-sm text-muted-foreground max-w-175 mt-1">
              {docInfo?.about}
            </p>
          </div>
          <p className="font-medium mt-4">
            Appointment fee:{" "}
            <span>
              {currencySymbol}
              {docInfo?.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-muted-foreground">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length &&
            docSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                key={index}
                className={cn(
                  "flex flex-col text-center rounded-full min-w-16",
                  slotIndex === index
                    ? buttonVariants({ variant: "default" })
                    : buttonVariants({ variant: "outline" }),
                  "py-10",
                )}
              >
                <p>{item[0] && daysOfWeeks[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))}
        </div>
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length &&
            docSlots[slotIndex].map((slot, index) => (
              <p
                onClick={() => setSlotTime(slot.time)}
                key={index}
                className={cn(
                  "text-sm font-light shrink-0 pl-0 pr-4 py-2 rounded-full cursor-pointer",
                  slot.time === slotTime
                    ? buttonVariants({ variant: "default" })
                    : buttonVariants({ variant: "outline" }),
                )}
              >
                {slot.time.toLowerCase()}
              </p>
            ))}
        </div>

        <Button
          onClick={() => bookAppointment()}
          disabled={!slotTime || isPending}
          className="my-6"
        >
          {isPending ? "Booking..." : "Book an appointment"}
        </Button>
      </div>

      {/* Related Doctors */}

      <RelatedDoctors
        docId={docId ?? ""}
        speciality={docInfo?.speciality ?? ""}
      />
    </div>
  );
}

import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { assets } from "@/assets/assets_frontend/assets";
import RelatedDoctors from "@/components/RelatedDoctors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDoctors } from "@/hooks/useDoctors";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/state/useAppStore";

export default function Appointment() {
  const navigate = useNavigate();

  const daysOfWeeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const { docId } = useParams();
  const { currencySymbol } = useAppStore();
  const { data: doctors, isLoading } = useDoctors();

  const docInfo = useMemo(
    () => doctors?.find((doc) => doc._id === docId),
    [doctors, docId],
  );

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
    onSuccess: () => {
      navigate("/my-appointments");
      toast.success("Appointment booked successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const docSlots = useMemo(() => {
    if (!docInfo) return [];

    const today = new Date();
    const allSlots: { dateTime: Date; time: string }[][] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const start = new Date(date);

      if (i === 0) {
        start.setHours(Math.max(today.getHours() + 1, 10), 0, 0, 0);
      } else {
        start.setHours(10, 0, 0, 0);
      }

      const end = new Date(date);
      end.setHours(21, 0, 0, 0);

      const dateKey = date.toLocaleDateString("en-CA");
      const bookedSlots = docInfo?.slotsBooked?.[dateKey] ?? [];

      const timeSlots: { dateTime: Date; time: string }[] = [];
      const current = new Date(start);

      while (current < end) {
        const time = current.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!bookedSlots.includes(time)) {
          timeSlots.push({
            dateTime: new Date(current),
            time,
          });
        }

        current.setMinutes(current.getMinutes() + 30);
      }

      if (timeSlots.length > 0) {
        allSlots.push(timeSlots);
      }
    }

    return allSlots;
  }, [docInfo]);

  if (isLoading) return <p>Loading...</p>;

  if (!docInfo) return <p>Doctor not found</p>;
  return (
    <>
      {/* Doctor Details */}
      <div className="flex flex-col w-full md:flex-row gap-6">
        {/* Doctor Image */}

        <div className="md:w-60 h-69 shrink-0">
          <img
            className="w-full h-full rounded-xl object-contain md:object-cover bg-primary dark:bg-primary-foreground"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Doctor Info */}
          <div className="w-full border border-accent rounded-xl p-6">
            {/* Name */}
            <p className="flex items-center gap-2 text-2xl font-medium">
              {docInfo.name}
              <img src={assets.verified_icon} className="w-5" alt="" />
            </p>

            {/* Degree */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>

              <Badge variant="outline">{docInfo.experience}</Badge>
            </div>

            {/* About */}
            <div className="mt-4">
              <p className="flex items-center gap-1 text-sm font-medium">
                About
                <img src={assets.info_icon} className="w-3" alt="" />
              </p>

              <p className="text-sm text-muted-foreground mt-2 leading-6">
                {docInfo.about}
              </p>
            </div>

            {/* Fees */}
            <p className="font-medium mt-6">
              Appointment fee:
              <span className="ml-1">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
          {/* Booking Slots */}
          <div className="mt-8">
            <p className="font-medium text-muted-foreground">Booking slots</p>

            {/* Days */}
            <div className="flex gap-3 overflow-x-auto mt-4 pb-2 w-full">
              {docSlots.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={cn(
                    "min-w-16 py-10 px-6 flex flex-col items-center justify-center",
                  )}
                  variant={slotIndex === index ? "default" : "outline"}
                >
                  <p>{daysOfWeeks[item[0].dateTime.getDay()]}</p>

                  <p>{item[0].dateTime.getDate()}</p>
                </Button>
              ))}
            </div>

            {/* Time Slots */}
            <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
              {docSlots[slotIndex]?.map((slot, index) => (
                <Button
                  key={index}
                  onClick={() => setSlotTime(slot.time)}
                  className={"shrink-0 px-5 py-4 text-sm"}
                  variant={slot.time === slotTime ? "default" : "outline"}
                >
                  {slot.time.toLowerCase()}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => bookAppointment()}
              disabled={!slotTime || isPending}
              className="mt-6"
            >
              {isPending ? "Booking..." : "Book an appointment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors
        docId={docId ?? ""}
        speciality={docInfo.speciality ?? ""}
      />
    </>
  );
}

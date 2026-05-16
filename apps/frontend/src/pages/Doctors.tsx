import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import DoctorCard from "@/components/DoctorCard";
import { Button } from "@/components/ui/button";
import { useDoctors } from "@/hooks/useDoctors";
import { cn } from "@/lib/utils";

export default function Doctors() {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { data: doctors, isLoading } = useDoctors();

  const filterDoc = useMemo(() => {
    if (!doctors) return [];
    if (speciality)
      return doctors.filter((doc) => doc.speciality === speciality);
    return doctors;
  }, [doctors, speciality]);

  if (isLoading) return null;

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div>
      <p className="text-muted-foreground">
        Browse through the doctors specialist
      </p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="flex flex-col gap-4 text-sm">
          {specialities.map((s) => (
            <Button
              key={s}
              onClick={() =>
                speciality === s
                  ? navigate("/doctors")
                  : navigate(`/doctors/${s}`)
              }
              className={cn("pr-16 pl-3 justify-start cursor-pointer")}
              variant={speciality === s ? "default" : "outline"}
            >
              {s}
            </Button>
          ))}
        </div>

        <div className="w-full grid grid-cols-5 gap-4 gap-y-6">
          {filterDoc.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
}

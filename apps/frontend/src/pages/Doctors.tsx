import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
            <Card
              className="cursor-pointer hover:-translate-y-2.5 transition-all duration-500 overflow-hidden pt-0"
              key={doctor._id}
              onClick={() => navigate(`/appointment/${doctor._id}`)}
            >
              <div className="w-full h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover bg-primary dark:bg-primary-foreground"
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import type { Doctors } from "@/assets/assets_frontend/assets";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDoctors } from "@/hooks/useDoctors";
import { cn } from "@/lib/utils";

export default function Doctors() {
  // const { doctors } = useContext(AppContext);

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
        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
          {specialities.map((s) => (
            <p
              key={s}
              onClick={() =>
                speciality === s
                  ? navigate("/doctors")
                  : navigate(`/doctors/${s}`)
              }
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded pr-16 pl-3 justify-start cursor-pointer",
                speciality === s && "bg-accent font-bold text-black",
              )}
            >
              {s}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-5 gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <Card
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="cursor-pointer hover:-translate-y-2.5 transition-all duration-500"
              key={index}
            >
              <img className="bg-accent" src={item.image} />
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-center">
                  {item.available ? (
                    <>
                      <p className="size-2 bg-green-500 rounded-full"></p>
                      <p className="text-green-500">Available</p>
                    </>
                  ) : (
                    <>
                      <p className="size-2 bg-red-500 rounded-full"></p>
                      <p className="text-red-500">Not Available</p>
                    </>
                  )}
                </div>
                <p className="text-lg font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.speciality}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

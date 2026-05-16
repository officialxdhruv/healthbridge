import type { Doctor } from "@healthbridge/types";
import { useNavigate } from "react-router";
import { Card, CardContent } from "./ui/card";

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const navigate = useNavigate();
  return (
    <Card
      className="cursor-pointer hover:-translate-y-2.5 transition-all duration-500 overflow-hidden pt-0"
      onClick={() => {
        navigate(`/appointment/${doctor._id}`);
        scrollTo({ left: 0, top: 0, behavior: "instant" });
      }}
    >
      <div className="w-full h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover bg-accent"
          src={doctor.image}
          alt={doctor.name}
        />
      </div>
      <CardContent className="pt-3">
        <div className="flex items-center gap-2 text-sm">
          <p
            className={`size-2 rounded-full ${doctor.available ? "bg-green-500" : "bg-red-500"}`}
          />
          <p className={doctor.available ? "text-green-500" : "text-red-500"}>
            {doctor.available ? "Available" : "Not Available"}
          </p>
        </div>
        <p className="text-lg font-medium">{doctor.name}</p>
        <p className="text-sm text-muted-foreground">{doctor.speciality}</p>
      </CardContent>
    </Card>
  );
}

export default DoctorCard;

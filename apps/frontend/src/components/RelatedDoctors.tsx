import { useNavigate } from "react-router";
import { useDoctors } from "@/hooks/useDoctors";
import DoctorCard from "./DoctorCard";
import { Button } from "./ui/button";

export default function RelatedDoctors({
  docId,
  speciality,
}: {
  docId: string;
  speciality: string;
}) {
  const navigate = useNavigate();
  const { data: doctors = [] } = useDoctors();

  const relatedDoctors = doctors
    .filter((doc) => doc.speciality === speciality && doc._id !== docId)
    .slice(0, 5);

  return (
    <div className="flex flex-col items-center gap-4 my-16 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors
      </p>
      <div className="w-full grid grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relatedDoctors.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
      <Button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="mt-10"
        variant="outline"
      >
        More
      </Button>
    </div>
  );
}

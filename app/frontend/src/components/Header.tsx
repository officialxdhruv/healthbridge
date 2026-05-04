import { assets } from "@/assets/assets_frontend/assets";
import { MoveRight } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-accent dark:bg-card  rounded-lg px-6 md:px-10 lg:px-20">
      {/* left side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:-mb-7.5">
        <p className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-sm font-light">
          <img src={assets.group_profiles} alt="" className="w-28" />
          <p>
            Simply browse through our extensive list of trusted doctors,{" "}
            <br className="hidden sm:block" /> schedule your appointment
            hassle-free.{" "}
          </p>
        </div>
        <Button className="py-5 px-4">
          <a href="#speciality" className="flex items-center gap-2">
            Book Appointment
            <MoveRight />
          </a>
        </Button>
      </div>
      {/* Right Side */}
      <div className="md:w-1/2 relative">
        <img
          src={assets.header_img}
          alt=""
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
        />
      </div>
    </div>
  );
}

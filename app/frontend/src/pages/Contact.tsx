import { assets } from "@/assets/assets_frontend/assets";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div>
      <div className="text-center text-2xl pt-10">
        <p className="font-semibold">CONTACT US</p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-20 mb-28 text-sm">
        <img
          src={assets.contact_image}
          alt=""
          className="w-full md:max-w-90 rounded-xl"
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg">Our Office</p>
          <p className="text-muted-foreground">
            {" "}
            38/2083, Nai Wara, Delhi 110005, India
          </p>
          <p className="text-muted-foreground">Tel: +91 11 2345 6789</p>
          <p className="text-muted-foreground">Email: info@healthbridge.com</p>
          <p className="font-semibold text-lg">Careers at HealthBridge</p>
          <p className="text-muted-foreground">
            Learn more about our teams and job openings.
          </p>
          <Button>Explore Jobs</Button>
        </div>
      </div>
    </div>
  );
}

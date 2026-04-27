import { assets } from "@/assets/assets_frontend/assets";
import { Card } from "@/components/ui/card";

export default function About() {
    return (
        <div>
            <div className="text-center text-2xl pt-10">
                <p className="font-bold">ABOUT US</p>
            </div>

            <div className="my-10 flex flex-col justify-center md:flex-row gap-12">
                {/* Image */}
                <img src={assets.about_image} alt="" className="w-full md:max-w-90 rounded-xl" />
                {/* Text */}
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-muted-foreground">
                    <p>
                        Welcome To HealthBridge, Your Trusted Partner In Managing Your Healthcare Needs Conveniently And Efficiently.
                        At HealthBridge, We Understand The Challenges Individuals Face When It Comes To Scheduling Doctor Appointments And Managing Their Health Records.
                    </p>
                    <p>
                        HealthBridge Is Committed To Excellence In Healthcare Technology. We Continuously Strive To Enhance Our Platform, Integrating The Latest Advancements To Improve User Experience And Deliver Superior Service.
                        Whether You're Booking Your First Appointment Or Managing Ongoing Care, HealthBridge Is Here To Support You Every Step Of The Way.
                    </p>
                    <p className="font-bold text-primary">Our Vision</p>
                    <p>Our Vision At HealthBridge Is To Create A Seamless Healthcare Experience For Every User. We Aim To Bridge The Gap Between Patients And Healthcare Providers, Making It Easier For You To Access The Care You Need, When You Need It.</p>
                </div>
            </div>

            <div className="text-xl my-4">
                <p className="font-semibold">Why Choose Us</p>
            </div>

            <div className="flex flex-col md:flex-row mb-20 gap-10">
                <Card className="flex flex-col gap-5 md:px-4 hover:bg-card/80">
                    <b>EFFICIENCY:</b>
                    <p>Streamlined Appointment Scheduling That Fits Into Your Busy Lifestyle.</p>
                </Card>
                <Card className="flex flex-col gap-5 md:px-4 hover:bg-card/80">


                    <b>CONVENIENCE:</b>
                    <p>Access To A Network Of Trusted Healthcare Professionals In Your Area.</p>
                </Card>
                <Card className="flex flex-col gap-5 md:px-4 hover:bg-card/80">

                    <b>PERSONALIZATION</b>
                    <p>Tailored Recommendations And Reminders To Help You Stay On Top Of Your Health.</p>
                </Card>
            </div>


        </div>
    );
}

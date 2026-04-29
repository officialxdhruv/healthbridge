import { AppContext } from "@/context/AppContext"
import { useContext } from "react"
import { Card, CardContent } from "./ui/card";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import type { Doctors } from "@/assets/assets_frontend/assets";

export default function RelatedDoctors({ docId, speciality }: { docId: string, speciality: string }) {

    const { doctors } = useContext(AppContext)
    const navigate = useNavigate();


    let doctorsData: Doctors = [];
    if (doctors.length > 0 && speciality) {
        doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
    }

    return (
        <div className="flex flex-col items-center gap-4 my-16 md:mx-10">
            <h1 className="text-3xl font-medium">Related Doctors</h1>
            <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors</p>
            <div className="w-full grid grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {doctorsData.slice(0, 5).map((item, index) => (
                    <Card onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className="cursor-pointer hover:-translate-y-2.5 transition-all duration-500" key={index}>
                        <img className="bg-accent" src={item.image} />
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-center text-green-500 ">
                                <p className="size-2 bg-green-500 rounded-full"></p> <p>Available</p>
                            </div>
                            <p className="text-lg font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.speciality}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Button onClick={() => { navigate("/doctors"); scroll(0, 0) }} className="mt-10" variant={"outline"}>more</Button>
        </div>
    )
}

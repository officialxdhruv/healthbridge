import type { Doctors } from "@/assets/assets_frontend/assets";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function Doctors() {
    const { speciality } = useParams();
    const { doctors } = useContext(AppContext);
    let [filterDoc, setFilterDoc] = useState<Doctors>();
    const navigate = useNavigate();

    if (speciality) {
        filterDoc = doctors.filter(doc => doc.speciality === speciality);
    } else {
        filterDoc = doctors;
    }

    return (
        <div>
            <p className="text-muted-foreground">Browse through the doctors specialist</p>
            <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
                <div className="flex flex-col gap-4 text-sm text-muted-foreground">
                    <p onClick={() => speciality === 'General physician' ? navigate('/doctors/') : navigate('/doctors/General physician')} className={cn(buttonVariants({ variant: "outline" }), "rounded pr-16 pl-3 justify-start")} >General physician</p >
                    <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={cn(buttonVariants({ variant: "outline" }), "rounded pr-16 pl-3 justify-start")}>Gynecologist</p >
                    <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={cn(buttonVariants({ variant: "outline" }), "rounded pr-16 pl-3 justify-start")}>Dermatologist</p >
                    <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={cn(buttonVariants({ variant: "outline" }), "rounded pr-16 pl-3 justify-start")}>Prdiatricians</p >
                    <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={cn(buttonVariants({ variant: "outline" }), "rounded pr-16 pl-3 justify-start")}>Neurologist</p >
                    <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={cn(buttonVariants({ variant: "outline" }), "rounded pr-16 pl-3 justify-start")}>Gastroenterologist</p >
                </div>

                <div className="w-full grid grid-cols-5 gap-4 gap-y-6">
                    {
                        filterDoc.map((item, index) => (
                            <Card onClick={() => navigate(`/appointment/${item._id}`)} className="cursor-pointer hover:-translate-y-2.5 transition-all duration-500" key={index}>
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
            </div>
        </div>
    );
}
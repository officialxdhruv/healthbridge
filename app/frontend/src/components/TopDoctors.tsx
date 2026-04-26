import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

export default function TopDoctors() {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);
    return (
        <div className="flex flex-col items-center gap-4 my-16 md:mx-10">
            <h1 className="text-3xl font-medium">Top Doctor to Book</h1>
            <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors</p>
            <div className="w-full grid grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {doctors.slice(0, 10).map((item, index) => (
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
            <Button onClick={() => { navigate("/doctors"); scroll(0, 0) }} className="mt-10" variant={"outline"}>more</Button>
        </div>
    )
}

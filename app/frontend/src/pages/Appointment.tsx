import { assets } from "@/assets/assets_frontend/assets";
import RelatedDoctors from "@/components/RelatedDoctors";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { AppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Appointment() {
    const daysOfWeeks = ['SUN', 'MON', "TUE", "WED", "THU", "FRI", "SAT"]

    const { docId } = useParams();
    const { doctors, currencySybmol } = useContext(AppContext);
    const docInfo = doctors.find(doc => doc._id === docId);

    const [docSlots, setDocSlots] = useState<{ dateTime: Date, time: string }[][]>([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotsTime, SetSlotsTime] = useState('');

    const getAvailableSlots = async () => {
        setDocSlots([])

        // getting current data
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            // getting data with index
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i);

            // setting end time of the date with index
            let endTime = new Date();
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                timeSlots.push({
                    dateTime: new Date(currentDate),
                    time: formattedTime
                })

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }

    useEffect(() => {
        console.log(docSlots)
        // getAvailableSlots()  
    }, [docSlots])

    useEffect(() => {
        getAvailableSlots()
    }, [])

    return (
        <div>
            {/* Doctors Detail */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img className="bg-accent dark:bg-card w-full sm:max-w-72 rounded-lg" src={docInfo?.image} alt={docInfo?.name} />
                </div>
                <div className="flex-1 border border-accent rounded-lg p-8 py-7 mx-2 sm:mx-0 -mt-20 sm:mt-0">
                    {/* doc info: name, degree, exp */}
                    <p className="flex items-center gap-2 text-2xl font-medium ">{docInfo?.name}
                        <img src={assets.verified_icon} className="w-5" alt="" /></p>
                    <div className="flex items-center gap-2 text-sm mt-1">
                        <p>{docInfo?.degree} - {docInfo?.speciality}</p>
                        <Badge variant={"outline"} >{docInfo?.experience}</Badge>
                    </div>

                    {/* Doctor About */}
                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium mt-3">About <img src={assets.info_icon} className="w-3" alt="" /></p>
                        <p className="text-sm text-muted-foreground max-w-175 mt-1">{docInfo?.about}</p>
                    </div>
                    <p className="font-medium mt-4">Appointment fee: <span>{currencySybmol}{docInfo?.fees}</span></p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-muted-foreground">
                <p>Booking slots</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {docSlots.length && docSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index} className={cn("flex flex-col text-center rounded-full min-w-16",
                            slotIndex === index ? buttonVariants({ variant: "default" }) : buttonVariants({ variant: "outline" }),
                            "py-10"
                        )}>
                            <p>{item[0] && daysOfWeeks[item[0].dateTime.getDay()]}</p>
                            <p>{item[0] && item[0].dateTime.getDate()}</p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots.length && docSlots[slotIndex].map((slot, index) => (
                        <p onClick={() => SetSlotsTime(slot.time)} key={index} className={cn("text-sm font-light shrink-0 pl-0 pr-4 py-2 rounded-full cursor-pointer",
                            slot.time === slotsTime ? buttonVariants({ variant: "default" }) : buttonVariants({ variant: "outline" })
                        )}>
                            {slot.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <Button className="my-6">Book an appointment</Button>
            </div>

            {/* Related Doctors */}

            <RelatedDoctors docId={docId ?? ""} speciality={docInfo?.speciality ?? ""} />


        </div>
    );
}
import { assets } from "@/assets/assets_frontend/assets";
import { Badge } from "@/components/ui/badge";
import { AppContext } from "@/context/AppContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Appointment() {
    const daysOfWeeks = ['SUN', 'MON', "TUE", "WED", "THU", "FRI", "SAT"]
    
    const { docId } = useParams();
    const { doctors, currencySybmol } = useContext(AppContext);
    const docInfo = doctors.find(doc => doc._id === docId);

    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotsTime, SetSlotsTime] = useState('');

    const getAvailableSlots = async () => {
        setDocSlots([])

        // getting current data
        let tody = new Date()

        for (let i = 0; i < 7; i++) {
            // getting data with index
            let currentDate = new Date(tody)
            currentDate.setDate(tody.getDate() + i);

            // setting end time of the date with index
            let endTime = new Date();
            endTime.setDate(tody.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours
            if (tody.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })

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


        </div>
    );
}
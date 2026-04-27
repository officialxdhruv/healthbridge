import { assets } from "@/assets/assets_frontend/assets";
import { useState } from "react";

export default function Profile() {
    const [userData, setUserData] = useState({
        name: "Edward Vincent",
        image: assets.profile_pic,
        email: 'edward.vincent@example.com',
        phone: '+1 234 567 890',
        address: {
            line1: '57th',
            line2: 'Circle, Church Road, London',
        }
    })
    return (
        <div>
            <div className="flex items-center gap-4">
                <img src={userData.image} alt="Profile Picture" className="w-24 h-24 rounded-full object-cover" />
                <div>
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    <p className="text-gray-600">{userData.email}</p>
                    <p className="text-gray-600">{userData.phone}</p>
                    <p className="text-gray-600">{userData.address.line1}, {userData.address.line2}</p>
                </div>
            </div>
        </div>
    );
}
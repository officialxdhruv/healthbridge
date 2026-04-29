import { assets } from "@/assets/assets_frontend/assets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AppContext } from "@/context/AppContext"
import axios from "axios"
import { useContext, useState } from "react"
import { toast } from "sonner"


export default function Profile() {
    const [userData, setUserData] = useState({
        name: "Edward Vincent",
        image: assets.profile_pic,
        email: 'edward.vincent@example.com',
        phone: '+1 234 567 890',
        gender: 'Male',
        dob: '1990-01-01',

        address: {
            line1: '57th',
            line2: 'Circle, Church Road, London',
        }
    })

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState<File | null>(null)

    const { token, backendUrl, loadUserProfileData } = useContext(AppContext);


    const updateUserProfileData = async () => {
        try {
            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(null)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData ? (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

            {isEdit ? (
                <label htmlFor='image'>
                    <div className='inline-block relative cursor-pointer'>
                        <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                        <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
                    </div>
                    <input onChange={(e) => {
                        if (e.target.files)
                            setImage(e.target.files[0]);
                    }} type="file" id="image" hidden />
                </label>
            ) : (
                <img className='w-36 rounded' src={userData.image} alt="" />
            )}

            {isEdit ? (
                <Input className='text-3xl font-medium max-w-60' type="text"
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    value={userData.name}
                />
            ) : (
                <p className='font-medium text-3xl mt-4'>{userData.name}</p>
            )}

            <Separator />

            <div>
                <p className='underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-muted-foreground'>
                    <p className='font-medium'>Email id:</p>
                    <p >{userData.email}</p>

                    <p className='font-medium'>Phone:</p>
                    {isEdit ? (
                        <Input className='max-w-52' type="text"
                            onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                            value={userData.phone}
                        />
                    ) : (
                        <p>{userData.phone}</p>
                    )}

                    <p className='font-medium'>Address:</p>
                    {isEdit ? (
                        <p className="grid gap-2">
                            <Input type="text"
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    address: { ...(prev.address || {}), line1: e.target.value }
                                }))}
                                value={userData.address?.line1 || ''}
                            />

                            <Input type="text"
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    address: { ...(prev.address || {}), line2: e.target.value }
                                }))}
                                value={userData.address?.line2 || ''}
                            />
                        </p>
                    ) : (
                        <p >{userData.address?.line1} <br /> {userData.address?.line2}</p>
                    )}
                </div>
            </div>

            <div>
                <p className='underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-muted-foreground'>
                    <p className='font-medium'>Gender:</p>
                    {isEdit ? (
                        <Select
                            value={userData.gender}
                            onValueChange={(value) =>
                                setUserData(prev => ({ ...prev, gender: value }))
                            }
                        >
                            <SelectTrigger className="w-45">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Not Selected">Not Selected</SelectItem>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <p >{userData.gender}</p>
                    )}
                    <p className='font-medium'>Birthday:</p>
                    {isEdit ? (
                        <Input className='max-w-45 ' type='date'
                            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                            value={userData.dob}
                        />
                    ) : (
                        <p >{userData.dob}</p>
                    )}
                </div>
            </div>

            <div className='mt-10'>
                {isEdit ? (
                    <Button onClick={updateUserProfileData} >
                        Save information
                    </Button>
                ) : (
                    <Button onClick={() => setIsEdit(true)}>
                        Edit
                    </Button>
                )}
            </div>
        </div >
    ) : null
}

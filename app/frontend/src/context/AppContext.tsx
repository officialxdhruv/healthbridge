import { createContext, useState } from "react";
import {
  type Doctors,
  doctors as docData,
} from "../assets/assets_frontend/assets.ts";

type AppContextType = {
  doctors: Doctors;
  currencySymbol: string;
  backendUrl: string;

  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;

  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;

  getDoctorsData: () => Promise<void>;
  loadUserProfileData: () => Promise<void>;
};

export const AppContext = createContext<null | AppContextType>(null);

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  console.log("Backend URL:", backendUrl);
  const [doctors, setDoctors] = useState(docData);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);
  const getDoctorsData = async () => {};
  const loadUserProfileData = async () => {};

  // const getDoctorsData = async () => {
  //     try {
  //         const { data } = await axios.get(backendUrl + '/api/doctor/list')
  //         if (data.success) {
  //             setDoctors(data.doctors)
  //         } else {
  //             toast.error(data.message)
  //         }
  //     } catch (error: any) {
  //         console.log(error)
  //         toast.error(error.message)
  //     }
  // }

  // const loadUserProfileData = async () => {
  //     try {
  //         const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
  //             headers: { token }
  //         })

  //         if (data.success) {
  //             const safeUserData = {
  //                 ...data.userData,
  //                 address: data.userData.address || { line1: '', line2: '' },
  //                 gender: data.userData.gender || '',
  //                 dob: data.userData.dob || ''
  //             }
  //             setUserData(safeUserData)
  //         } else {
  //             toast.error(data.message)
  //         }
  //     } catch (error: any) {
  //         console.log(error)
  //         toast.error(error.message)
  //     }
  // }

  // useEffect(() => {
  //     getDoctorsData()
  // }, [])

  // useEffect(() => {
  //     if (token) {
  //         loadUserProfileData()
  //     }
  // }, [token])

  return (
    <AppContext.Provider
      value={{
        doctors,
        getDoctorsData,
        currencySymbol,
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        loadUserProfileData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

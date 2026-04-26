import { createContext } from "react";
import { doctors, type Doctors } from "../assets/assets_frontend/assets.ts";


export const AppContext = createContext<{ doctors: Doctors, currencySybmol: string }>({ doctors: [], currencySybmol: "$" });

export default function AppContextProvider({ children }: { children: React.ReactNode }) {
    const currencySybmol = "$";
    return (
        <AppContext.Provider value={{ doctors, currencySybmol }}>
            {children}
        </AppContext.Provider>
    )
}

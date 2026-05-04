import { CalendarRange } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { assets } from "@/assets/assets_frontend/assets";

export default function Navbar() {
  let navigate = useNavigate();
  const [token, setToken] = useState(true);

  return (
    <header className="flex py-2 border-b">
      <nav className="font-medium flex items-center text-sm gap-6 container">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-semibold mr-auto"
        >
          <CalendarRange className="size-6" />
          <span className="sr-only md:not-sr-only text-xl">HealthBridge</span>
        </div>
        <NavLink
          to={"/"}
          className="transition-colors text-muted-foreground hover:text-foreground"
        >
          Home
        </NavLink>
        <NavLink
          to={"/doctors"}
          className="transition-colors text-muted-foreground hover:text-foreground"
        >
          All Doctors
        </NavLink>
        <NavLink
          to={"/about"}
          className="transition-colors text-muted-foreground hover:text-foreground"
        >
          About
        </NavLink>
        <NavLink
          to={"/contact"}
          className="transition-colors text-muted-foreground hover:text-foreground"
        >
          Contact
        </NavLink>
        <div className="ml-auto">
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={assets.profile_pic}
                  className="w-8 rounded-full"
                  alt=""
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/my-appointments")}
                  >
                    Appointments
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setToken(false)}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/login")}>Create Account</Button>
          )}
        </div>
      </nav>
    </header>
  );
}

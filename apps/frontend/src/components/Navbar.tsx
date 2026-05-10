import { useQuery } from "@tanstack/react-query";
import { CalendarRange } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { UserProfile } from "@/pages/Profile";
import { useUserStore } from "@/state/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useUserStore();

  const { data } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const data = await api
        .get("user/get-profile")
        .json<{ success: boolean; user: UserProfile }>();
      return data.user;
    },
    enabled: isLoggedIn,
  });

  const handleLogout = async () => {
    try {
      await api.post("user/logout");
    } finally {
      logout();
      navigate("/");
      toast.success("Logged out successfully");
    }
  };

  return (
    <header className="py-2 border-b">
      <nav className="font-medium flex items-center justify-between text-sm  container">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-semibold"
        >
          <CalendarRange className="size-6" />
          <span className="sr-only md:not-sr-only text-xl">HealthBridge</span>
        </div>
        <div className="flex gap-6 items-center">
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
        </div>
        <div>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-8 cursor-pointer">
                  <AvatarImage src={data?.image ?? ""} alt={data?.name} />
                  <AvatarFallback>
                    {data?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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
                  <DropdownMenuItem onClick={handleLogout}>
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

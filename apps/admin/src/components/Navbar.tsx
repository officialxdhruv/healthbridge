import { CalendarRange } from "lucide-react";
import { useNavigate } from "react-router";
// import { assets } from "@/assets/assets_admin/assets";
import { useAuthStore } from "@/state/useAuthStore";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const { role, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex py-2 border-b">
      <nav className="font-medium flex items-center text-sm gap-6 container">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-semibold mr-auto"
        >
          <CalendarRange className="size-6" />
          <span className="sr-only md:not-sr-only text-xl">HealthBridge</span>
          <Badge variant={"outline"}>{role}</Badge>
        </div>

        <Button onClick={handleLogout}>Logout</Button>
      </nav>
    </header>
  );
};

export default Navbar;

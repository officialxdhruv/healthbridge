import {
  CalendarDays,
  Home,
  PlusSquare,
  UserRoundPlusIcon,
} from "lucide-react";
import { NavLink } from "react-router";
import { useAuthStore } from "@/state/useAuthStore";

const Sidebar = () => {
  const { role } = useAuthStore();

  return (
    <div className="h-full border-r">
      {role === "Admin" && (
        <ul className="mt-5">
          <NavLink
            to={"/admin-dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "border-r-4 border-primary" : ""}`
            }
          >
            <Home className="size-5" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            to={"/all-appointments"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? " border-r-4 border-primary" : ""}`
            }
          >
            <CalendarDays className="size-5" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>
          <NavLink
            to={"/add-doctor"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "border-r-4 border-primary" : ""}`
            }
          >
            <PlusSquare className="size-5" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>
          <NavLink
            to={"/doctor-list"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "border-r-4 border-primary" : ""}`
            }
          >
            <UserRoundPlusIcon className="size-5" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>
        </ul>
      )}

      {role === "Doctor" && (
        <ul className="mt-5">
          <NavLink
            to={"/doctor-dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "border-r-4 border-primary" : ""}`
            }
          >
            <Home className="size-5" />

            <p className="hidden md:block">Dashboard</p>
          </NavLink>
          <NavLink
            to={"/doctor-appointments"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "border-r-4 border-primary" : ""}`
            }
          >
            <CalendarDays className="size-5" />

            <p className="hidden md:block">Appointments</p>
          </NavLink>
          <NavLink
            to={"/doctor-profile"}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "border-r-4 border-primary" : ""}`
            }
          >
            <UserRoundPlusIcon className="size-5" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;

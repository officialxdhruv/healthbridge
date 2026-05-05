import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AddDoctor from "./pages/Admin/AddDoctor";
import AllAppointments from "./pages/Admin/AllAppointments";
import Dashboard from "./pages/Admin/Dashboard";
import DoctorList from "./pages/Admin/DoctorList";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import Login from "./pages/Login";
import { useAuthStore } from "./state/useAuthStore";

function App() {
  const { role } = useAuthStore();

  if (role === "Admin") {
    return (
      <React.Fragment>
        <Navbar />
        <div className="flex h-full items-start">
          <Sidebar />
          <div className="w-full h-full p-4">
            <Routes>
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/all-appointments" element={<AllAppointments />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/doctor-list" element={<DoctorList />} />
              <Route path="*" element={<Navigate to={"/admin-dashboard"} />} />
            </Routes>
          </div>
        </div>
      </React.Fragment>
    );
  }

  if (role === "Doctor") {
    return (
      <React.Fragment>
        <Navbar />
        <div className="flex h-full items-start">
          <Sidebar />
          <div className="w-full h-full p-4">
            <Routes>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route
                path="/doctor-appointments"
                element={<DoctorAppointments />}
              />
              <Route path="/doctor-profile" element={<DoctorProfile />} />
              <Route path="*" element={<Navigate to="/doctor-dashboard" />} />
            </Routes>
          </div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

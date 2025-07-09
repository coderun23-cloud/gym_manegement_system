import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import HomeAdmin from "./pages/admin/Home";
import Staff from "./pages/admin/Staff";
import Member from "./pages/admin/Member";
import Plan from "./pages/admin/Plan";
import Payment from "./pages/admin/Payment";
import Schedule from "./pages/admin/Schedule";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Home_Receptionist from "./pages/receptionist/Home";
import Payment_Receptionist from "./pages/receptionist/Payment";
import Schedule_Receptionist from "./pages/receptionist/Schedule";
import Profile from "../src/pages/auth/Profile";
import Home_Trainer from "./pages/trainer/Home";
import Attendance_Receptionist from "./pages/receptionist/Attendance";
import Home_Member from "./pages/member/Home";
import Attendance_Trainer from "./pages/trainer/Attendance";
import Schedule_Trainer from "./pages/trainer/Schedule";
import Schedule_Memeber from "./pages/member/Schedule";
import Payment_Member from "./pages/member/Payment";
import Attendance_Member from "./pages/member/Attendance";
import Attendance from "./pages/admin/Attendance";
import Attendance_Admin from "./pages/admin/Attendance";
function App() {
  const { user } = useContext(AppContext);
  const isAdmin = user.role === "admin";
  const isReceptionist = user.role === "receptionist";
  const isTrainer = user.role === "trainer";
  const isMemeber = user.role === "memeber";
  return (
    <>
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
        /**Authentication */
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        /** Admin */
        {isAdmin ? (
          <>
            <Route path="/index" index element={<HomeAdmin />} />
            <Route path="staff" element={<Staff />} />
            <Route path="/members" element={<Member />} />
            <Route path="/plans" element={<Plan />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="schedules" element={<Schedule />} />
            <Route path="/attendance" element={<Attendance />} />
          </>
        ) : (
          <Route path="login" element={<Login />} />
        )}
        {isReceptionist ? (
          <>
            <Route path="/index" index element={<Home_Receptionist />} />
            <Route
              path="/payment_receptionst"
              element={<Payment_Receptionist />}
            />
            <Route
              path="/schedule_receptionst"
              element={<Schedule_Receptionist />}
            />
            <Route
              path="/attendance_receptionst"
              element={<Attendance_Receptionist />}
            />
          </>
        ) : (
          <Route path="login" element={<Login />} />
        )}
        {isTrainer ? (
          <>
            <Route path="/index" index element={<Home_Trainer />} />
            <Route
              path="/attendance_trainer"
              element={<Attendance_Trainer />}
            />
            <Route path="/schedule_trainer" element={<Schedule_Trainer />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="schedules" element={<Schedule />} />
          </>
        ) : (
          <Route path="login" element={<Login />} />
        )}
        {isMemeber ? (
          <>
            <Route path="/index" index element={<Home_Member />} />
            <Route path="/attendance_memeber" element={<Attendance_Member />} />
            <Route path="/payment_memeber" element={<Payment_Member />} />
            <Route path="/schedule_memeber" element={<Schedule_Memeber />} />
          </>
        ) : (
          <Route path="login" element={<Login />} />
        )}
        <Route path="/account" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;

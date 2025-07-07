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
import MemberMangement from "./pages/receptionist/MemberMangement";
import Payment_Receptionist from "./pages/receptionist/Payment";
import Schedule_Receptionist from "./pages/receptionist/Schedule";
import Profile from "../src/pages/auth/Profile";
function App() {
  const { user } = useContext(AppContext);
  const isAdmin = user.role === "admin";
  const isReceptionist = user.role === "receptionist";
  const isTrainer = user.role === "trainer";
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
          </>
        ) : (
          <Route path="login" element={<Login />} />
        )}
        {isReceptionist ? (
          <>
            <Route path="/index" index element={<Home_Receptionist />} />
            <Route path="member_mangement" element={<MemberMangement />} />
            <Route
              path="/payment_receptionst"
              element={<Payment_Receptionist />}
            />
            <Route
              path="/schedule_receptionst"
              element={<Schedule_Receptionist />}
            />
          </>
        ) : (
          <Route path="login" element={<Login />} />
        )}
        {isAdmin ? (
          <>
            <Route path="/index" index element={<HomeAdmin />} />
            <Route path="staff" element={<Staff />} />
            <Route path="/members" element={<Member />} />
            <Route path="/plans" element={<Plan />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="schedules" element={<Schedule />} />
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

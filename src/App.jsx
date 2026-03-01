import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// COMPONENTS
import Header from "./components/Header";
import Footer from "./components/Footer"; // Footer logic resides here

// AUTH
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPasswordf from "./pages/ForgotPassword";

// MAIN APP
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import BookingConfirm from "./pages/BookingConfirm";

// LAUNDRY FLOW
import MachinesAvailability from "./pages/MachinesAvailability";
import Bookingsuccess from "./pages/Bookingsuccess";
import ClothType from "./pages/ClothType";

import AddToCart from "./pages/AddToCart";
import WeightSelection from "./pages/WeightSelection";
import AvailableSlots from "./pages/AvailableSlots";

// ADMIN
import AdminHome from "./pages/Adminpages/AdminHome";
import AddLaundryBranch from "./pages/Adminpages/AddLaundryBranch";
import AddMachine from "./pages/Adminpages/AddMachine";
import AddDetergent from "./pages/Adminpages/AddDetergent";
import UpdatePrice from "./pages/Adminpages/UpdatePrice";
import AdminProfile from "./pages/Adminpages/AdminProfile";
import AdminRoute from "./routes/AdminRoute"; // Protected admin route
import AdminLayout from "./pages/Adminpages/AdminLayout"; // Admin layout

// Layout Component
const MainLayout = () => {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      {/* AUTH ROUTES (No Header/Footer) */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordf />} />

      {/* MAIN APP ROUTES (With Header/Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/confirm" element={<BookingConfirm />} />

        {/* LAUNDRY FLOW */}
        <Route path="/available-machines" element={<MachinesAvailability />} />
        <Route path="/success" element={<Bookingsuccess />} />
        <Route path="/weight" element={<WeightSelection />} />
        <Route path="/cloth-type" element={<ClothType />} />
        <Route path="/available-slots" element={<AvailableSlots />} />

        <Route path="/cart" element={<AddToCart />} />

      </Route>

      {/* ADMIN ROUTES (With AdminHeader/AdminFooter) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="add-branch" element={<AddLaundryBranch />} />
        <Route path="add-machine" element={<AddMachine />} />
        <Route path="add-detergent" element={<AddDetergent />} />
        <Route path="update-price" element={<UpdatePrice />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}

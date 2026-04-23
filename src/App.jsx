import { Routes, Route, Navigate } from "react-router-dom";
import 'leaflet/dist/leaflet.css';

// LAYOUTS
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// PROTECTOR
import { BookingProvider } from "./context/BookingContext";

// AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// USER FLOW
import MapPage from "./pages/user/MapPage";
import MachineDate from "./pages/user/MachineDate";
import TimeAvailability from "./pages/user/TimeAvailability";
import ClothType from "./pages/user/ClothType";
import Detergent from "./pages/user/Detergent";
import MachineDetail from "./pages/user/MachineDetail";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import BookingConfirmation from "./pages/user/BookingConfirmation";
import Reservations from "./pages/user/Reservations";
import Notifications from "./pages/user/Notifications";
import Profile from "./pages/user/Profile";

// ADMIN PAGES
import Dashboard from "./pages/admin/Dashboard";
import BranchOverview from "./pages/admin/BranchOverview";
import AddLaundry from "./pages/admin/AddLaundry";
import AddMachine from "./pages/admin/AddMachine";
import MachineManagement from "./pages/admin/MachineManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminNotifications from "./pages/admin/AdminNotifications";

export default function App() {
  console.log("App: Rendering...");
  return (
    <BookingProvider>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        
        {/* User Protected Flow */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<MapPage />} />
          <Route path="/machine-date" element={<MachineDate />} />
          <Route path="/time-availability" element={<TimeAvailability />} />
          <Route path="/cloth-type" element={<ClothType />} />
          <Route path="/detergent" element={<Detergent />} />
          <Route path="/machine-detail" element={<MachineDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Protected Flow */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="branch-overview" element={<BranchOverview />} />
          <Route path="add-laundry" element={<AddLaundry />} />
          <Route path="add-machine" element={<AddMachine />} />
          <Route path="machines" element={<MachineManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BookingProvider>
  );
}

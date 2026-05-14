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
import MachineType from "./pages/user/MachineType";
import ClothType from "./pages/user/ClothType";
import MachineSelection from "./pages/user/MachineSelection";
import MapPage from "./pages/user/MapPage";
import TimeAvailability from "./pages/user/TimeAvailability";
import Detergent from "./pages/user/Detergent";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import BookingConfirmation from "./pages/user/BookingConfirmation";
import MachineDate from "./pages/user/MachineDate";
import MachineDetail from "./pages/user/MachineDetail";
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
import AddMachineProgram from "./pages/admin/AddMachineProgram";
import MachineProgramManagement from "./pages/admin/MachineProgramManagement";
import UserManagement from "./pages/admin/UserManagement";
import Ratings from "./pages/admin/Ratings";
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
          <Route path="/machine-type" element={<MachineType />} />
          <Route path="/cloth-type" element={<ClothType />} />
          <Route path="/machine-selection" element={<MachineSelection />} />
          <Route path="/home" element={<MapPage />} />
          <Route path="/time-availability" element={<TimeAvailability />} />
          <Route path="/detergent" element={<Detergent />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Keep these for now but they aren't in the main flow */}
          <Route path="/machine-date" element={<MachineDate />} />
          <Route path="/machine-detail" element={<MachineDetail />} />
        </Route>

        {/* Admin Protected Flow */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="branch-overview" element={<BranchOverview />} />
          <Route path="add-laundry" element={<AddLaundry />} />
          <Route path="edit-laundry/:id" element={<AddLaundry />} />
          <Route path="add-machine" element={<AddMachine />} />
          <Route path="machines" element={<MachineManagement />} />
          <Route path="add-machine-program" element={<AddMachineProgram />} />
          <Route path="machine-programs" element={<MachineProgramManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="ratings" element={<Ratings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BookingProvider>
  );
}

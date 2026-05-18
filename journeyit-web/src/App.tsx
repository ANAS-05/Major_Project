import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ProfilePage from "@/pages/ProfilePage";
import HotelsPage from "@/pages/HotelsPage";
import HotelsDiscoveryPage from "@/pages/HotelsDiscoveryPage";
import HotelDetailPage from "@/pages/HotelDetailPage";
import ChatPage from "@/pages/ChatPage";
import FlightsPage from "@/pages/FlightsPage";
import FlightDetailPage from "@/pages/FlightDetailPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/flights/:id" element={<FlightDetailPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/hotels/discover" element={<HotelsDiscoveryPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

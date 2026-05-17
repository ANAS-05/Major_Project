import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import LandingPage from "@/pages/LandingPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";

function FlightsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Flights Page — coming next
    </div>
  );
}

function HotelsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Hotels Page — coming next
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

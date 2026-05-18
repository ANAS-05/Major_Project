import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plane,
  Clock,
  ArrowLeft,
  Home,
  Share2,
  Heart,
  MoreHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Luggage,
  Utensils,
  Wifi,
  Armchair,
  Loader2,
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { isAuthenticated } from "@/lib/api";
import { IATA_CITY_MAP } from "@/data/mockFlights";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

interface FlightData {
  airline: string;
  flight_number: string;
  departure: string | null;
  arrival: string | null;
  status: string;
  price: number;
  duration: number;
  stops: number;
  ai_score: number;
  ai_tag: string;
  ai_explanation: string;
  recommended: boolean;
}

interface RouteInfo {
  fromIata: string;
  toIata: string;
  date: string;
}

const defaultFlight: FlightData = {
  airline: "IndiGo",
  flight_number: "6E-123",
  departure: "08:00",
  arrival: "10:30",
  status: "scheduled",
  price: 4500,
  duration: 2.5,
  stops: 0,
  ai_score: 92,
  ai_tag: "Best Deal",
  ai_explanation: "AI's top pick — best overall value on this route",
  recommended: true,
};

const defaultRoute: RouteInfo = {
  fromIata: "HYD",
  toIata: "BOM",
  date: new Date().toISOString().split("T")[0],
};

const baggageOptions = [
  {
    label: "Cabin Only",
    cabin: "7 kg",
    checkIn: "—",
    priceModifier: 0,
  },
  {
    label: "Cabin + 15kg Check-in",
    cabin: "7 kg",
    checkIn: "15 kg",
    priceModifier: 800,
  },
  {
    label: "Cabin + 25kg Check-in",
    cabin: "7 kg",
    checkIn: "25 kg",
    priceModifier: 1400,
  },
];

const defaultAmenities = [
  { icon: Wifi, label: "In-flight WiFi", description: "Stay connected above the clouds" },
  { icon: Utensils, label: "Meals", description: "Complimentary snacks & beverages" },
  { icon: Armchair, label: "Extra Legroom", description: "Available on select seats" },
  { icon: Luggage, label: "Priority Baggage", description: "First off the carousel" },
];

export default function FlightDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const flight: FlightData = location.state?.flight || defaultFlight;
  const route: RouteInfo = location.state?.route || defaultRoute;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [travelClass, setTravelClass] = useState("Economy");
  const [passengers, setPassengers] = useState("1");
  const [baggageIndex, setBaggageIndex] = useState(0);
  const [booking, setBooking] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const fromCity = IATA_CITY_MAP[route.fromIata] || route.fromIata;
  const toCity = IATA_CITY_MAP[route.toIata] || route.toIata;

  const classMultiplier =
    travelClass === "Business" ? 3.5 : travelClass === "Premium Economy" ? 1.8 : 1;

  const baseFare = Math.round(flight.price * classMultiplier);
  const baggageFee = baggageOptions[baggageIndex].priceModifier;
  const taxes = Math.round(baseFare * 0.12);
  const convenienceFee = 350;
  const totalPerPerson = baseFare + baggageFee + taxes + convenienceFee;
  const total = totalPerPerson * parseInt(passengers, 10);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const stopsLabel = (stops: number) => {
    if (stops === 0) return "Non-stop";
    if (stops === 1) return "1 Stop";
    return `${stops} Stops`;
  };

  const handleBookNow = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    setBooking("loading");
    setBookingError(null);

    // Simulate booking call — replace with real API when available
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setBooking("success");
    setBookingRef(
      `JI-${flight.airline.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <Link to="/" className="hover:text-foreground transition-colors">
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <Link to="/flights" className="hover:text-foreground transition-colors">
            Flights
          </Link>
          <span>/</span>
          <span className="text-foreground">{flight.airline} {flight.flight_number}</span>
        </motion.div>

        {/* Back Button (Mobile) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 lg:hidden"
        >
          <Link to="/flights">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ArrowLeft className="size-4 mr-2" />
              Back to Flights
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {flight.airline} {flight.flight_number}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs border-border">
                  {travelClass}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span className="text-sm">{fromCity} → {toCity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{flight.duration}h</span>
                </div>
                <Badge
                  className={cn(
                    "text-xs border-0",
                    flight.status === "scheduled"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  )}
                >
                  {flight.status === "scheduled" ? "On Time" : "Delayed"}
                </Badge>
                {flight.ai_tag && (
                  <Badge className="bg-primary/10 text-primary border-0 text-xs">
                    <Sparkles className="size-3 mr-1" />
                    {flight.ai_tag}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full border-border">
                <Share2 className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full border-border",
                  isFavorite && "text-destructive"
                )}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={cn("size-4", isFavorite && "fill-destructive")} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-border">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Left Column — Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Timeline Card */}
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Departure */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {flight.departure || "--:--"}
                    </div>
                    <div className="text-sm font-medium text-foreground mt-0.5">{fromCity}</div>
                    <div className="text-xs text-muted-foreground">{route.fromIata}</div>
                  </div>

                  {/* Middle: Timeline */}
                  <div className="flex-1 mx-6">
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <div className="flex flex-col items-center">
                        <Plane className="size-5 text-primary rotate-90" />
                        <span className="text-[10px] text-muted-foreground mt-1">
                          {stopsLabel(flight.stops)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {flight.duration}h
                        </span>
                      </div>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {flight.arrival || "--:--"}
                    </div>
                    <div className="text-sm font-medium text-foreground mt-0.5">{toCity}</div>
                    <div className="text-xs text-muted-foreground">{route.toIata}</div>
                  </div>
                </div>

                {/* Date */}
                <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <span>{route.date}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className={cn(
                  "border transition-all duration-300",
                  flight.recommended
                    ? "border-primary shadow-md ring-1 ring-primary"
                    : "border-border shadow-sm"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <TrendingUp className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">AI Price Insights</h3>
                      <p className="text-xs text-muted-foreground">Powered by JourneyIt ML models</p>
                    </div>
                    <div className="ml-auto">
                      <Badge
                        className={cn(
                          "text-xs border-0",
                          flight.ai_score >= 90
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        Score {flight.ai_score}/100
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {flight.ai_explanation}
                  </p>

                  {flight.recommended && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 p-3">
                      <Star className="size-4 text-primary fill-primary" />
                      <span className="text-sm font-medium text-foreground">
                        AI's Top Recommendation
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        Best value on this route
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Baggage & Fare Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-4">Baggage Allowance</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {baggageOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBaggageIndex(idx)}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-all duration-200",
                      baggageIndex === idx
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{opt.label}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">Cabin: {opt.cabin}</p>
                      <p className="text-xs text-muted-foreground">Check-in: {opt.checkIn}</p>
                    </div>
                    {opt.priceModifier > 0 && (
                      <p className="mt-2 text-xs font-medium text-primary">
                        +{formatPrice(opt.priceModifier)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-4">What this flight offers</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {defaultAmenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <amenity.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{amenity.label}</p>
                      <p className="text-xs text-muted-foreground">{amenity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fare Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-4">Fare Rules</h2>
              <div className="relative">
                <div
                  className={cn(
                    "space-y-3 text-sm text-muted-foreground",
                    !isExpanded && "line-clamp-3"
                  )}
                >
                  <p>
                    • Cancellation: Free cancellation within 24 hours of booking. After that, a cancellation fee of ₹1,500 per passenger applies.
                  </p>
                  <p>
                    • Rescheduling: Changes allowed up to 2 hours before departure. Rescheduling fee of ₹1,000 + fare difference applies.
                  </p>
                  <p>
                    • No-show: If you do not show up for your flight, the entire fare is forfeited.
                  </p>
                  <p>
                    • Refund: Refunds are processed within 7-10 business days to the original payment method.
                  </p>
                  <p>
                    • Check-in: Online check-in opens 48 hours before departure and closes 2 hours before departure.
                  </p>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm font-medium text-primary hover:underline mt-2 inline-flex items-center gap-1"
                >
                  {isExpanded ? "Show less" : "Read More"}
                  {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column — Booking Card */}
          <div className="lg:col-span-1">
            <Card className="h-fit border border-border shadow-lg sticky top-24">
              <CardContent className="p-6 space-y-6">
                {/* Booking Success */}
                {booking === "success" && bookingRef && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
                    <CheckCircle2 className="size-8 text-primary mx-auto" />
                    <h3 className="font-semibold text-foreground">Booking Confirmed!</h3>
                    <p className="text-sm text-muted-foreground">Your booking reference:</p>
                    <p className="text-lg font-bold text-primary">{bookingRef}</p>
                    <p className="text-xs text-muted-foreground">
                      You will receive a confirmation email shortly.
                    </p>
                    <Button
                      className="w-full mt-2"
                      variant="outline"
                      onClick={() => setBooking("idle")}
                    >
                      Book Another
                    </Button>
                  </div>
                )}

                {/* Booking Form */}
                {booking !== "success" && (
                  <>
                    {/* Price */}
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">
                          {formatPrice(totalPerPerson)}
                        </span>
                        <span className="text-muted-foreground">/person</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {fromCity} → {toCity} · {flight.duration}h · {stopsLabel(flight.stops)}
                      </p>
                    </div>

                    {/* Error */}
                    {bookingError && (
                      <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm">
                        <AlertCircle className="size-4 shrink-0" />
                        {bookingError}
                      </div>
                    )}

                    {/* Travel Class */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Travel Class</label>
                      <Select value={travelClass} onValueChange={setTravelClass}>
                        <SelectTrigger className="h-10">
                          <Plane className="mr-2 size-4 text-muted-foreground" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Economy", "Premium Economy", "Business"].map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Passengers */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Passengers</label>
                      <Select value={passengers} onValueChange={setPassengers}>
                        <SelectTrigger className="h-10">
                          <Users className="mr-2 size-4 text-muted-foreground" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["1", "2", "3", "4"].map((n) => (
                            <SelectItem key={n} value={n}>
                              {n} {n === "1" ? "Passenger" : "Passengers"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Book Button */}
                    <Button
                      className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleBookNow}
                      disabled={booking === "loading"}
                    >
                      {booking === "loading" ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        "Book Now"
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      You won&apos;t be charged yet
                    </p>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base fare ({travelClass})</span>
                        <span>{formatPrice(baseFare)}</span>
                      </div>
                      {baggageFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Baggage add-on</span>
                          <span>{formatPrice(baggageFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes & fees (12%)</span>
                        <span>{formatPrice(taxes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Convenience fee</span>
                        <span>{formatPrice(convenienceFee)}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Similar Flights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-6">Other options on this route</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                airline: "Air India",
                flight_number: "AI-456",
                departure: "10:30",
                arrival: "13:00",
                duration: 2.5,
                stops: 0,
                price: Math.round(flight.price * 1.15),
                ai_score: 84,
                ai_tag: "Good Value",
              },
              {
                airline: "Vistara",
                flight_number: "UK-789",
                departure: "14:15",
                arrival: "17:00",
                duration: 2.75,
                stops: 1,
                price: Math.round(flight.price * 0.95),
                ai_score: 78,
                ai_tag: "Fair Price",
              },
              {
                airline: "SpiceJet",
                flight_number: "SG-321",
                departure: "06:00",
                arrival: "08:15",
                duration: 2.25,
                stops: 0,
                price: Math.round(flight.price * 0.88),
                ai_score: 81,
                ai_tag: "Early Bird",
              },
            ].map((f, i) => (
              <motion.div
                key={f.flight_number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="group overflow-hidden border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Plane className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{f.airline}</p>
                          <p className="text-xs text-muted-foreground">{f.flight_number}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-0"
                      >
                        <Sparkles className="size-2.5 mr-1" />
                        {f.ai_tag}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <div className="text-base font-bold text-foreground">{f.departure}</div>
                        <div className="text-[10px] text-muted-foreground">{route.fromIata}</div>
                      </div>
                      <div className="flex-1 mx-3">
                        <div className="flex items-center justify-center gap-1">
                          <div className="h-px flex-1 bg-border" />
                          <Plane className="size-3 text-muted-foreground rotate-90" />
                          <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="text-center mt-0.5">
                          <span className="text-[10px] text-muted-foreground">
                            {f.duration}h · {f.stops === 0 ? "Direct" : `${f.stops} Stop`}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-base font-bold text-foreground">{f.arrival}</div>
                        <div className="text-[10px] text-muted-foreground">{route.toIata}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="size-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground">Score {f.ai_score}</span>
                      </div>
                      <span className="text-lg font-bold text-primary">{formatPrice(f.price)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

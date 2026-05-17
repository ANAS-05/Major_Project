import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  MapPin,
  Star,
  Share2,
  Heart,
  MoreHorizontal,
  BedDouble,
  Bath,
  Users,
  Wifi,
  Car,
  Coffee,
  Waves,
  Utensils,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Home,
  ArrowLeft,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  createHotelBooking,
  isAuthenticated,
} from "@/lib/api";
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

interface HotelData {
  name: string;
  price: number;
  rating: number;
  address: string;
  photo_url: string;
  ai_score: number;
  tag: string;
  recommended: boolean;
}

const defaultHotel: HotelData = {
  name: "Hotel",
  price: 5000,
  rating: 4.0,
  address: "India",
  photo_url: "",
  ai_score: 50,
  tag: "",
  recommended: false,
};

const defaultAmenities = [
  { icon: Wifi, label: "High-speed WiFi", description: "Free throughout the property" },
  { icon: Car, label: "Free parking", description: "Secure on-site parking available" },
  { icon: Coffee, label: "Breakfast included", description: "Complimentary breakfast buffet" },
  { icon: Waves, label: "Swimming pool", description: "Pool with city views" },
  { icon: Utensils, label: "Restaurant", description: "Multi-cuisine dining options" },
  { icon: Dumbbell, label: "Fitness center", description: "24/7 gym with modern equipment" },
];

const defaultReviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    date: "December 2024",
    review: "Absolutely stunning property! The service is impeccable and the view from the room was spectacular.",
  },
  {
    id: 2,
    name: "Priya Patel",
    rating: 5,
    date: "November 2024",
    review: "One of the best hotel experiences I've ever had. The staff went above and beyond to make our stay special.",
  },
  {
    id: 3,
    name: "Arjun Reddy",
    rating: 4,
    date: "October 2024",
    review: "Beautiful property with amazing architecture. The room was spacious and well-maintained. Great stay overall.",
  },
];

const defaultSimilarHotels = [
  {
    id: "2",
    name: "Nearby Hotel",
    location: "India",
    rating: 4.0,
    price: 4500,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "City Center Suites",
    location: "India",
    rating: 4.2,
    price: 6200,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Executive Inn",
    location: "India",
    rating: 3.8,
    price: 3200,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
  },
];

export default function HotelDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hotel: HotelData = location.state?.hotel || defaultHotel;
  const city: string = location.state?.city || "India";

  const [isExpanded, setIsExpanded] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [booking, setBooking] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const defaultPhoto = "https://images.unsplash.com/photo-1566073129273-cebf9db75ef4?w=800&h=600&fit=crop";
  const photoUrl = hotel.photo_url || defaultPhoto;
  const hotelImages = [
    photoUrl,
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
  ];

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    }
    return 1;
  };

  const nights = calculateNights();
  const subtotal = hotel.price * nights * rooms;
  const discount = Math.round(subtotal * 0.1);
  const serviceFee = 0;
  const total = subtotal - discount + serviceFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBookNow = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setBookingError("Please select check-in and check-out dates");
      return;
    }

    setBooking("loading");
    setBookingError(null);

    try {
      const result = await createHotelBooking({
        hotel_name: hotel.name,
        hotel_city: city,
        hotel_address: hotel.address,
        hotel_photo_url: hotel.photo_url || undefined,
        room_type: "Standard",
        check_in_date: format(checkInDate, "yyyy-MM-dd"),
        check_out_date: format(checkOutDate, "yyyy-MM-dd"),
        number_of_guests: adults + children,
        price_per_night: hotel.price,
        total_amount: total,
        guest_name: "Guest",
        guest_email: "guest@example.com",
        guest_phone: "9999999999",
      });
      setBooking("success");
      setBookingRef(result.booking_reference);
    } catch (err) {
      setBooking("error");
      setBookingError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    }
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
          <Link to="/hotels" className="hover:text-foreground transition-colors">
            Hotels
          </Link>
          <span>/</span>
          <span className="text-foreground">{hotel.name}</span>
        </motion.div>

        {/* Back Button (Mobile) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 lg:hidden"
        >
          <Link to="/hotels">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ArrowLeft className="size-4 mr-2" />
              Back to Hotels
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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{hotel.name}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs border-border">
                  Hotel
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span className="text-sm">{hotel.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-3.5 fill-primary text-primary" />
                  <span className="text-sm font-medium text-foreground">{hotel.rating}</span>
                </div>
                {hotel.tag && (
                  <Badge className="bg-primary/10 text-primary border-0 text-xs">
                    {hotel.tag}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full border-border">
                <Share2 className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full border-border ${isFavorite ? "text-destructive" : ""}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`size-4 ${isFavorite ? "fill-destructive" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-border">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Image + Booking Card Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Left Column - Image + Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
              <img
                src={photoUrl}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Room Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                About this property
              </Badge>
              <div className="relative">
                <p
                  className={`text-sm text-muted-foreground leading-relaxed ${
                    !isExpanded ? "line-clamp-3" : ""
                  }`}
                >
                  Welcome to {hotel.name}, located in {hotel.address}. Experience comfort and luxury with world-class
                  amenities, spacious rooms, and exceptional hospitality. Whether you're traveling for business or leisure,
                  our property offers everything you need for a perfect stay. Enjoy high-speed WiFi, complimentary breakfast,
                  a swimming pool with stunning views, and a fully-equipped fitness center.
                </p>
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

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="h-full border border-border shadow-lg">
              <CardContent className="p-6 space-y-6">
                {/* Booking Success State */}
                {booking === "success" && bookingRef && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
                    <CheckCircle2 className="size-8 text-primary mx-auto" />
                    <h3 className="font-semibold text-foreground">Booking Confirmed!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your booking reference is:
                    </p>
                    <p className="text-lg font-bold text-primary">{bookingRef}</p>
                    <p className="text-xs text-muted-foreground">
                      You will receive a confirmation email shortly.
                    </p>
                    <Button
                      className="w-full mt-2"
                      variant="outline"
                      onClick={() => setBooking("idle")}
                    >
                      Make Another Booking
                    </Button>
                  </div>
                )}

                {/* Booking Form */}
                {booking !== "success" && (
                  <>
                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-foreground">
                        {formatPrice(hotel.price)}
                      </span>
                      <span className="text-muted-foreground">/night</span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {nights} Night{nights > 1 ? "s" : ""} in {hotel.name}
                    </div>

                    {/* Error Message */}
                    {bookingError && (
                      <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm">
                        <AlertCircle className="size-4 shrink-0" />
                        {bookingError}
                      </div>
                    )}

                    {/* Date Selection */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Check in</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal h-10",
                                !checkInDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {checkInDate ? (
                                format(checkInDate, "MMM dd, yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={checkInDate}
                              onSelect={setCheckInDate}
                              autoFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Check out</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal h-10",
                                !checkOutDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {checkOutDate ? (
                                format(checkOutDate, "MMM dd, yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={checkOutDate}
                              onSelect={setCheckOutDate}
                              autoFocus
                              disabled={(date) => date <= (checkInDate || new Date())}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Guests</label>
                      <Popover open={guestPopoverOpen} onOpenChange={setGuestPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-10"
                          >
                            <Users className="mr-2 size-4" />
                            <span>{adults} Adult{adults > 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}</span>
                            <span className="ml-auto text-muted-foreground">{rooms} Room{rooms > 1 ? "s" : ""}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0" align="start">
                          <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-foreground">Adults</p>
                                <p className="text-xs text-muted-foreground">Ages 13+</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-8 rounded-full"
                                  disabled={adults <= 1}
                                  onClick={() => setAdults((p) => Math.max(1, p - 1))}
                                >
                                  <ChevronDown className="size-4" />
                                </Button>
                                <span className="w-6 text-center text-sm font-medium text-foreground">{adults}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-8 rounded-full"
                                  disabled={adults >= 10}
                                  onClick={() => setAdults((p) => Math.min(10, p + 1))}
                                >
                                  <ChevronUp className="size-4" />
                                </Button>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-foreground">Children</p>
                                <p className="text-xs text-muted-foreground">Ages 2-12</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-8 rounded-full"
                                  disabled={children <= 0}
                                  onClick={() => setChildren((p) => Math.max(0, p - 1))}
                                >
                                  <ChevronDown className="size-4" />
                                </Button>
                                <span className="w-6 text-center text-sm font-medium text-foreground">{children}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-8 rounded-full"
                                  disabled={children >= 10}
                                  onClick={() => setChildren((p) => Math.min(10, p + 1))}
                                >
                                  <ChevronUp className="size-4" />
                                </Button>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-foreground">Rooms</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-8 rounded-full"
                                  disabled={rooms <= 1}
                                  onClick={() => setRooms((p) => Math.max(1, p - 1))}
                                >
                                  <ChevronDown className="size-4" />
                                </Button>
                                <span className="w-6 text-center text-sm font-medium text-foreground">{rooms}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-8 rounded-full"
                                  disabled={rooms >= 10}
                                  onClick={() => setRooms((p) => Math.min(10, p + 1))}
                                >
                                  <ChevronUp className="size-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-border p-3">
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => setGuestPopoverOpen(false)}
                            >
                              Apply
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
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
                        <span className="text-muted-foreground">
                          {formatPrice(hotel.price)} x {nights} night{nights > 1 ? "s" : ""}{rooms > 1 ? ` x ${rooms} rooms` : ""}
                        </span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600">
                        <span className="text-muted-foreground">10% campaign discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service fee</span>
                        <span>{formatPrice(serviceFee)}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total before taxes</span>
                      <span className="font-semibold text-foreground">{formatPrice(total)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Hotel Details */}
        <div className="space-y-8">
          {/* Entire Hotel Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Property Details</h2>
            <div className="flex items-center gap-6 text-muted-foreground mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span className="text-sm">2 Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="size-4" />
                <span className="text-sm">1 Bedroom</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="size-4" />
                <span className="text-sm">1 Private bath</span>
              </div>
            </div>

            <Separator className="my-6" />
          </motion.div>

          {/* What this place offers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">What this place offers</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultAmenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
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

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Reviews
              </h2>
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-primary text-primary" />
                <span className="font-semibold text-foreground">{hotel.rating}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {defaultReviews.map((review) => (
                <Card key={review.id} className="border border-border bg-card">
                  <CardContent className="p-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-foreground truncate">{review.name}</h4>
                        <span className="text-xs text-muted-foreground shrink-0">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${
                              i < review.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                        {review.review}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotelImages.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${hotel.name} ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Similar Places */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-xl font-bold text-foreground mb-6">Similar places</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {defaultSimilarHotels.map((h, i) => (
              <motion.div
                key={h.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="group overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={h.image}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{h.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="size-3.5 fill-primary text-primary" />
                          <span className="text-sm text-muted-foreground">{h.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{h.location}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(h.price)}
                        </span>
                        <span className="text-xs text-muted-foreground">/night</span>
                      </div>
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
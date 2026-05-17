import { useState } from "react";
import { Link } from "react-router-dom";
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

// Mock data for hotel details
const hotelDetails = {
  id: 1,
  name: "Taj Falaknuma Palace",
  location: "Falaknuma, Hyderabad",
  category: "Resort",
  rating: 4.9,
  reviews: 328,
  price: 18500,
  guests: 2,
  bedrooms: 1,
  beds: 1,
  baths: 1,
  sqft: 450,
  description: "Experience ultimate comfort in our Single Restore Room, designed to offer tranquility and rejuvenation. Whether you're traveling for business or leisure, this room provides the perfect space to relax and recharge. The palace offers breathtaking views of the city and world-class hospitality that has been refined over decades.",
  host: {
    name: "Taj Hotels",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    joined: "Joined in 2003",
  },
  coHost: {
    name: "Rajesh Kumar",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    joined: "Joined in 2018",
  },
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
  ],
  amenities: [
    { icon: Wifi, label: "High-speed WiFi", description: "Free throughout the property" },
    { icon: Car, label: "Free parking", description: "Secure on-site parking available" },
    { icon: Coffee, label: "Breakfast included", description: "Complimentary breakfast buffet" },
    { icon: Waves, label: "Swimming pool", description: "Infinity pool with city views" },
    { icon: Utensils, label: "Restaurant", description: "Multi-cuisine dining options" },
    { icon: Dumbbell, label: "Fitness center", description: "24/7 gym with modern equipment" },
  ],
  features: [],
  reviewsList: [
    {
      id: 1,
      name: "Rahul Sharma",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "December 2024",
      review: "Absolutely stunning property! The palace is breathtaking and the service is impeccable. The view from the room was spectacular. Highly recommend for a luxury getaway.",
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "November 2024",
      review: "One of the best hotel experiences I've ever had. The staff went above and beyond to make our anniversary special. The food at the restaurant was world-class.",
    },
    {
      id: 3,
      name: "Arjun Reddy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      date: "October 2024",
      review: "Beautiful property with amazing architecture. The room was spacious and well-maintained. Only minor issue was the slow WiFi in some areas, but overall a great stay.",
    },
    {
      id: 4,
      name: "Ananya Kumar",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "September 2024",
      review: "Perfect for a family vacation! The kids loved the pool and the historical tour of the palace. The breakfast buffet had so many options. Will definitely come back!",
    },
  ],
};

// Similar hotels
const similarHotels = [
  {
    id: 2,
    name: "ITC Kohenur",
    location: "HITEC City, Hyderabad",
    rating: 4.8,
    price: 12000,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "The Park Hyderabad",
    location: "Somajiguda, Hyderabad",
    rating: 4.6,
    price: 7500,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Leonia Resort",
    location: "Bommalaramaram, Hyderabad",
    rating: 4.7,
    price: 9500,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
  },
];

export default function HotelDetailPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date(2024, 10, 15));
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date(2024, 11, 20));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const hotel = hotelDetails; // In real app, fetch by id

  // Calculate nights between dates
  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    }
    return 5;
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
                  {hotel.category}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span className="text-sm">{hotel.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-3.5 fill-primary text-primary" />
                  <span className="text-sm font-medium text-foreground">{hotel.rating}</span>
                  <span className="text-sm text-muted-foreground">({hotel.reviews} reviews)</span>
                </div>
                {/* User avatars */}
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="size-6 rounded-full border-2 border-background bg-muted"
                    />
                  ))}
                </div>
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
                src={hotel.images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Room Description - Inside left container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Room Description
              </Badge>
              <div className="relative">
                <p
                  className={`text-sm text-muted-foreground leading-relaxed ${
                    !isExpanded ? "line-clamp-3" : ""
                  }`}
                >
                  {hotel.description}
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

          {/* Booking Card - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card className="h-full border border-border shadow-lg">
              <CardContent className="p-6 space-y-6">
                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {formatPrice(hotel.price)}
                  </span>
                  <span className="text-muted-foreground">/night</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  {nights} Nights in {hotel.name}
                </div>

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
                <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90">
                  Book Now
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You won&apos;t be charged yet
                </p>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {formatPrice(hotel.price)} × {nights} nights{rooms > 1 ? ` × ${rooms} rooms` : ""}
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

                <button className="text-xs text-muted-foreground hover:text-foreground underline">
                  Report this listing
                </button>
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
            <h2 className="text-xl font-bold text-foreground mb-4">Entire Hotel Details</h2>
            <div className="flex items-center gap-6 text-muted-foreground mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span className="text-sm">{hotel.guests} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="size-4" />
                <span className="text-sm">{hotel.bedrooms} Bedroom</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="size-4" />
                <span className="text-sm">{hotel.baths} Private bath</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Hosts */}
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Hosted by</p>
                <div className="flex items-center gap-3">
                  <img
                    src={hotel.host.image}
                    alt={hotel.host.name}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{hotel.host.name}</p>
                    <p className="text-xs text-muted-foreground">{hotel.host.joined}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Co-Hosts</p>
                <div className="flex items-center gap-3">
                  <img
                    src={hotel.coHost.image}
                    alt={hotel.coHost.name}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{hotel.coHost.name}</p>
                    <p className="text-xs text-muted-foreground">{hotel.coHost.joined}</p>
                  </div>
                </div>
              </div>
            </div>
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
              {hotel.amenities.map((amenity, index) => (
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
                Reviews ({hotel.reviews})
              </h2>
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-primary text-primary" />
                <span className="font-semibold text-foreground">{hotel.rating}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {hotel.reviewsList.map((review) => (
                <Card key={review.id} className="border border-border bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="size-12 rounded-full object-cover"
                      />
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="mt-6 w-full sm:w-auto border-border">
              Show all {hotel.reviews} reviews
            </Button>
          </motion.div>

          {/* Gallery - Remaining Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotel.images.slice(1).map((image, index) => (
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
            {similarHotels.map((hotel, i) => (
              <motion.div
                key={hotel.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link to={`/hotels/${hotel.id}`}>
                  <Card className="group overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">{hotel.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="size-3.5 fill-primary text-primary" />
                            <span className="text-sm text-muted-foreground">{hotel.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{hotel.location}</p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(hotel.price)}
                          </span>
                          <span className="text-xs text-muted-foreground">/night</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  MapPin,
  Users,
  BedDouble,
  Bath,
  Square,
  Heart,
  Star,
  Search,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const categories = ["All", "Hotel", "Resort", "Apartment", "Villa"];

// Hyderabad hotels data
const hotels = [
  {
    id: 1,
    name: "Taj Falaknuma Palace",
    location: "Falaknuma, Hyderabad",
    category: "Hotel",
    guests: 2,
    beds: 1,
    baths: 1,
    sqft: 450,
    rating: 4.9,
    price: 18500,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    name: "ITC Kohenur",
    location: "HITEC City, Hyderabad",
    category: "Hotel",
    guests: 2,
    beds: 1,
    baths: 1,
    sqft: 420,
    rating: 4.8,
    price: 12000,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    name: "The Park Hyderabad",
    location: "Somajiguda, Hyderabad",
    category: "Hotel",
    guests: 2,
    beds: 1,
    baths: 1,
    sqft: 380,
    rating: 4.6,
    price: 7500,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Leonia Holistic Destination",
    location: "Bommalaramaram, Hyderabad",
    category: "Resort",
    guests: 4,
    beds: 2,
    baths: 2,
    sqft: 650,
    rating: 4.7,
    price: 9500,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Novotel Hyderabad Airport",
    location: "Shamshabad, Hyderabad",
    category: "Hotel",
    guests: 2,
    beds: 1,
    baths: 1,
    sqft: 350,
    rating: 4.5,
    price: 6200,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Golkonda Resort & Spa",
    location: "Gandipet, Hyderabad",
    category: "Resort",
    guests: 2,
    beds: 1,
    baths: 1,
    sqft: 480,
    rating: 4.4,
    price: 5800,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Trident Hyderabad",
    location: "HITEC City, Hyderabad",
    category: "Hotel",
    guests: 2,
    beds: 1,
    baths: 1,
    sqft: 400,
    rating: 4.8,
    price: 9800,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
  },
  {
    id: 8,
    name: "Hyatt Place Hyderabad",
    location: "Banjara Hills, Hyderabad",
    category: "Hotel",
    guests: 2,
    beds: 1,
    baths: 1,
    sqft: 360,
    rating: 4.5,
    price: 6800,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
  },
  {
    id: 9,
    name: "Oakwood Residence",
    location: "Financial District, Hyderabad",
    category: "Apartment",
    guests: 3,
    beds: 1,
    baths: 1,
    sqft: 520,
    rating: 4.6,
    price: 7200,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
  },
];

const guestOptions = [
  { value: "1", label: "1 Guest" },
  { value: "2", label: "2 Guests" },
  { value: "3", label: "3 Guests" },
  { value: "4", label: "4 Guests" },
];

export default function HotelsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState("2");

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredHotels = hotels.filter((hotel) => {
    const matchesCategory = activeCategory === "All" || hotel.category === activeCategory;
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      {/* ───────────── HERO SECTION ───────────── */}
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=800&fit=crop"
            alt="Luxury Resort"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative w-full mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge
              variant="secondary"
              className="mb-4 h-7 px-3 text-xs font-medium bg-white/10 border border-white/20 text-white backdrop-blur-sm"
            >
              <Star className="size-3 mr-1.5" />
              10,000+ Happy Stays
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.2]">
              Unwind in Stunning Resorts,
              <br />
              <span className="text-emerald-400">Stay in Elegant Hotels.</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
              Discover handpicked stays across Hyderabad that blend luxury and comfort for your perfect getaway.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 mx-auto max-w-4xl"
            >
              <Card className="border-0 shadow-2xl bg-white">
                <CardContent className="p-4">
                  <div className="grid gap-3 sm:grid-cols-5 items-center">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Where to?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 pl-10 border-input"
                      />
                    </div>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-11",
                              !checkInDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkInDate ? (
                              format(checkInDate, "MMM dd")
                            ) : (
                              <span>Check in</span>
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-11",
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {checkOutDate ? (
                              format(checkOutDate, "MMM dd")
                            ) : (
                              <span>Check out</span>
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
                    <div>
                      <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger className="h-11">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {guestOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      size="lg"
                      className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                    >
                      <Search className="size-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───────────── HOTELS LISTING ───────────── */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Where Comfort Meets Convenience
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover handpicked stays that blend luxury and practicality
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              <Filter className="size-4 mr-2" />
              Filters
            </Button>
          </motion.div>

          {/* Hotels Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((hotel, i) => (
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
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(hotel.id);
                        }}
                        className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm hover:bg-background transition-colors"
                      >
                        <Heart
                          className={`size-4 ${
                            favorites.includes(hotel.id)
                              ? "fill-destructive text-destructive"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      {/* Category Badge */}
                      <Badge
                        variant="secondary"
                        className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm text-foreground border-0"
                      >
                        {hotel.category}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      {/* Hotel Info */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="size-3.5" />
                          <span className="text-sm">{hotel.location}</span>
                        </div>

                        {/* Specs */}
                        <div className="flex items-center gap-3 text-muted-foreground py-2">
                          <div className="flex items-center gap-1">
                            <Users className="size-3.5" />
                            <span className="text-xs">{hotel.guests} Guests</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BedDouble className="size-3.5" />
                            <span className="text-xs">{hotel.beds} Beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="size-3.5" />
                            <span className="text-xs">{hotel.baths} Baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="size-3.5" />
                            <span className="text-xs">{hotel.sqft} ft²</span>
                          </div>
                        </div>

                        {/* Rating & Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-center gap-1">
                            <Star className="size-4 fill-primary text-primary" />
                            <span className="text-sm font-medium text-foreground">{hotel.rating}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-primary">
                              {formatPrice(hotel.price)}
                            </span>
                            <span className="text-xs text-muted-foreground">/night</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredHotels.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="flex justify-center mb-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                  <MapPin className="size-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">No hotels found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

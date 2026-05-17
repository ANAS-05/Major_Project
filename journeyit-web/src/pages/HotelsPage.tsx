import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  MapPin,
  Users,
  Star,
  Search,
  Calendar,
  Filter,
  Loader2,
  AlertCircle,
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
import { searchHotels, type HotelSearchResult } from "@/lib/api";
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

const guestOptions = [
  { value: "1", label: "1 Guest" },
  { value: "2", label: "2 Guests" },
  { value: "3", label: "3 Guests" },
  { value: "4", label: "4 Guests" },
];

interface HotelItem {
  name: string;
  price: number;
  rating: number;
  address: string;
  photo_url: string;
  ai_score: number;
  tag: string;
  recommended: boolean;
}

export default function HotelsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState("2");
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCity, setSearchedCity] = useState<string>("Hyderabad");

  const handleSearch = async () => {
    const city = searchQuery.trim() || "Hyderabad";
    setSearchedCity(city);
    setLoading(true);
    setError(null);
    try {
      const result: HotelSearchResult = await searchHotels(city);
      setHotels(result.hotels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search hotels");
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter((hotel) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Hotel") return !hotel.name.toLowerCase().includes("resort") && !hotel.name.toLowerCase().includes("apartment") && !hotel.name.toLowerCase().includes("villa");
    return hotel.name.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

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
              Search hotels across Indian cities with AI-powered recommendations and trust scores.
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
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="size-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="size-4 mr-2" />
                      )}
                      {loading ? "Searching..." : "Search"}
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
              {hotels.length > 0 ? `Hotels in ${searchedCity}` : "Where Comfort Meets Convenience"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {hotels.length > 0
                ? `${hotels.length} hotels found — AI-ranked by value`
                : "Search a city above to find the best hotel deals"}
            </p>
          </motion.div>

          {/* Error State */}
          {error && (
            <div className="mb-8 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="size-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Searching hotels...</span>
            </div>
          )}

          {/* Category Filter */}
          {!loading && hotels.length > 0 && (
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
          )}

          {/* Hotels Grid */}
          {!loading && hotels.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHotels.map((hotel, i) => {
                const hotelId = encodeURIComponent(hotel.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                const isFav = favorites.includes(i);
                const defaultPhoto = `https://images.unsplash.com/photo-1566073129273-cebf9db75ef4?auto=format&fit=crop&w=600&q=80`;
                const photoUrl = hotel.photo_url || defaultPhoto;
                const category = hotel.name.toLowerCase().includes("resort")
                  ? "Resort"
                  : hotel.name.toLowerCase().includes("apartment")
                  ? "Apartment"
                  : hotel.name.toLowerCase().includes("villa")
                  ? "Villa"
                  : "Hotel";

                return (
                  <motion.div
                    key={hotel.name}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <Link to={`/hotels/${hotelId}`} state={{ hotel }}>
                      <Card className="group overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={photoUrl}
                            alt={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(i);
                            }}
                            className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm hover:bg-background transition-colors"
                          >
                            <Star
                              className={`size-4 ${
                                isFav
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
                            {category}
                          </Badge>
                          {/* AI Score Badge */}
                          {hotel.tag && (
                            <Badge
                              className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 text-xs"
                            >
                              {hotel.tag}
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-foreground line-clamp-1">
                              {hotel.name}
                            </h3>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="size-3.5" />
                              <span className="text-sm line-clamp-1">{hotel.address}</span>
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
                );
              })}
            </div>
          )}

          {/* Empty State - No search yet */}
          {!loading && hotels.length === 0 && !error && (
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
              <h3 className="text-lg font-semibold text-foreground">Search for hotels</h3>
              <p className="text-muted-foreground mt-1">
                Enter a city name above and click Search to find the best deals
              </p>
            </motion.div>
          )}

          {/* Empty State - Search returned no results */}
          {!loading && hotels.length > 0 && filteredHotels.length === 0 && (
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
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  Clock,
  Users,
  Search,
  Loader2,
  AlertCircle,
  ArrowRightLeft,
  Star,
  Sparkles,
  TrendingUp,
  Filter,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { searchFlights, type FlightSearchResult } from "@/lib/api";
import {
  AVAILABLE_FLIGHT_CITIES,
  POPULAR_ROUTES,
  IATA_CITY_MAP,
} from "@/data/mockFlights";
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

const stopFilters = ["All", "Direct", "1 Stop", "2+ Stops"];
const sortOptions = [
  { value: "ai_score", label: "AI Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "duration", label: "Duration: Shortest" },
];

export default function FlightsPage() {
  const [fromIata, setFromIata] = useState("HYD");
  const [toIata, setToIata] = useState("BOM");
  const [departDate, setDepartDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 86400000));
  const [passengers, setPassengers] = useState("1");
  const [travelClass, setTravelClass] = useState("Economy");

  const [flights, setFlights] = useState<FlightSearchResult["flights"]>([]);
  const [routeLabel, setRouteLabel] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const [activeStopFilter, setActiveStopFilter] = useState("All");
  const [sortBy, setSortBy] = useState("ai_score");

  const handleSearch = async () => {
    if (!fromIata || !toIata || !departDate) return;
    if (fromIata === toIata) {
      setError("Origin and destination cannot be the same.");
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const result = await searchFlights({
        from_iata: fromIata,
        to_iata: toIata,
        date: format(departDate, "yyyy-MM-dd"),
      });
      setFlights(result.flights);
      setRouteLabel(result.route);
      setSearchDate(result.date);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search flights");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFromIata(toIata);
    setToIata(fromIata);
  };

  const handlePopularRoute = (from: string, to: string) => {
    setFromIata(from);
    setToIata(to);
    setDepartDate(new Date(Date.now() + 7 * 86400000));
    // Trigger search after state updates (use a small timeout)
    setTimeout(() => {
      handleSearch();
    }, 50);
  };

  const filteredFlights = flights
    .filter((f) => {
      if (activeStopFilter === "All") return true;
      if (activeStopFilter === "Direct") return f.stops === 0;
      if (activeStopFilter === "1 Stop") return f.stops === 1;
      if (activeStopFilter === "2+ Stops") return f.stops >= 2;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "duration") return a.duration - b.duration;
      return b.ai_score - a.ai_score; // ai_score desc
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const stopsLabel = (stops: number) => {
    if (stops === 0) return "Direct";
    if (stops === 1) return "1 Stop";
    return `${stops} Stops`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ───────────── HERO SECTION ───────────── */}
      <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=800&fit=crop"
            alt="Airplane wing view"
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
              <Sparkles className="size-3 mr-1.5" />
              AI-Powered Flight Search
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.2]">
              Find the Best Flights,
              <br />
              <span className="text-primary">Predicted by AI.</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
              Search domestic flights across India with ML-driven price insights and smart recommendations.
            </p>

            {/* Search Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 mx-auto max-w-5xl"
            >
              <Card className="border-0 shadow-2xl bg-white">
                <CardContent className="p-4">
                  <div className="grid gap-3 sm:grid-cols-6 items-center">
                    {/* From */}
                    <div className="sm:col-span-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block text-left">
                        From
                      </label>
                      <Select value={fromIata} onValueChange={setFromIata}>
                        <SelectTrigger className="h-11">
                          <PlaneTakeoff className="mr-2 size-4 text-muted-foreground" />
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_FLIGHT_CITIES.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Swap */}
                    <div className="hidden sm:flex items-center justify-center pt-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSwap}
                        className="h-8 w-8 rounded-full hover:bg-muted"
                      >
                        <ArrowRightLeft className="size-4 text-muted-foreground" />
                      </Button>
                    </div>

                    {/* To */}
                    <div className="sm:col-span-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block text-left">
                        To
                      </label>
                      <Select value={toIata} onValueChange={setToIata}>
                        <SelectTrigger className="h-11">
                          <PlaneLanding className="mr-2 size-4 text-muted-foreground" />
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_FLIGHT_CITIES.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date */}
                    <div className="sm:col-span-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block text-left">
                        Departure
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-11",
                              !departDate && "text-muted-foreground"
                            )}
                          >
                            <Clock className="mr-2 size-4 text-muted-foreground" />
                            {departDate ? format(departDate, "MMM dd") : <span>Date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={departDate}
                            onSelect={setDepartDate}
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Passengers */}
                    <div className="sm:col-span-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block text-left">
                        Travelers
                      </label>
                      <Select value={passengers} onValueChange={setPassengers}>
                        <SelectTrigger className="h-11">
                          <Users className="mr-2 size-4 text-muted-foreground" />
                          <SelectValue placeholder="Passengers" />
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

                    {/* Class */}
                    <div className="sm:col-span-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block text-left">
                        Class
                      </label>
                      <Select value={travelClass} onValueChange={setTravelClass}>
                        <SelectTrigger className="h-11">
                          <Plane className="mr-2 size-4 text-muted-foreground" />
                          <SelectValue placeholder="Class" />
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
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      size="lg"
                      className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="size-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="size-4 mr-2" />
                      )}
                      {loading ? "Searching..." : "Search Flights"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───────────── RESULTS SECTION ───────────── */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          {searched && flights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Flights {routeLabel && <span className="text-primary">{routeLabel}</span>}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {searchDate && format(new Date(searchDate), "EEEE, MMMM d, yyyy")}
                {" · "}
                {flights.length} flights found — AI-ranked by value
              </p>
            </motion.div>
          )}

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
              <span className="ml-3 text-muted-foreground">Searching flights...</span>
            </div>
          )}

          {/* Filters & Sort */}
          {!loading && searched && flights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            >
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {stopFilters.map((filter) => (
                  <Button
                    key={filter}
                    variant={activeStopFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveStopFilter(filter)}
                    className={cn(
                      "rounded-full px-4",
                      activeStopFilter === filter
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Filter className="size-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 w-[180px] text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Flight Cards */}
          {!loading && searched && flights.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFlights.map((flight, i) => (
                <motion.div
                  key={`${flight.airline}-${flight.flight_number}-${i}`}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link
                    to={`/flights/${flight.airline.toLowerCase().replace(/\s+/g, "-")}-${flight.flight_number.toLowerCase()}`}
                    state={{
                      flight,
                      route: {
                        fromIata,
                        toIata,
                        date: searchDate,
                      },
                    }}
                  >
                    <Card
                      className={cn(
                        "group overflow-hidden border transition-all duration-300 cursor-pointer",
                        flight.recommended
                          ? "border-primary shadow-md ring-1 ring-primary"
                          : "border-border bg-card shadow-sm hover:shadow-md hover:border-primary/30"
                      )}
                    >
                      {/* Top: Airline + AI Badge */}
                      <div className="relative px-5 pt-5 pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Plane className="size-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm">
                                {flight.airline}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {flight.flight_number}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            {flight.recommended && (
                              <Badge className="bg-primary text-primary-foreground border-0 text-[10px] px-2 py-0.5">
                                <Star className="size-2.5 mr-1 fill-primary-foreground" />
                                Top Pick
                              </Badge>
                            )}
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px] px-2 py-0.5 border-0",
                                flight.ai_score >= 90
                                  ? "bg-primary/10 text-primary"
                                  : flight.ai_score >= 80
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <Sparkles className="size-2.5 mr-1" />
                              {flight.ai_tag}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Route Timeline */}
                      <CardContent className="px-5 pb-4 pt-0">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground">
                              {flight.departure || "--:--"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {IATA_CITY_MAP[fromIata]?.split(" ")[0] || fromIata}
                            </div>
                          </div>

                          <div className="flex-1 mx-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-px flex-1 bg-border" />
                              <Plane className="size-4 text-muted-foreground rotate-90" />
                              <div className="h-px flex-1 bg-border" />
                            </div>
                            <div className="text-center mt-1">
                              <span className="text-[10px] text-muted-foreground">
                                {flight.duration}h · {stopsLabel(flight.stops)}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground">
                              {flight.arrival || "--:--"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {IATA_CITY_MAP[toIata]?.split(" ")[0] || toIata}
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border my-4" />

                        {/* Bottom: Price + AI Score + CTA */}
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <TrendingUp className="size-3.5 text-primary" />
                              <span className="text-xs font-medium text-foreground">
                                AI Score {flight.ai_score}/100
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug max-w-[180px]">
                              {flight.ai_explanation}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(flight.price)}
                            </div>
                            <span className="text-[10px] text-muted-foreground">per person</span>
                          </div>
                        </div>

                        {/* Book Button */}
                        <div className="mt-4">
                          <Button
                            className={cn(
                              "w-full h-10 text-sm font-medium",
                              flight.recommended
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                            onClick={(e) => e.preventDefault()}
                          >
                            {flight.recommended ? "Book Best Deal" : "Select Flight"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State — No search yet */}
          {!searched && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="flex justify-center mb-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                  <Plane className="size-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Ready for takeoff?
              </h3>
              <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                Enter your origin, destination, and travel dates above to find AI-ranked flights.
              </p>
            </motion.div>
          )}

          {/* Empty State — Search returned no results */}
          {searched && !loading && flights.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="flex justify-center mb-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                  <Plane className="size-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">No flights found</h3>
              <p className="text-muted-foreground mt-1">
                Try different dates or routes to find available flights.
              </p>
            </motion.div>
          )}

          {/* Empty State — Filters returned nothing */}
          {searched && !loading && flights.length > 0 && filteredFlights.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="flex justify-center mb-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                  <Filter className="size-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No flights match your filters
              </h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting the stop filter to see more results.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ───────────── POPULAR ROUTES ───────────── */}
      {!searched && !loading && (
        <section className="border-y border-border bg-card py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Popular Routes
              </h2>
              <p className="mt-2 text-muted-foreground">
                Quick search trending domestic routes across India
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {POPULAR_ROUTES.map((route, i) => (
                <motion.div
                  key={route.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Card
                    className="border border-border bg-background shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer"
                    onClick={() => handlePopularRoute(route.from, route.to)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="size-3.5 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {IATA_CITY_MAP[route.from]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="size-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {IATA_CITY_MAP[route.to]}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          {route.label}
                        </span>
                        <Plane className="size-4 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

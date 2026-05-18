import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Heart,
  List,
  Map as MapIcon,
  X,
  LocateFixed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AVAILABLE_CITIES, getMockCity } from "@/data/mockCities";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Leaflet imports (dynamic import for SSR safety)
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ── Fix Leaflet default marker icons ──
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// ── Custom marker icon with primary color ──
const createCustomIcon = (isActive: boolean) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 32px; 
      height: 32px; 
      background: ${isActive ? "#10b981" : "#0f172a"}; 
      border: 3px solid white; 
      border-radius: 50% 50% 50% 0; 
      transform: rotate(-45deg); 
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex; 
      align-items: center; 
      justify-content: center;
      transition: all 0.2s;
    ">
      <span style="
        color: white; 
        font-size: 11px; 
        font-weight: bold; 
        transform: rotate(45deg);
      ">₹</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

// ── Map center component ──
function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13, { animate: true });
  return null;
}

// ── Use mock data from data layer ──
interface HotelData {
  id: number;
  name: string;
  location: string;
  category: string;
  guests: number;
  beds: number;
  baths: number;
  sqft: number;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  lat: number;
  lng: number;
  tag: string | null;
}

// Convert mock data to the format needed for this component
function getHotelsForCity(cityValue: string): HotelData[] {
  const city = getMockCity(cityValue);
  if (!city) return [];
  
  return city.hotels.map((hotel, index) => ({
    id: index + 1,
    name: hotel.name,
    location: hotel.address,
    category: hotel.category || "Hotel",
    guests: hotel.guests || 2,
    beds: hotel.beds || 1,
    baths: hotel.baths || 1,
    sqft: hotel.sqft || 400,
    rating: hotel.rating,
    reviews: hotel.reviews || Math.floor(Math.random() * 500) + 100,
    price: hotel.price,
    lat: hotel.lat || city.center.lat + (Math.random() - 0.5) * 0.1,
    lng: hotel.lng || city.center.lng + (Math.random() - 0.5) * 0.1,
    image: hotel.photo_url,
    tag: hotel.tag || null,
  }));
}

const categories = ["All", "Hotel", "Resort", "Apartment"];

export default function HotelsDiscoveryPage() {
  const [selectedCity, setSelectedCity] = useState("hyderabad");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeHotelId, setActiveHotelId] = useState<number | null>(null);
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const cityData = getMockCity(selectedCity);
  const hotelsData = getHotelsForCity(selectedCity);
  const defaultCenter: [number, number] = cityData
    ? [cityData.center.lat, cityData.center.lng]
    : [20.5937, 78.9629];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  const filteredHotels = hotelsData.filter((hotel) =>
    activeCategory === "All" ? true : hotel.category === activeCategory
  );

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleMarkerClick = useCallback((hotel: HotelData) => {
    setActiveHotelId(hotel.id);
    setMapCenter([hotel.lat, hotel.lng]);

    // Scroll to card in list
    const cardEl = cardRefs.current.get(hotel.id);
    if (cardEl && listRef.current) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleCardClick = useCallback((hotel: HotelData) => {
    setActiveHotelId(hotel.id);
    setMapCenter([hotel.lat, hotel.lng]);
    if (window.innerWidth < 1024) {
      setShowMapOnMobile(true);
    }
  }, []);

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

      {/* ── Page Header ── */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Discover Hotels
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {filteredHotels.length} properties in {cityData?.displayName || selectedCity}
                </p>
              </div>
              {/* City Selector */}
              <Select value={selectedCity} onValueChange={(val) => {
                setSelectedCity(val);
                setActiveHotelId(null);
                const newCity = getMockCity(val);
                if (newCity) {
                  setMapCenter([newCity.center.lat, newCity.center.lng]);
                }
              }}>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <LocateFixed className="size-3.5 mr-2 text-primary" />
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value} className="text-xs">
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Category Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "rounded-full text-xs px-3 h-8",
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {/* Mobile View Toggle */}
              <div className="flex lg:hidden border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3 rounded-none text-xs",
                    !showMapOnMobile && "bg-muted text-foreground"
                  )}
                  onClick={() => setShowMapOnMobile(false)}
                >
                  <List className="size-3.5 mr-1" />
                  List
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3 rounded-none text-xs",
                    showMapOnMobile && "bg-muted text-foreground"
                  )}
                  onClick={() => setShowMapOnMobile(true)}
                >
                  <MapIcon className="size-3.5 mr-1" />
                  Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Split Screen Layout ── */}
      <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-7rem)]">
        {/* Left: Hotel List */}
        <div
          ref={listRef}
          className={cn(
            "w-full lg:w-[45%] xl:w-[40%] overflow-y-auto bg-background p-4 space-y-4",
            showMapOnMobile ? "hidden lg:block" : "block"
          )}
        >
          {filteredHotels.map((hotel, i) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              ref={(el) => {
                if (el) cardRefs.current.set(hotel.id, el);
              }}
            >
              <Card
                className={cn(
                  "group overflow-hidden border cursor-pointer transition-all duration-300",
                  activeHotelId === hotel.id
                    ? "border-primary ring-1 ring-primary shadow-md"
                    : "border-border bg-card shadow-sm hover:shadow-md hover:border-primary/30"
                )}
                onClick={() => handleCardClick(hotel)}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-40 h-48 sm:h-auto shrink-0 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => toggleFavorite(e, hotel.id)}
                      className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm hover:bg-background transition-colors"
                    >
                      <Heart
                        className={cn(
                          "size-3.5",
                          favorites.includes(hotel.id)
                            ? "fill-destructive text-destructive"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                    {hotel.tag && (
                      <Badge className="absolute bottom-2 left-2 bg-primary/90 text-primary-foreground border-0 text-[10px]">
                        {hotel.tag}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="size-3.5 fill-primary text-primary" />
                          <span className="text-xs font-medium text-foreground">
                            {hotel.rating}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            ({hotel.reviews})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                        <MapPin className="size-3" />
                        <span className="text-xs">{hotel.location}</span>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                        <span className="text-[10px]">{hotel.guests} Guests</span>
                        <span className="text-[10px]">{hotel.beds} Beds</span>
                        <span className="text-[10px]">{hotel.sqft} ft²</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-3 pt-3 border-t border-border">
                      <div>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(hotel.price)}
                        </span>
                        <span className="text-xs text-muted-foreground"> / night</span>
                      </div>
                      <Link
                        to={`/hotels/${hotel.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Right: Map */}
        <div
          className={cn(
            "fixed inset-0 z-40 lg:static lg:z-auto lg:flex-1 bg-muted",
            showMapOnMobile ? "block" : "hidden lg:block"
          )}
        >
          {/* Mobile close button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 z-[1000] lg:hidden rounded-full shadow-lg"
            onClick={() => setShowMapOnMobile(false)}
          >
            <X className="size-4" />
          </Button>

          <MapContainer
            center={defaultCenter}
            zoom={12}
            scrollWheelZoom={true}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapCenter center={mapCenter} />

            {filteredHotels.map((hotel) => (
              <Marker
                key={hotel.id}
                position={[hotel.lat, hotel.lng]}
                icon={createCustomIcon(activeHotelId === hotel.id)}
                eventHandlers={{
                  click: () => handleMarkerClick(hotel),
                }}
              >
                <Popup className="hotel-popup">
                  <div className="min-w-[200px]">
                    <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-background/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                        <Star className="size-3 fill-primary text-primary" />
                        <span className="text-[10px] font-medium">{hotel.rating}</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3" />
                      {hotel.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(hotel.price)}
                        <span className="text-[10px] text-muted-foreground font-normal">/night</span>
                      </span>
                      <Link to={`/hotels/${hotel.id}`}>
                        <Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* ── Leaflet CSS Overrides for theme consistency ── */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: var(--card) !important;
          color: var(--card-foreground) !important;
          border-radius: var(--radius-lg) !important;
          border: 1px solid var(--border) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
        .leaflet-popup-tip {
          background: var(--card) !important;
          border: 1px solid var(--border) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          padding: 12px !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: var(--muted-foreground) !important;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: var(--foreground) !important;
        }
        .leaflet-control-attribution {
          font-size: 9px !important;
          background: rgba(255,255,255,0.8) !important;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-marker-icon {
          transition: transform 0.2s ease;
        }
      `}</style>

      <Footer />
    </div>
  );
}

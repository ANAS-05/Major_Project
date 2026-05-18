/**
 * Mock Flight Data for JourneyIt
 * ===============================
 * Fallback data when backend is unavailable.
 * Covers popular Indian domestic routes.
 */

export interface MockFlight {
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

export interface RouteData {
  route: string;
  date: string;
  flights: MockFlight[];
}

const AIRLINES = [
  { airline: "IndiGo", code: "6E", stops: 0 },
  { airline: "Air India", code: "AI", stops: 0 },
  { airline: "Vistara", code: "UK", stops: 1 },
  { airline: "SpiceJet", code: "SG", stops: 0 },
  { airline: "AirAsia", code: "I5", stops: 1 },
  { airline: "Akasa Air", code: "QP", stops: 0 },
];

function generateMockFlightsForRoute(_from: string, _to: string, baseDuration: number): MockFlight[] {
  const flights: MockFlight[] = [];
  const pool = [...AIRLINES];

  for (let i = 0; i < pool.length; i++) {
    const tmpl = pool[i];
    const duration = round(baseDuration + tmpl.stops * 0.75 + (Math.random() * 0.3 - 0.1), 1);
    const daysLeft = Math.max(14 - i * 2, 1);
    const basePrice = 2500 + (tmpl.stops * 500) + (duration * 800) + Math.random() * 3000;
    const price = Math.round(basePrice * (1 + daysLeft * 0.02));

    const depHour = 6 + i * 3 + Math.floor(Math.random() * 2);
    const arrHour = (depHour + Math.ceil(duration) + Math.floor(Math.random() * 2)) % 24;

    const depTime = `${String(depHour).padStart(2, "0")}:${Math.random() > 0.5 ? "00" : "30"}`;
    const arrTime = `${String(arrHour).padStart(2, "0")}:${Math.random() > 0.5 ? "00" : "30"}`;

    const onTime = Math.random() > 0.15;
    const scoreRaw = Math.min(100, Math.max(50, 100 - (price / 150) - (duration * 8) - (tmpl.stops * 12) + (onTime ? 10 : -5)));
    const displayScore = Math.round(scoreRaw);

    let tag: string;
    let expl: string;
    if (displayScore >= 90) {
      tag = "Best Deal";
      expl = "AI's top pick — best overall value on this route";
    } else if (displayScore >= 80) {
      tag = "Good Value";
      expl = "Solid balance of price and convenience";
    } else if (displayScore >= 70) {
      tag = "Fair Price";
      expl = "Reasonable for the route and timing";
    } else {
      tag = "Check Alternatives";
      expl = "Consider other options for better value";
    }

    flights.push({
      airline: tmpl.airline,
      flight_number: `${tmpl.code}-${100 + i * 111}`,
      departure: depTime,
      arrival: arrTime,
      status: onTime ? "scheduled" : "delayed",
      price,
      duration,
      stops: tmpl.stops,
      ai_score: displayScore,
      ai_tag: tag,
      ai_explanation: expl,
      recommended: false,
    });
  }

  flights.sort((a, b) => b.ai_score - a.ai_score);
  if (flights.length > 0) {
    flights[0].recommended = true;
    flights[0].ai_tag = "Best Deal";
    flights[0].ai_explanation = "AI's top pick — best overall value on this route";
  }

  return flights;
}

function round(n: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

// ─── City ↔ IATA mapping ─────────────────────
export const CITY_IATA_MAP: Record<string, string> = {
  hyderabad: "HYD",
  mumbai: "BOM",
  delhi: "DEL",
  bangalore: "BLR",
  chennai: "MAA",
  goa: "GOI",
  kolkata: "CCU",
  pune: "PNQ",
  ahmedabad: "AMD",
};

export const IATA_CITY_MAP: Record<string, string> = {
  HYD: "Hyderabad",
  BOM: "Mumbai",
  DEL: "Delhi",
  BLR: "Bangalore",
  MAA: "Chennai",
  GOI: "Goa",
  CCU: "Kolkata",
  PNQ: "Pune",
  AMD: "Ahmedabad",
};

// ─── Route durations (hours) ───────────────────
const ROUTE_DURATION: Record<string, number> = {
  "DEL-BOM": 2.2, "BOM-DEL": 2.2,
  "DEL-BLR": 2.8, "BLR-DEL": 2.8,
  "DEL-MAA": 2.8, "MAA-DEL": 2.8,
  "DEL-HYD": 2.3, "HYD-DEL": 2.3,
  "DEL-CCU": 2.3, "CCU-DEL": 2.3,
  "BOM-BLR": 1.5, "BLR-BOM": 1.5,
  "BOM-MAA": 1.8, "MAA-BOM": 1.8,
  "BOM-HYD": 1.5, "HYD-BOM": 1.5,
  "BOM-CCU": 2.5, "CCU-BOM": 2.5,
  "BLR-MAA": 1.1, "MAA-BLR": 1.1,
  "BLR-HYD": 1.2, "HYD-BLR": 1.2,
  "HYD-GOI": 1.3, "GOI-HYD": 1.3,
  "DEL-GOI": 2.2, "GOI-DEL": 2.2,
  "HYD-MAA": 1.4, "MAA-HYD": 1.4,
  "BLR-GOI": 1.3, "GOI-BLR": 1.3,
  "BOM-GOI": 1.2, "GOI-BOM": 1.2,
  "DEL-PNQ": 2.0, "PNQ-DEL": 2.0,
  "BOM-PNQ": 0.8, "PNQ-BOM": 0.8,
  "BLR-PNQ": 1.4, "PNQ-BLR": 1.4,
};

// ─── Popular routes list ──────────────────────
export const POPULAR_ROUTES = [
  { from: "HYD", to: "BOM", label: "Hyderabad → Mumbai" },
  { from: "DEL", to: "BOM", label: "Delhi → Mumbai" },
  { from: "DEL", to: "BLR", label: "Delhi → Bangalore" },
  { from: "BOM", to: "DEL", label: "Mumbai → Delhi" },
  { from: "BLR", to: "MAA", label: "Bangalore → Chennai" },
  { from: "HYD", to: "DEL", label: "Hyderabad → Delhi" },
  { from: "BOM", to: "GOI", label: "Mumbai → Goa" },
  { from: "DEL", to: "MAA", label: "Delhi → Chennai" },
  { from: "BLR", to: "HYD", label: "Bangalore → Hyderabad" },
  { from: "MAA", to: "DEL", label: "Chennai → Delhi" },
];

// ─── Available cities for dropdowns ─────────────
export const AVAILABLE_FLIGHT_CITIES = [
  { value: "HYD", label: "Hyderabad" },
  { value: "BOM", label: "Mumbai" },
  { value: "DEL", label: "Delhi" },
  { value: "BLR", label: "Bangalore" },
  { value: "MAA", label: "Chennai" },
  { value: "GOI", label: "Goa" },
  { value: "CCU", label: "Kolkata" },
  { value: "PNQ", label: "Pune" },
  { value: "AMD", label: "Ahmedabad" },
];

// ─── Generate mock result for a route ─────────
export function getMockFlightSearchResult(fromIata: string, toIata: string, date?: string): RouteData {
  const routeKey = `${fromIata}-${toIata}`;
  const baseDuration = ROUTE_DURATION[routeKey] || 2.0;
  const flights = generateMockFlightsForRoute(fromIata, toIata, baseDuration);

  return {
    route: `${fromIata} → ${toIata}`,
    date: date || new Date().toISOString().split("T")[0],
    flights,
  };
}

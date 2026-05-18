import { getMockHotelSearchResult } from "@/data/mockCities";
import { getMockFlightSearchResult } from "@/data/mockFlights";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getToken(): string | null {
  return localStorage.getItem("access_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API error: ${res.status}`);
  }
  return res.json();
}

// ─── Auth ───────────────────────────────────

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    email_verified: boolean;
    is_active: boolean;
    created_at: string | null;
  };
}

export async function register(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  localStorage.setItem("access_token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);
  localStorage.setItem("user", JSON.stringify(result.user));
  return result;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  localStorage.setItem("access_token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);
  localStorage.setItem("user", JSON.stringify(result.user));
  return result;
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("No refresh token");
  const result = await apiFetch<{ access_token: string; refresh_token: string }>(
    "/auth/refresh",
    {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }
  );
  localStorage.setItem("access_token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);
  return result.access_token;
}

export async function getProfile() {
  return apiFetch<AuthResponse["user"]>("/auth/me");
}

export async function updateProfile(data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  return apiFetch<AuthResponse["user"]>("/auth/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function getStoredUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ─── Hotel Search ──────────────────────────

export interface HotelSearchResult {
  city: string;
  hotels: {
    name: string;
    price: number;
    rating: number;
    address: string;
    photo_url: string;
    ai_score: number;
    tag: string;
    recommended: boolean;
  }[];
  source: string;
}

export async function searchHotels(city: string): Promise<HotelSearchResult> {
  try {
    return await apiFetch<HotelSearchResult>("/search-hotels", {
      method: "POST",
      body: JSON.stringify({ city }),
    });
  } catch {
    // Fallback to mock data when backend is unavailable
    return getMockHotelSearchResult(city);
  }
}

export interface SearchApiHotelResult {
  success: boolean;
  city: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  total_results: number;
  properties: Record<string, unknown>[];
  source: string;
}

export async function searchHotelsSearchApi(data: {
  city: string;
  check_in_date?: string;
  check_out_date?: string;
  adults?: number;
}): Promise<SearchApiHotelResult> {
  try {
    return await apiFetch<SearchApiHotelResult>("/search-hotels-searchapi", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    const mockResult = getMockHotelSearchResult(data.city);
    return {
      success: true,
      city: mockResult.city,
      check_in_date: data.check_in_date || new Date().toISOString().split("T")[0],
      check_out_date: data.check_out_date || new Date(Date.now() + 86400000).toISOString().split("T")[0],
      adults: data.adults || 2,
      total_results: mockResult.hotels.length,
      properties: mockResult.hotels.map((h) => ({
        name: h.name,
        price: h.price,
        rating: h.rating,
        address: h.address,
        photo_url: h.photo_url,
      })),
      source: "mock_data",
    };
  }
}

// ─── Hotel Bookings ─────────────────────────

export interface CreateHotelBookingRequest {
  hotel_name: string;
  hotel_city: string;
  hotel_address?: string;
  hotel_photo_url?: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  price_per_night: number;
  total_amount: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
}

export interface HotelBookingResponse {
  booking_id: string;
  booking_reference: string;
  hotel_name: string;
  hotel_city: string;
  hotel_address: string | null;
  hotel_photo_url: string | null;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  number_of_nights: number | null;
  number_of_guests: number;
  price_per_night: number | null;
  total_amount: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  payment_status: string;
  booking_status: string;
  special_requests: string | null;
  created_at: string | null;
}

export async function createHotelBooking(
  data: CreateHotelBookingRequest
): Promise<HotelBookingResponse> {
  return apiFetch<HotelBookingResponse>("/bookings/hotels", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getHotelBookings(): Promise<{
  bookings: HotelBookingResponse[];
  total: number;
}> {
  return apiFetch<{ bookings: HotelBookingResponse[]; total: number }>(
    "/bookings/hotels"
  );
}

export async function getHotelBooking(
  bookingId: string
): Promise<HotelBookingResponse> {
  return apiFetch<HotelBookingResponse>(`/bookings/hotels/${bookingId}`);
}

export async function cancelHotelBooking(
  bookingId: string
): Promise<{ message: string; booking_id: string; refund_amount: number | null }> {
  return apiFetch<{ message: string; booking_id: string; refund_amount: number | null }>(
    `/bookings/hotels/${bookingId}`,
    { method: "DELETE" }
  );
}

// ─── Chat ───────────────────────────────────

export async function sendChatMessage(
  message: string,
  conversation_id?: string
): Promise<{ reply: string; conversation_id: string; intent: string }> {
  try {
    return await apiFetch<{ reply: string; conversation_id: string; intent: string }>(
      "/chat/guest",
      {
        method: "POST",
        body: JSON.stringify({ message, conversation_id }),
      }
    );
  } catch {
    // Fallback mock chat responses
    const lowerMsg = message.toLowerCase();
    let reply = "I'm JourneyIt AI, your travel assistant. I can help you find hotels, flights, and plan your trips across India. What would you like to explore?";
    
    if (lowerMsg.includes("hotel") || lowerMsg.includes("stay")) {
      reply = "I can help you find hotels! Try searching for cities like Hyderabad, Mumbai, Delhi, Bangalore, Goa, or Chennai. Each has 8+ premium hotels with real prices and ratings.";
    } else if (lowerMsg.includes("flight") || lowerMsg.includes("fly")) {
      reply = "Our flight search connects you to major Indian routes. Popular routes include Hyderabad ↔ Mumbai, Delhi ↔ Bangalore, and Chennai ↔ Goa.";
    } else if (lowerMsg.includes("price") || lowerMsg.includes("cost")) {
      reply = "Hotel prices vary by city:\n• Hyderabad: ₹5,800 - ₹18,500/night\n• Mumbai: ₹6,500 - ₹22,000/night\n• Delhi: ₹7,200 - ₹21,000/night\n• Bangalore: ₹6,500 - ₹19,000/night\n• Goa: ₹6,500 - ₹18,000/night\n• Chennai: ₹7,200 - ₹17,000/night";
    } else if (lowerMsg.includes("goa") || lowerMsg.includes("mumbai") || lowerMsg.includes("delhi") || lowerMsg.includes("bangalore") || lowerMsg.includes("chennai") || lowerMsg.includes("hyderabad")) {
      reply = `Great choice! I have detailed hotel listings for that city. Visit our Hotels page to see ${message} hotels on an interactive map with prices, ratings, and photos.`;
    } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
      reply = "Hello! I'm JourneyIt AI. I can help you find hotels, compare prices, and plan your perfect trip across India. What city would you like to explore?";
    } else if (lowerMsg.includes("thank")) {
      reply = "You're welcome! Happy to help plan your journey. Safe travels! 🛫";
    }

    return {
      reply,
      conversation_id: conversation_id || "mock-conv-1",
      intent: "general",
    };
  }
}

// ─── OTP ────────────────────────────────────

export async function sendOtp(email: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>("/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(
  email: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>("/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

// ─── Flight Search ──────────────────────────

export interface FlightSearchResult {
  route: string;
  date: string;
  flights: {
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
  }[];
}

export async function searchFlights(data: {
  from_iata: string;
  to_iata: string;
  date: string;
}): Promise<FlightSearchResult> {
  try {
    return await apiFetch<FlightSearchResult>("/search-flights", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    // Fallback to mock data when backend is unavailable
    return getMockFlightSearchResult(data.from_iata, data.to_iata, data.date);
  }
}
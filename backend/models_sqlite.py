"""
SQLite-Compatible SQLAlchemy ORM Models for JourneyIt
==============================================
These models work with both SQLite and PostgreSQL.
For SQLite: UUIDs are stored as strings, JSONB becomes JSON.
"""

import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Date, Time, Text,
    ForeignKey, CheckConstraint, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# Helper function to generate UUID
def generate_uuid():
    return str(uuid.uuid4())

# ==========================================
# 1. USERS MODEL
# ==========================================
class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=True, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    profile_picture = Column(Text, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    nationality = Column(String(100), nullable=True)
    passport_number = Column(String(50), nullable=True)
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    kyc_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    preferences = relationship("UserPreference", back_populates="user", cascade="all, delete-orphan")
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    flight_bookings = relationship("FlightBooking", back_populates="user", cascade="all, delete-orphan")
    hotel_bookings = relationship("HotelBooking", back_populates="user", cascade="all, delete-orphan")
    itineraries = relationship("Itinerary", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    payment_methods = relationship("PaymentMethod", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(user_id={self.user_id}, email={self.email})>"

# ==========================================
# 2. USER PREFERENCES MODEL
# ==========================================
class UserPreference(Base):
    __tablename__ = "user_preferences"

    preference_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, unique=True)
    preferred_airlines = Column(Text, nullable=True)  # Stored as JSON string
    preferred_hotels = Column(Text, nullable=True)  # Stored as JSON string
    budget_preference = Column(String(20), default="economy")  # budget/economy/business/luxury
    seat_preference = Column(String(20), default="window")  # window/middle/aisle
    meal_preference = Column(String(50), default="non-vegetarian")  # vegetarian/vegan/non-vegetarian/none
    theme_preference = Column(String(50), default="light")
    currency_code = Column(String(3), default="INR")
    timezone = Column(String(50), default="Asia/Kolkata")
    notification_email = Column(Boolean, default=True)
    notification_sms = Column(Boolean, default=False)
    notification_push = Column(Boolean, default=True)
    price_alert_threshold = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="preferences")

    __table_args__ = (
        CheckConstraint(budget_preference.in_(["budget", "economy", "business", "luxury"])),
        CheckConstraint(seat_preference.in_(["window", "middle", "aisle"])),
        CheckConstraint(meal_preference.in_(["vegetarian", "vegan", "non-vegetarian", "none"])),
    )

# ==========================================
# 3. ADDRESSES MODEL
# ==========================================
class Address(Base):
    __tablename__ = "addresses"

    address_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    address_type = Column(String(20), nullable=False)  # home/work/other
    street_address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=True)
    is_primary = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="addresses")

    __table_args__ = (
        CheckConstraint(address_type.in_(["home", "work", "other"])),
    )

# ==========================================
# 4. FLIGHTS MODEL
# ==========================================
class Flight(Base):
    __tablename__ = "flights"

    flight_id = Column(String(36), primary_key=True, default=generate_uuid)
    airline_code = Column(String(10), nullable=False)
    airline_name = Column(String(100), nullable=False)
    flight_number = Column(String(20), nullable=False)
    aircraft_type = Column(String(50), nullable=True)
    departure_airport = Column(String(10), nullable=False, index=True)
    arrival_airport = Column(String(10), nullable=False, index=True)
    departure_date = Column(Date, nullable=False, index=True)
    departure_time = Column(Time, nullable=False)
    arrival_time = Column(Time, nullable=False)
    duration_minutes = Column(Integer, nullable=True)
    stops = Column(Integer, default=0)
    base_fare = Column(Float, nullable=False)
    taxes_fees = Column(Float, default=0)
    total_fare = Column(Float, nullable=False)
    seats_available = Column(Integer, nullable=True)
    seat_capacity = Column(Integer, nullable=True)
    class_type = Column(String(20), nullable=True)
    baggage_allowance = Column(Integer, nullable=True)
    meal_included = Column(Boolean, default=False)
    source = Column(String(50), nullable=True)
    external_flight_id = Column(String(100), nullable=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookings = relationship("FlightBooking", back_populates="flight")
    reviews = relationship("Review", back_populates="flight", foreign_keys="Review.flight_id")
    favorites = relationship("Favorite", back_populates="flight", foreign_keys="Favorite.flight_id")

    def __repr__(self):
        return f"<Flight(flight_number={self.flight_number}, {self.departure_airport}->{self.arrival_airport})>"

# ==========================================
# 5. HOTELS MODEL
# ==========================================
class Hotel(Base):
    __tablename__ = "hotels"

    hotel_id = Column(String(36), primary_key=True, default=generate_uuid)
    hotel_name = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=False)
    address = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    star_rating = Column(Float, nullable=True)
    review_count = Column(Integer, default=0)
    review_score = Column(Float, nullable=True)
    hotel_type = Column(String(50), nullable=True)  # hotel/resort/apartment/villa/house
    check_in_date = Column(Date, nullable=False, index=True)
    check_out_date = Column(Date, nullable=False)
    rooms_available = Column(Integer, nullable=True)
    room_type = Column(String(100), nullable=True)
    price_per_night = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    currency = Column(String(3), default="INR")
    amenities = Column(Text, nullable=True)  # Stored as JSON string
    photos = Column(Text, nullable=True)  # Stored as JSON string
    description = Column(Text, nullable=True)
    cancellation_policy = Column(String(50), nullable=True)
    source = Column(String(50), nullable=True)
    external_hotel_id = Column(String(100), nullable=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookings = relationship("HotelBooking", back_populates="hotel")
    reviews = relationship("Review", back_populates="hotel", foreign_keys="Review.hotel_id")
    favorites = relationship("Favorite", back_populates="hotel", foreign_keys="Favorite.hotel_id")

    __table_args__ = (
        CheckConstraint(hotel_type.in_(["hotel", "resort", "apartment", "villa", "house", None])),
    )

# ==========================================
# 6. FLIGHT BOOKINGS MODEL
# ==========================================
class FlightBooking(Base):
    __tablename__ = "flight_bookings"

    booking_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    flight_id = Column(String(36), ForeignKey("flights.flight_id"), nullable=False)
    booking_reference = Column(String(20), unique=True, nullable=False)
    passenger_name = Column(String(255), nullable=False)
    passport_number = Column(String(50), nullable=True)
    passenger_email = Column(String(255), nullable=False)
    passenger_phone = Column(String(20), nullable=False)
    seat_number = Column(String(10), nullable=True)
    class_type = Column(String(20), nullable=True)
    meal_choice = Column(String(50), nullable=True)
    baggage_weight = Column(Integer, nullable=True)
    total_amount = Column(Float, nullable=False)
    payment_status = Column(String(50), default="pending")  # pending/confirmed/paid/refunded/failed
    booking_status = Column(String(50), default="confirmed")  # confirmed/cancelled/completed/pending
    check_in_status = Column(String(50), default="pending")  # pending/checked_in/boarded/no_show
    check_in_time = Column(DateTime, nullable=True)
    special_requests = Column(Text, nullable=True)
    emergency_contact = Column(String(100), nullable=True)
    emergency_phone = Column(String(20), nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    refund_amount = Column(Float, nullable=True)
    booking_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="flight_bookings")
    flight = relationship("Flight", back_populates="bookings")
    itinerary = relationship("Itinerary", back_populates="flight_booking", foreign_keys="Itinerary.flight_booking_id")
    payments = relationship("Payment", back_populates="flight_booking", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="flight_booking")

    __table_args__ = (
        CheckConstraint(payment_status.in_(["pending", "confirmed", "paid", "refunded", "failed"])),
        CheckConstraint(booking_status.in_(["confirmed", "cancelled", "completed", "pending"])),
        CheckConstraint(check_in_status.in_(["pending", "checked_in", "boarded", "no_show"])),
    )

# ==========================================
# 7. HOTEL BOOKINGS MODEL
# ==========================================
class HotelBooking(Base):
    __tablename__ = "hotel_bookings"

    booking_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    hotel_id = Column(String(36), ForeignKey("hotels.hotel_id"), nullable=False)
    booking_reference = Column(String(20), unique=True, nullable=False)
    guest_name = Column(String(255), nullable=False)
    guest_email = Column(String(255), nullable=False)
    guest_phone = Column(String(20), nullable=False)
    room_type = Column(String(100), nullable=False)
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    number_of_nights = Column(Integer, nullable=True)
    number_of_guests = Column(Integer, nullable=False)
    price_per_night = Column(Float, nullable=True)
    total_amount = Column(Float, nullable=False)
    payment_status = Column(String(50), default="pending")
    booking_status = Column(String(50), default="confirmed")
    check_in_status = Column(String(50), default="pending")
    check_in_time = Column(DateTime, nullable=True)
    special_requests = Column(Text, nullable=True)
    additional_guests = Column(Text, nullable=True)  # Stored as JSON string
    cancellation_reason = Column(Text, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    refund_amount = Column(Float, nullable=True)
    booking_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="hotel_bookings")
    hotel = relationship("Hotel", back_populates="bookings")
    itinerary = relationship("Itinerary", back_populates="hotel_booking", foreign_keys="Itinerary.hotel_booking_id")
    payments = relationship("Payment", back_populates="hotel_booking", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="hotel_booking")

    __table_args__ = (
        CheckConstraint(payment_status.in_(["pending", "confirmed", "paid", "refunded", "failed"])),
        CheckConstraint(booking_status.in_(["confirmed", "cancelled", "completed", "pending"])),
        CheckConstraint(check_in_status.in_(["pending", "checked_in"])),
    )

# ==========================================
# 8. ITINERARIES MODEL
# ==========================================
class Itinerary(Base):
    __tablename__ = "itineraries"

    itinerary_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    destination = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    trip_type = Column(String(50), nullable=True)  # leisure/business/adventure/family
    budget = Column(Float, nullable=True)
    visibility = Column(String(50), default="private")
    flight_booking_id = Column(String(36), ForeignKey("flight_bookings.booking_id"), nullable=True)
    hotel_booking_id = Column(String(36), ForeignKey("hotel_bookings.booking_id"), nullable=True)
    status = Column(String(50), default="planning")  # confirmed/cancelled/completed/pending/planning
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="itineraries")
    flight_booking = relationship("FlightBooking", back_populates="itinerary", foreign_keys=[flight_booking_id])
    hotel_booking = relationship("HotelBooking", back_populates="itinerary", foreign_keys=[hotel_booking_id])

    __table_args__ = (
        CheckConstraint(trip_type.in_(["leisure", "business", "adventure", "family", None])),
        CheckConstraint(status.in_(["confirmed", "cancelled", "completed", "pending", "planning"])),
    )

# ==========================================
# 9. PAYMENTS MODEL
# ==========================================
class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    flight_booking_id = Column(String(36), ForeignKey("flight_bookings.booking_id"), nullable=True)
    hotel_booking_id = Column(String(36), ForeignKey("hotel_bookings.booking_id"), nullable=True)
    booking_type = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="INR")
    payment_method = Column(String(50), nullable=False)  # card/upi/netbanking/wallet
    card_type = Column(String(20), nullable=True)  # credit/debit
    card_last_four = Column(String(4), nullable=True)
    transaction_id = Column(String(100), unique=True, nullable=True)
    gateway = Column(String(50), nullable=True)
    payment_status = Column(String(50), default="pending")
    failure_reason = Column(Text, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    refund_amount = Column(Float, nullable=True)
    refund_status = Column(String(50), nullable=True)
    refunded_at = Column(DateTime, nullable=True)
    receipt_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="payments")
    flight_booking = relationship("FlightBooking", back_populates="payments", foreign_keys=[flight_booking_id])
    hotel_booking = relationship("HotelBooking", back_populates="payments", foreign_keys=[hotel_booking_id])

    __table_args__ = (
        CheckConstraint(payment_method.in_(["card", "upi", "netbanking", "wallet"])),
        CheckConstraint(card_type.in_(["credit", "debit", None])),
        CheckConstraint(payment_status.in_(["pending", "confirmed", "paid", "refunded", "failed"])),
        CheckConstraint(refund_status.in_(["pending", "confirmed", "paid", "refunded", "failed", None])),
    )

# ==========================================
# 10. REVIEWS MODEL
# ==========================================
class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    flight_booking_id = Column(String(36), ForeignKey("flight_bookings.booking_id"), nullable=True)
    hotel_booking_id = Column(String(36), ForeignKey("hotel_bookings.booking_id"), nullable=True)
    review_type = Column(String(50), nullable=False)  # flight/hotel
    flight_id = Column(String(36), ForeignKey("flights.flight_id"), nullable=True)
    hotel_id = Column(String(36), ForeignKey("hotels.hotel_id"), nullable=True)
    rating = Column(Integer, nullable=False)
    title = Column(String(255), nullable=True)
    review_text = Column(Text, nullable=False)
    categories = Column(Text, nullable=True)  # Stored as JSON string
    helpful_count = Column(Integer, default=0)
    unhelpful_count = Column(Integer, default=0)
    verified_purchase = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="reviews")
    flight_booking = relationship("FlightBooking", back_populates="reviews", foreign_keys=[flight_booking_id])
    hotel_booking = relationship("HotelBooking", back_populates="reviews", foreign_keys=[hotel_booking_id])
    flight = relationship("Flight", back_populates="reviews", foreign_keys=[flight_id])
    hotel = relationship("Hotel", back_populates="reviews", foreign_keys=[hotel_id])

    __table_args__ = (
        CheckConstraint(review_type.in_(["flight", "hotel"])),
        CheckConstraint("rating >= 1 AND rating <= 5"),
    )

# ==========================================
# 11. FAVORITES MODEL
# ==========================================
class Favorite(Base):
    __tablename__ = "favorites"

    favorite_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    favorite_type = Column(String(50), nullable=False)  # flight/hotel
    flight_id = Column(String(36), ForeignKey("flights.flight_id"), nullable=True)
    hotel_id = Column(String(36), ForeignKey("hotels.hotel_id"), nullable=True)
    note = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="favorites")
    flight = relationship("Flight", back_populates="favorites", foreign_keys=[flight_id])
    hotel = relationship("Hotel", back_populates="favorites", foreign_keys=[hotel_id])

    __table_args__ = (
        CheckConstraint(favorite_type.in_(["flight", "hotel"])),
    )

# ==========================================
# 12. PAYMENT METHODS MODEL
# ==========================================
class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    method_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    method_type = Column(String(50), nullable=False)  # card/upi/netbanking/wallet
    card_name = Column(String(100), nullable=True)
    card_last_four = Column(String(4), nullable=True)
    card_brand = Column(String(50), nullable=True)  # visa/mastercard/amex/rupay/diners
    expiry_month = Column(Integer, nullable=True)
    expiry_year = Column(Integer, nullable=True)
    upi_id = Column(String(100), nullable=True)
    is_default = Column(Boolean, default=False, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="payment_methods")

    __table_args__ = (
        CheckConstraint(method_type.in_(["card", "upi", "netbanking", "wallet"])),
        CheckConstraint(card_brand.in_(["visa", "mastercard", "amex", "rupay", "diners", None])),
    )


# ==========================================
# 13. CHAT MESSAGE MODEL (Conversation History)
# ==========================================
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    message_id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), nullable=True, index=True)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    intent = Column(String(50), nullable=True)  # detected intent
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="chat_messages")

    def __repr__(self):
        return f"<ChatMessage(user_id={self.user_id}, role={self.role})>"

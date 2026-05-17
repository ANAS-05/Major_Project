"""
Hotel Booking Router for JourneyIt
====================================
CRUD endpoints for hotel bookings.
All endpoints live under /bookings prefix.
Authenticated endpoints require JWT bearer token.
"""

import uuid
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models_sqlite import HotelBooking, Hotel, User
from auth import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# ─────────────────────────────────────────────────
# REQUEST / RESPONSE SCHEMAS
# ─────────────────────────────────────────────────

class HotelBookingCreate(BaseModel):
    hotel_name: str = Field(..., min_length=1, max_length=255)
    hotel_city: str = Field(..., min_length=1, max_length=100)
    hotel_address: Optional[str] = None
    hotel_photo_url: Optional[str] = None
    room_type: str = Field(default="Standard", max_length=100)
    check_in_date: str = Field(..., description="YYYY-MM-DD")
    check_out_date: str = Field(..., description="YYYY-MM-DD")
    number_of_guests: int = Field(default=2, ge=1, le=10)
    price_per_night: float = Field(..., gt=0)
    total_amount: float = Field(..., gt=0)
    guest_name: str = Field(..., min_length=1, max_length=255)
    guest_email: EmailStr
    guest_phone: str = Field(..., min_length=6, max_length=20)
    special_requests: Optional[str] = None


class HotelBookingResponse(BaseModel):
    booking_id: str
    booking_reference: str
    hotel_name: str
    hotel_city: str
    hotel_address: Optional[str]
    hotel_photo_url: Optional[str]
    room_type: str
    check_in_date: str
    check_out_date: str
    number_of_nights: Optional[int]
    number_of_guests: int
    price_per_night: Optional[float]
    total_amount: float
    guest_name: str
    guest_email: str
    guest_phone: str
    payment_status: str
    booking_status: str
    special_requests: Optional[str]
    created_at: Optional[str]


class HotelBookingListResponse(BaseModel):
    bookings: list[HotelBookingResponse]
    total: int


class BookingCancelResponse(BaseModel):
    message: str
    booking_id: str
    refund_amount: Optional[float] = None


# ─────────────────────────────────────────────────
# HELPER: generate booking reference
# ─────────────────────────────────────────────────

def _generate_booking_ref() -> str:
    """Generate a unique booking reference like JI-ABC123."""
    code = uuid.uuid4().hex[:6].upper()
    return f"JI-{code}"


def _booking_to_response(booking: HotelBooking) -> dict:
    return {
        "booking_id": booking.booking_id,
        "booking_reference": booking.booking_reference,
        "hotel_name": booking.hotel_name if hasattr(booking, "hotel_name") else "",
        "hotel_city": booking.hotel_city if hasattr(booking, "hotel_city") else "",
        "hotel_address": booking.hotel_address if hasattr(booking, "hotel_address") else None,
        "hotel_photo_url": booking.hotel_photo_url if hasattr(booking, "hotel_photo_url") else None,
        "room_type": booking.room_type,
        "check_in_date": str(booking.check_in_date) if booking.check_in_date else "",
        "check_out_date": str(booking.check_out_date) if booking.check_out_date else "",
        "number_of_nights": booking.number_of_nights,
        "number_of_guests": booking.number_of_guests,
        "price_per_night": booking.price_per_night,
        "total_amount": booking.total_amount,
        "guest_name": booking.guest_name,
        "guest_email": booking.guest_email,
        "guest_phone": booking.guest_phone,
        "payment_status": booking.payment_status,
        "booking_status": booking.booking_status,
        "special_requests": booking.special_requests,
        "created_at": str(booking.created_at) if booking.created_at else None,
    }


# ─────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────

@router.post("/hotels", response_model=HotelBookingResponse, status_code=status.HTTP_201_CREATED)
def create_hotel_booking(
    req: HotelBookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new hotel booking. Requires authentication."""
    try:
        check_in = datetime.strptime(req.check_in_date, "%Y-%m-%d").date()
        check_out = datetime.strptime(req.check_out_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD.",
        )

    if check_out <= check_in:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out date must be after check-in date.",
        )

    nights = (check_out - check_in).days

    # Create or find hotel record
    hotel = db.query(Hotel).filter(
        Hotel.hotel_name == req.hotel_name,
        Hotel.city == req.hotel_city,
    ).first()

    if not hotel:
        hotel = Hotel(
            hotel_name=req.hotel_name,
            city=req.hotel_city,
            country="India",
            address=req.hotel_address or f"{req.hotel_city}, India",
            star_rating=4.0,
            review_score=4.0,
            hotel_type="hotel",
            check_in_date=check_in,
            check_out_date=check_out,
            price_per_night=req.price_per_night,
            total_price=req.total_amount,
            room_type=req.room_type,
            photos=req.hotel_photo_url or "",
            is_available=True,
        )
        db.add(hotel)
        db.commit()
        db.refresh(hotel)

    booking = HotelBooking(
        user_id=current_user.user_id,
        hotel_id=hotel.hotel_id,
        booking_reference=_generate_booking_ref(),
        guest_name=req.guest_name,
        guest_email=req.guest_email,
        guest_phone=req.guest_phone,
        room_type=req.room_type,
        check_in_date=check_in,
        check_out_date=check_out,
        number_of_nights=nights,
        number_of_guests=req.number_of_guests,
        price_per_night=req.price_per_night,
        total_amount=req.total_amount,
        payment_status="pending",
        booking_status="confirmed",
        special_requests=req.special_requests,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Attach hotel info to booking for response
    booking.hotel_name = hotel.hotel_name
    booking.hotel_city = hotel.city
    booking.hotel_address = hotel.address
    booking.hotel_photo_url = hotel.photos if hotel.photos else None

    return _booking_to_response(booking)


@router.get("/hotels", response_model=HotelBookingListResponse)
def list_hotel_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all hotel bookings for the authenticated user."""
    bookings = (
        db.query(HotelBooking)
        .filter(HotelBooking.user_id == current_user.user_id)
        .order_by(HotelBooking.created_at.desc())
        .all()
    )

    result = []
    for b in bookings:
        hotel = db.query(Hotel).filter(Hotel.hotel_id == b.hotel_id).first()
        b.hotel_name = hotel.hotel_name if hotel else "Unknown Hotel"
        b.hotel_city = hotel.city if hotel else ""
        b.hotel_address = hotel.address if hotel else None
        b.hotel_photo_url = hotel.photos if hotel and hotel.photos else None
        result.append(_booking_to_response(b))

    return {"bookings": result, "total": len(result)}


@router.get("/hotels/{booking_id}", response_model=HotelBookingResponse)
def get_hotel_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific hotel booking by ID."""
    booking = db.query(HotelBooking).filter(
        HotelBooking.booking_id == booking_id,
        HotelBooking.user_id == current_user.user_id,
    ).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    hotel = db.query(Hotel).filter(Hotel.hotel_id == booking.hotel_id).first()
    booking.hotel_name = hotel.hotel_name if hotel else "Unknown Hotel"
    booking.hotel_city = hotel.city if hotel else ""
    booking.hotel_address = hotel.address if hotel else None
    booking.hotel_photo_url = hotel.photos if hotel and hotel.photos else None

    return _booking_to_response(booking)


@router.delete("/hotels/{booking_id}", response_model=BookingCancelResponse)
def cancel_hotel_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel a hotel booking."""
    booking = db.query(HotelBooking).filter(
        HotelBooking.booking_id == booking_id,
        HotelBooking.user_id == current_user.user_id,
    ).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking.booking_status == "cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking is already cancelled",
        )

    booking.booking_status = "cancelled"
    booking.payment_status = "refunded"
    booking.cancelled_at = datetime.utcnow()
    booking.refund_amount = booking.total_amount
    booking.updated_at = datetime.utcnow()
    db.commit()

    return {
        "message": "Booking cancelled successfully. Refund will be processed within 5-7 business days.",
        "booking_id": booking.booking_id,
        "refund_amount": booking.refund_amount,
    }
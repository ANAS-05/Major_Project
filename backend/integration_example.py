"""
Example: How to Integrate Database with main.py
================================================

This file shows you how to modify your existing main.py to use the database.
You can copy-paste these sections into your main.py
"""

# ============================================================================
# STEP 1: Add these imports at the TOP of main.py
# ============================================================================

# Database imports
from database import init_db, SessionLocal
from models_sqlite import (
    User, UserPreference, Flight, Hotel, 
    FlightBooking, HotelBooking, Review, Favorite
)
from sqlalchemy.orm import Session
from sqlalchemy import or_

# Add this after creating the FastAPI app
# ============================================================================
# STEP 2: Add startup event (after app = FastAPI())
# ============================================================================

# @app.on_event("startup")
# async def startup_event():
#     """Initialize database on startup"""
#     init_db()
#     print("✅ Database initialized successfully!")

# ============================================================================
# STEP 3: Add database dependency (copy this function)
# ============================================================================

def get_db():
    """
    Dependency to get database session.
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================================================================
# STEP 4: Example API Endpoints (add these to your main.py)
# ============================================================================

# Example 1: Get all users
# @app.get("/api/users")
# def get_users(db: Session = Depends(get_db)):
#     """Get all registered users"""
#     users = db.query(User).all()
#     return {
#         "count": len(users),
#         "users": [
#             {
#                 "id": user.user_id,
#                 "email": user.email,
#                 "name": f"{user.first_name} {user.last_name}",
#                 "created_at": user.created_at
#             }
#             for user in users
#         ]
#     }

# Example 2: Get user by email
# @app.get("/api/users/{email}")
# def get_user_by_email(email: str, db: Session = Depends(get_db)):
#     """Get user details by email"""
#     user = db.query(User).filter(User.email == email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     
#     return {
#         "user_id": user.user_id,
#         "email": user.email,
#         "first_name": user.first_name,
#         "last_name": user.last_name,
#         "email_verified": user.email_verified,
#         "created_at": user.created_at
#     }

# Example 3: Create a new user
# @app.post("/api/users")
# def create_user(
#     email: str,
#     first_name: str,
#     last_name: str,
#     password_hash: str,
#     db: Session = Depends(get_db)
# ):
#     """Create a new user account"""
#     # Check if user already exists
#     existing = db.query(User).filter(User.email == email).first()
#     if existing:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     
#     # Create new user
#     new_user = User(
#         email=email,
#         first_name=first_name,
#         last_name=last_name,
#         password_hash=password_hash,
#         email_verified=False,
#         is_active=True
#     )
#     
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     
#     return {
#         "message": "User created successfully",
#         "user_id": new_user.user_id,
#         "email": new_user.email
#     }

# Example 4: Get flights from database
# @app.get("/api/flights")
# def get_flights(
#     from_city: str = None,
#     to_city: str = None,
#     date: str = None,
#     db: Session = Depends(get_db)
# ):
#     """Search flights from database"""
#     query = db.query(Flight).filter(Flight.is_available == True)
#     
#     if from_city:
#         query = query.filter(Flight.departure_airport == from_city.upper())
#     if to_city:
#         query = query.filter(Flight.arrival_airport == to_city.upper())
#     if date:
#         query = query.filter(Flight.departure_date == date)
#     
#     flights = query.all()
#     
#     return {
#         "count": len(flights),
#         "flights": [
#             {
#                 "flight_id": f.flight_id,
#                 "flight_number": f.flight_number,
#                 "airline": f.airline_name,
#                 "route": f"{f.departure_airport} → {f.arrival_airport}",
#                 "departure": f"{f.departure_date} {f.departure_time}",
#                 "arrival": f"{f.departure_date} {f.arrival_time}",
#                 "price": f.total_fare,
#                 "seats_available": f.seats_available
#             }
#             for f in flights
#         ]
#     }

# Example 5: Create a flight booking
# @app.post("/api/bookings/flight")
# def create_flight_booking(
#     user_id: str,
#     flight_id: str,
#     passenger_name: str,
#     passenger_email: str,
#     passenger_phone: str,
#     db: Session = Depends(get_db)
# ):
#     """Create a new flight booking"""
#     # Check if user exists
#     user = db.query(User).filter(User.user_id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     
#     # Check if flight exists and has seats
#     flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
#     if not flight:
#         raise HTTPException(status_code=404, detail="Flight not found")
#     if flight.seats_available <= 0:
#         raise HTTPException(status_code=400, detail="No seats available")
#     
#     # Generate booking reference (e.g., "JK123456")
#     import random
#     import string
#     booking_ref = "JK" + ''.join(random.choices(string.digits, k=6))
#     
#     # Create booking
#     booking = FlightBooking(
#         user_id=user_id,
#         flight_id=flight_id,
#         booking_reference=booking_ref,
#         passenger_name=passenger_name,
#         passenger_email=passenger_email,
#         passenger_phone=passenger_phone,
#         total_amount=flight.total_fare,
#         booking_status="confirmed",
#         payment_status="pending"
#     )
#     
#     # Update available seats
#     flight.seats_available -= 1
#     
#     db.add(booking)
#     db.commit()
#     db.refresh(booking)
#     
#     return {
#         "message": "Booking created successfully",
#         "booking_reference": booking_ref,
#         "booking_id": booking.booking_id,
#         "status": booking.booking_status,
#         "total_amount": booking.total_amount
#     }

# Example 6: Get user's bookings
# @app.get("/api/users/{user_id}/bookings")
# def get_user_bookings(user_id: str, db: Session = Depends(get_db)):
#     """Get all bookings for a user"""
#     flight_bookings = db.query(FlightBooking).filter(
#         FlightBooking.user_id == user_id
#     ).all()
#     
#     hotel_bookings = db.query(HotelBooking).filter(
#         HotelBooking.user_id == user_id
#     ).all()
#     
#     return {
#         "flight_bookings": [
#             {
#                 "booking_id": b.booking_id,
#                 "reference": b.booking_reference,
#                 "flight_id": b.flight_id,
#                 "passenger": b.passenger_name,
#                 "amount": b.total_amount,
#                 "status": b.booking_status
#             }
#             for b in flight_bookings
#         ],
#         "hotel_bookings": [
#             {
#                 "booking_id": b.booking_id,
#                 "reference": b.booking_reference,
#                 "hotel_id": b.hotel_id,
#                 "guest": b.guest_name,
#                 "amount": b.total_amount,
#                 "status": b.booking_status
#             }
#             for b in hotel_bookings
#         ]
#     }

# Example 7: Add a review
# @app.post("/api/reviews")
# def create_review(
#     user_id: str,
#     review_type: str,  # "flight" or "hotel"
#     rating: int,       # 1-5
#     review_text: str,
#     flight_id: str = None,
#     hotel_id: str = None,
#     db: Session = Depends(get_db)
# ):
#     """Add a review for a flight or hotel"""
#     if review_type not in ["flight", "hotel"]:
#         raise HTTPException(status_code=400, detail="Review type must be 'flight' or 'hotel'")
#     
#     if review_type == "flight" and not flight_id:
#         raise HTTPException(status_code=400, detail="flight_id required for flight reviews")
#     
#     if review_type == "hotel" and not hotel_id:
#         raise HTTPException(status_code=400, detail="hotel_id required for hotel reviews")
#     
#     if rating < 1 or rating > 5:
#         raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
#     
#     review = Review(
#         user_id=user_id,
#         review_type=review_type,
#         flight_id=flight_id,
#         hotel_id=hotel_id,
#         rating=rating,
#         review_text=review_text,
#         is_published=True
#     )
#     
#     db.add(review)
#     db.commit()
#     db.refresh(review)
#     
#     return {
#         "message": "Review submitted successfully",
#         "review_id": review.review_id
#     }

# Example 8: Get hotels from database
# @app.get("/api/hotels")
# def get_hotels(
#     city: str = None,
#     min_price: float = None,
#     max_price: float = None,
#     db: Session = Depends(get_db)
# ):
#     """Search hotels from database"""
#     query = db.query(Hotel).filter(Hotel.is_available == True)
#     
#     if city:
#         query = query.filter(Hotel.city.ilike(f"%{city}%"))
#     if min_price:
#         query = query.filter(Hotel.price_per_night >= min_price)
#     if max_price:
#         query = query.filter(Hotel.price_per_night <= max_price)
#     
#     hotels = query.all()
#     
#     return {
#         "count": len(hotels),
#         "hotels": [
#             {
#                 "hotel_id": h.hotel_id,
#                 "name": h.hotel_name,
#                 "city": h.city,
#                 "rating": h.star_rating,
#                 "price_per_night": h.price_per_night,
#                 "amenities": h.amenities
#             }
#             for h in hotels
#         ]
#     }

# Example 9: Add to favorites
# @app.post("/api/favorites")
# def add_favorite(
#     user_id: str,
#     favorite_type: str,  # "flight" or "hotel"
#     flight_id: str = None,
#     hotel_id: str = None,
#     note: str = "",
#     db: Session = Depends(get_db)
# ):
#     """Add flight or hotel to favorites"""
#     if favorite_type == "flight" and flight_id:
#         existing = db.query(Favorite).filter(
#             Favorite.user_id == user_id,
#             Favorite.flight_id == flight_id
#         ).first()
#     elif favorite_type == "hotel" and hotel_id:
#         existing = db.query(Favorite).filter(
#             Favorite.user_id == user_id,
#             Favorite.hotel_id == hotel_id
#         ).first()
#     else:
#         raise HTTPException(status_code=400, detail="Invalid favorite_type or missing ID")
#     
#     if existing:
#         raise HTTPException(status_code=400, detail="Already in favorites")
#     
#     favorite = Favorite(
#         user_id=user_id,
#         favorite_type=favorite_type,
#         flight_id=flight_id,
#         hotel_id=hotel_id,
#         note=note
#     )
#     
#     db.add(favorite)
#     db.commit()
#     
#     return {"message": "Added to favorites"}

# Example 10: Get user favorites
# @app.get("/api/users/{user_id}/favorites")
# def get_favorites(user_id: str, db: Session = Depends(get_db)):
#     """Get user's favorite flights and hotels"""
#     favorites = db.query(Favorite).filter(Favorite.user_id == user_id).all()
#     
#     return {
#         "favorites": [
#             {
#                 "favorite_id": f.favorite_id,
#                 "type": f.favorite_type,
#                 "flight_id": f.flight_id,
#                 "hotel_id": f.hotel_id,
#                 "note": f.note,
#                 "created_at": f.created_at
#             }
#             for f in favorites
#         ]
#     }

# ============================================================================
# STEP 5: Update existing endpoints to use database (example modification)
# ============================================================================

# Original OTP storage (in-memory):
# _otp_store: dict = {}

# Updated to use database (you'd need to create an OTP model):
# Instead, you can keep the in-memory OTP for now since it's temporary data

# ============================================================================
# Full Integration Checklist
# ============================================================================

"""
✅ Steps to fully integrate database:

1. Add imports (Step 1)
2. Add startup event (Step 2)
3. Add get_db() dependency (Step 3)
4. Copy example endpoints you need (Step 4)
5. Modify existing endpoints to query database instead of mock data
6. Test with: python db_utils.py status
7. Start server: uvicorn main:app --reload

📝 Note: The existing endpoints like /search-flights, /search-hotels can 
   continue using the mock/ API data, but you can now save bookings to DB!
"""

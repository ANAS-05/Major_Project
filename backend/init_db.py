"""
Database Initialization Script for JourneyIt
Run this to create the SQLite database and populate with sample data
"""

import sys
from datetime import datetime, timedelta, time
from database import init_db, SessionLocal
from models_sqlite import (
    User, Flight, Hotel, FlightBooking, HotelBooking,
    Review, Favorite, Payment, PaymentMethod
)
import uuid

def generate_uuid():
    return str(uuid.uuid4())

def create_sample_users(db):
    """Create sample users"""
    print("[USER] Creating sample users...")
    
    users = [
        User(
            user_id=generate_uuid(),
            email="salman@journeyit.com",
            password_hash="$2b$12$hashed_password_here",
            first_name="Salman",
            last_name="Khan",
            email_verified=True,
            is_active=True
        ),
        User(
            user_id=generate_uuid(),
            email="test@journeyit.com",
            password_hash="$2b$12$hashed_password_here",
            first_name="Test",
            last_name="User",
            email_verified=True,
            is_active=True
        ),
    ]
    
    for user in users:
        db.add(user)
    
    db.commit()
    print(f"[OK] Created {len(users)} users")
    return users

def create_sample_flights(db):
    """Create sample flights"""
    print("[FLIGHT] Creating sample flights...")
    
    today = datetime.now().date()
    
    flights = [
        Flight(
            flight_id=generate_uuid(),
            airline_code="AI",
            airline_name="Air India",
            flight_number="AI123",
            departure_airport="DEL",
            arrival_airport="BOM",
            departure_date=today + timedelta(days=7),
            departure_time=time(9, 0, 0),
            arrival_time=time(11, 30, 0),
            duration_minutes=150,
            stops=0,
            base_fare=4000.0,
            taxes_fees=500.0,
            total_fare=4500.0,
            seats_available=180,
            seat_capacity=180,
            class_type="economy",
            is_available=True
        ),
        Flight(
            flight_id=generate_uuid(),
            airline_code="6E",
            airline_name="IndiGo",
            flight_number="6E456",
            departure_airport="BLR",
            arrival_airport="DEL",
            departure_date=today + timedelta(days=7),
            departure_time=time(10, 0, 0),
            arrival_time=time(12, 45, 0),
            duration_minutes=165,
            stops=0,
            base_fare=3000.0,
            taxes_fees=500.0,
            total_fare=3500.0,
            seats_available=200,
            seat_capacity=200,
            class_type="economy",
            is_available=True
        ),
        Flight(
            flight_id=generate_uuid(),
            airline_code="UK",
            airline_name="Vistara",
            flight_number="UK789",
            departure_airport="HYD",
            arrival_airport="GOI",
            departure_date=today + timedelta(days=10),
            departure_time=time(14, 0, 0),
            arrival_time=time(16, 15, 0),
            duration_minutes=135,
            stops=0,
            base_fare=3200.0,
            taxes_fees=480.0,
            total_fare=3680.0,
            seats_available=150,
            seat_capacity=150,
            class_type="economy",
            is_available=True
        ),
    ]
    
    for flight in flights:
        db.add(flight)
    
    db.commit()
    print(f"[OK] Created {len(flights)} flights")
    return flights

def create_sample_hotels(db):
    """Create sample hotels"""
    print("[HOTEL] Creating sample hotels...")
    
    today = datetime.now().date()
    
    hotels = [
        Hotel(
            hotel_id=generate_uuid(),
            hotel_name="Taj Mahal Palace",
            city="Mumbai",
            state="Maharashtra",
            country="India",
            address="Apollo Bunder, Colaba, Mumbai",
            star_rating=5.0,
            review_count=2500,
            review_score=4.8,
            hotel_type="hotel",
            check_in_date=today + timedelta(days=7),
            check_out_date=today + timedelta(days=8),
            rooms_available=50,
            room_type="Deluxe Room",
            price_per_night=15000.0,
            total_price=15000.0,
            currency="INR",
            amenities='["wifi", "pool", "spa", "gym", "restaurant"]',
            is_available=True
        ),
        Hotel(
            hotel_id=generate_uuid(),
            hotel_name="The Leela Palace",
            city="Bangalore",
            state="Karnataka",
            country="India",
            address="Old Airport Road, Bangalore",
            star_rating=5.0,
            review_count=1800,
            review_score=4.7,
            hotel_type="hotel",
            check_in_date=today + timedelta(days=7),
            check_out_date=today + timedelta(days=8),
            rooms_available=80,
            room_type="Premium Room",
            price_per_night=12000.0,
            total_price=12000.0,
            currency="INR",
            amenities='["wifi", "pool", "spa", "gym"]',
            is_available=True
        ),
        Hotel(
            hotel_id=generate_uuid(),
            hotel_name="Marriott Hyderabad",
            city="Hyderabad",
            state="Telangana",
            country="India",
            address="Tank Bund Road, Hyderabad",
            star_rating=4.5,
            review_count=1200,
            review_score=4.5,
            hotel_type="hotel",
            check_in_date=today + timedelta(days=7),
            check_out_date=today + timedelta(days=8),
            rooms_available=100,
            room_type="Standard Room",
            price_per_night=6000.0,
            total_price=6000.0,
            currency="INR",
            amenities='["wifi", "gym", "restaurant"]',
            is_available=True
        ),
    ]
    
    for hotel in hotels:
        db.add(hotel)
    
    db.commit()
    print(f"[OK] Created {len(hotels)} hotels")
    return hotels

def create_sample_reviews(db, users, flights, hotels):
    """Create sample reviews"""
    print("[REVIEW] Creating sample reviews...")
    
    if not users or not flights or not hotels:
        print("[!] Skipping reviews - missing dependencies")
        return
    
    reviews = [
        Review(
            review_id=generate_uuid(),
            user_id=users[0].user_id,
            review_type="flight",
            flight_id=flights[0].flight_id,
            rating=5,
            title="Excellent flight experience",
            review_text="Great service and on-time departure. Highly recommended!",
            verified_purchase=True,
            is_published=True
        ),
        Review(
            review_id=generate_uuid(),
            user_id=users[1].user_id,
            review_type="hotel",
            hotel_id=hotels[0].hotel_id,
            rating=4,
            title="Luxurious stay",
            review_text="Beautiful property with excellent amenities. A bit expensive though.",
            verified_purchase=True,
            is_published=True
        ),
    ]
    
    for review in reviews:
        db.add(review)
    
    db.commit()
    print(f"[OK] Created {len(reviews)} reviews")

def main():
    """Main initialization function"""
    print("=" * 50)
    print("JourneyIt Database Initialization")
    print("=" * 50)
    print()
    
    # Initialize database (create tables)
    init_db()
    
    # Create session
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"[!] Database already has {existing_users} users.")
            response = input("Do you want to reset and recreate? (y/N): ")
            if response.lower() == 'y':
                print("[RESET] Resetting database...")
                from database import drop_db, init_db as reinit_db
                drop_db()
                reinit_db()
                db = SessionLocal()
            else:
                print("[OK] Using existing database.")
                return
        
        # Create sample data
        users = create_sample_users(db)
        flights = create_sample_flights(db)
        hotels = create_sample_hotels(db)
        create_sample_reviews(db, users, flights, hotels)
        
        print()
        print("=" * 50)
        print("Database initialization complete!")
        print("=" * 50)
        print()
        print("You can now start the backend server with:")
        print("  uvicorn main:app --reload")
        print()
        print("Database file: journeyit.db")
        print()
        
    except Exception as e:
        print(f"\n[X] Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()

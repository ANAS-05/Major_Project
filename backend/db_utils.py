"""
Database Utility Script for JourneyIt
Check status, run queries, and manage the database
"""

from database import SessionLocal, engine
from models_sqlite import (
    User, UserPreference, Address, Flight, Hotel,
    FlightBooking, HotelBooking, Itinerary, Payment,
    Review, Favorite, PaymentMethod
)
from sqlalchemy import text

def check_db_status():
    """Check database connection and table counts"""
    print("JourneyIt Database Status")
    print("=" * 50)
    
    try:
        db = SessionLocal()
        
        # Check connection
        result = db.execute(text("SELECT sqlite_version();"))
        version = result.fetchone()[0]
        print(f"[OK] SQLite Version: {version}")
        print()
        
        # Check tables
        tables = [
            ("Users", User),
            ("User Preferences", UserPreference),
            ("Addresses", Address),
            ("Flights", Flight),
            ("Hotels", Hotel),
            ("Flight Bookings", FlightBooking),
            ("Hotel Bookings", HotelBooking),
            ("Itineraries", Itinerary),
            ("Payments", Payment),
            ("Reviews", Review),
            ("Favorites", Favorite),
            ("Payment Methods", PaymentMethod),
        ]
        
        print("Table Record Counts:")
        print("-" * 30)
        for name, model in tables:
            count = db.query(model).count()
            status = "[+]" if count > 0 else "[-]"
            print(f"{status} {name:25s} : {count:4d} records")
        
        print()
        
        # Show sample users
        users = db.query(User).limit(3).all()
        if users:
            print("Sample Users:")
            print("-" * 30)
            for user in users:
                print(f"   {user.email} ({user.first_name} {user.last_name})")
        
        print()
        
        # Show sample flights
        flights = db.query(Flight).limit(3).all()
        if flights:
            print("Sample Flights:")
            print("-" * 30)
            for flight in flights:
                print(f"   {flight.flight_number}: {flight.departure_airport} -> {flight.arrival_airport} (Rs.{flight.total_fare:.0f})")
        
        print()
        
        # Show sample hotels
        hotels = db.query(Hotel).limit(3).all()
        if hotels:
            print("Sample Hotels:")
            print("-" * 30)
            for hotel in hotels:
                print(f"   {hotel.hotel_name} ({hotel.city}) - Rs.{hotel.price_per_night:.0f}/night")
        
        print()
        print("=" * 50)
        
    except Exception as e:
        print(f"[X] Error: {e}")
    finally:
        db.close()

def reset_database():
    """Reset database (drops all tables and recreates)"""
    print("[!] WARNING: This will delete ALL data!")
    response = input("Are you sure? Type 'yes' to confirm: ")
    
    if response.lower() == 'yes':
        from database import drop_db, init_db
        print("[CLEAR] Dropping all tables...")
        drop_db()
        print("[BUILD] Recreating tables...")
        init_db()
        print("[OK] Database reset complete!")
        print("Run 'python init_db.py' to populate with sample data.")
    else:
        print("[CANCELLED] Operation cancelled.")

def run_query(query):
    """Run a custom SQL query"""
    try:
        db = SessionLocal()
        result = db.execute(text(query))
        
        # Print column names
        if result.returns_rows:
            columns = result.keys()
            print(" | ".join(columns))
            print("-" * 80)
            
            # Print rows
            for row in result:
                print(" | ".join(str(col) for col in row))
        else:
            print(f"[OK] Query executed. Rows affected: {result.rowcount}")
        
        db.commit()
    except Exception as e:
        print(f"[X] Error: {e}")
    finally:
        db.close()

def main():
    import sys
    
    if len(sys.argv) == 1:
        # No arguments - show status
        check_db_status()
    elif sys.argv[1] == 'status':
        check_db_status()
    elif sys.argv[1] == 'reset':
        reset_database()
    elif sys.argv[1] == 'query' and len(sys.argv) > 2:
        query = " ".join(sys.argv[2:])
        run_query(query)
    else:
        print("Usage:")
        print("  python db_utils.py              # Show database status")
        print("  python db_utils.py status       # Show database status")
        print("  python db_utils.py reset        # Reset database (WARNING: deletes all data)")
        print("  python db_utils.py query <SQL>  # Run custom SQL query")

if __name__ == "__main__":
    main()

# JourneyIt SQLite Database Setup Guide

## ✅ What's Been Set Up

I've created a complete SQLite database solution for your JourneyIt application:

### 📁 New Files Created:

1. **`backend/.env`** - Updated with database configuration
2. **`backend/database.py`** - Database connection and session management
3. **`backend/models_sqlite.py`** - SQLite-compatible SQLAlchemy models
4. **`backend/init_db.py`** - Database initialization with sample data
5. **`backend/db_utils.py`** - Database utility script

## 🚀 Quick Start

### Step 1: Initialize the Database

```bash
cd backend

# Create database and populate with sample data
python init_db.py
```

This will:
- Create `journeyit.db` SQLite database file
- Create all 12 tables (users, flights, hotels, bookings, etc.)
- Add sample users, flights, hotels, and reviews

### Step 2: Check Database Status

```bash
# View database status and record counts
python db_utils.py
```

### Step 3: Start the Backend Server

```bash
# Install required dependencies if not already done
pip install sqlalchemy python-dotenv

# Start the server (database will auto-connect)
uvicorn main:app --reload
```

## 📊 Database Schema

### Tables Created:
1. **users** - User accounts and profiles
2. **user_preferences** - User settings and preferences
3. **addresses** - User addresses (home/work/other)
4. **flights** - Flight listings and availability
5. **hotels** - Hotel listings and details
6. **flight_bookings** - Flight reservation records
7. **hotel_bookings** - Hotel reservation records
8. **itineraries** - Trip planning data
9. **payments** - Payment transactions
10. **reviews** - User reviews for flights/hotels
11. **favorites** - User wishlists
12. **payment_methods** - Saved payment methods

## 🔧 Database Utilities

### Check Status
```bash
python db_utils.py status
```
Shows:
- SQLite version
- Record counts for all tables
- Sample users, flights, and hotels

### Reset Database
```bash
python db_utils.py reset
```
⚠️ **WARNING**: This deletes ALL data and recreates empty tables.

### Run Custom Queries
```bash
# Example: List all users
python db_utils.py query "SELECT email, first_name, last_name FROM users"

# Example: Count flights
python db_utils.py query "SELECT COUNT(*) as total_flights FROM flights"

# Example: Find expensive hotels
python db_utils.py query "SELECT hotel_name, city, price_per_night FROM hotels WHERE price_per_night > 10000"
```

## 🔌 Integration with main.py

To integrate the database with your existing FastAPI application, add these imports and initialization to `backend/main.py`:

```python
# Add at the top of main.py
from database import init_db, get_db, SessionLocal
from models_sqlite import User, Flight, Hotel, FlightBooking, HotelBooking
from sqlalchemy.orm import Session
from fastapi import Depends

# Add at startup
@app.on_event("startup")
async def startup_event():
    init_db()
    print("✅ Database connected and initialized")

# Example endpoint with database
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/users")
def get_users(db: Session = Depends(get_db_session)):
    users = db.query(User).all()
    return {"users": users}
```

## 📍 Database Location

The SQLite database file will be created at:
```
backend/journeyit.db
```

This is a single file that contains your entire database. You can:
- Copy it for backups
- Delete it to reset everything
- Open it with SQLite browsers like DB Browser for SQLite

## 🔄 Switching to PostgreSQL (Future)

When you're ready for production, simply change the `DATABASE_URL` in `.env`:

```bash
# SQLite (current)
DATABASE_URL=sqlite:///./journeyit.db

# PostgreSQL (production)
DATABASE_URL=postgresql://user:password@localhost:5432/journeyit
```

The code supports both without any changes!

## ✨ Sample Data Included

The initialization script creates:

### Users:
- `salman@journeyit.com` (Salman Khan)
- `test@journeyit.com` (Test User)

### Flights:
- AI123: Delhi → Mumbai (₹4,500)
- 6E456: Bangalore → Delhi (₹3,500)
- UK789: Hyderabad → Goa (₹3,680)

### Hotels:
- Taj Mahal Palace, Mumbai (₹15,000/night)
- The Leela Palace, Bangalore (₹12,000/night)
- Marriott Hyderabad (₹6,000/night)

## 🛠️ Next Steps

1. **Run the initialization script** to create your database
2. **Update main.py** to use database endpoints (see integration code above)
3. **Create API endpoints** for:
   - User registration/login with database
   - Saving flight bookings
   - Storing hotel bookings
   - User favorites and reviews

## 💡 Tips

- **SQLite Browser**: Use [DB Browser for SQLite](https://sqlitebrowser.org/) to visually inspect your database
- **Backups**: Simply copy `journeyit.db` file to create backups
- **Reset**: Delete `journeyit.db` and run `init_db.py` to start fresh
- **Migration**: The code is compatible with PostgreSQL when you're ready to scale

## ❓ Troubleshooting

**Problem**: "No module named 'sqlalchemy'"
**Solution**: `pip install sqlalchemy`

**Problem**: "Database is locked"
**Solution**: Close any other programs using the database file

**Problem**: "Table already exists"
**Solution**: Delete `journeyit.db` and run `init_db.py` again

---

Your SQLite database is ready to use! 🎉

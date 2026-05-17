"""
Database Configuration Module for JourneyIt
Supports both SQLite (development) and PostgreSQL (production)
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment or use SQLite default
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./journeyit.db"
)

# Create engine based on database type
if DATABASE_URL.startswith("sqlite"):
    # SQLite configuration
    # check_same_thread=False is required for SQLite with FastAPI
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False  # Set to True to see SQL queries
    )
else:
    # PostgreSQL configuration
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        echo=False
    )

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for declarative models
Base = declarative_base()

# Dependency to get database session
def get_db():
    """
    Dependency function to get database session.
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Initialize database - create all tables.
    Call this on application startup.
    """
    # Import models here to ensure they're registered with Base
    from models_sqlite import (
        User, UserPreference, Address, Flight, Hotel,
        FlightBooking, HotelBooking, Itinerary, Payment,
        Review, Favorite, PaymentMethod
    )
    
    print("[DB] Initializing database...")
    Base.metadata.create_all(bind=engine)
    print("[OK] Database initialized successfully!")
    
    return engine

def drop_db():
    """
    Drop all tables - use with caution!
    """
    print("[!] Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("[OK] Database dropped!")

# Test connection
def test_connection():
    """
    Test database connection.
    """
    try:
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            print("[OK] Database connection successful!")
            return True
    except Exception as e:
        print(f"[X] Database connection failed: {e}")
        return False

if __name__ == "__main__":
    # Test connection when run directly
    print(f"Database URL: {DATABASE_URL}")
    test_connection()
    print("\nTo initialize database, run:")
    print("  python database.py")
    print("\nOr import and call init_db() in your application.")

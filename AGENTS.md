# JourneyIt — Agent Quick Reference

## Project Structure

```
JourneyIt/
├── journeyit-web/          # ACTIVE frontend (Vite + React + TS)
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── pages/          # Route pages
│   │   ├── context/        # React contexts
│   │   └── lib/            # Utils, firebase config
│   └── package.json
├── backend/                # FastAPI backend
│   └── main.py            # All API routes
├── journeyit-frontend/     # DEPRECATED (CRA) — do not use
└── architecture.md        # Comprehensive docs
```

## Frontend (journeyit-web/)

### Stack
- **Vite** + React 19 + TypeScript
- **Tailwind CSS v4** (CSS-based config in `src/index.css`)
- **shadcn/ui** components (new-york style)
- **Framer Motion** for animations
- **Firebase Auth** for authentication

### Critical Conventions

#### Colors — NEVER HARDCODE
Use CSS variables only. All colors must reference theme tokens:
- `bg-background`, `text-foreground`
- `text-primary`, `bg-primary`, `text-primary-foreground`
- `border-border`, `border-input`
- `text-muted-foreground`, `bg-muted`
- `bg-card`, `text-card-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `text-destructive`, `bg-destructive`

BAD: `bg-slate-900`, `text-emerald-600`
GOOD: `bg-secondary`, `text-primary`

#### Adding shadcn Components
```bash
cd journeyit-web
npx shadcn@latest add button card badge carousel
```
Components install to `src/components/ui/`

#### Build Verification
Always run before finishing:
```bash
cd journeyit-web
npm run build
```
TypeScript errors must be resolved.

#### Path Aliases
- `@/components/ui/` — shadcn components
- `@/components/` — custom components
- `@/lib/utils` — cn() helper
- `@/context/` — React contexts
- `@/pages/` — Route pages
- `@/assets/` — Static assets

### Available Scripts
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # TypeScript + Vite build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Backend (backend/)

### Stack
- **FastAPI** (Python 3.11)
- **scikit-learn** (RandomForest model)
- Optional **TensorFlow/Keras** (LSTM models)

### Running Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Key API Endpoints
- `POST /predict-flight-price` — ML price prediction
- `POST /search-flights` — Flight search
- `POST /search-hotels` — Hotel search (3-tier fallback)
- `POST /chat` — AI chatbot
- `POST /send-otp`, `/verify-otp` — Email verification

### ML Models
- `flight_price_model.pkl` — RandomForest (required)
- `lstm_model_*.h5` — Optional LSTM models for time-series
- Training: `train.py` (RandomForest), `train_lstm_model.py` (LSTM)

## Common Tasks

### Adding a New Page
1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Update Navbar links in `src/components/Navbar.tsx`
4. Use CSS variables for all colors

### Using Images
Place in `src/assets/`, import with:
```tsx
import imageName from "@/assets/image.jfif"
```

### Authentication
Use `useAuth()` hook from `@/context/AuthContext`:
```tsx
const { user, logout } = useAuth()
```

## File Locations

| Purpose | Location |
|---------|----------|
| Theme config | `src/index.css` (CSS variables) |
| App router | `src/App.tsx` |
| shadcn components | `src/components/ui/` |
| Custom components | `src/components/` |
| API base URL | `src/` files use `http://127.0.0.1:8000` |
| ML training | `train.py`, `train_lstm_model.py` |

## Gotchas

1. **Two frontend folders exist**: Only use `journeyit-web/` (Vite). `journeyit-frontend/` is deprecated CRA.

2. **Colors must use CSS variables**: Never hardcode `slate-*`, `emerald-*`, or hex values in components. Use theme tokens only.

3. **shadcn CLI**: MCP is configured in `opencode.json`. Use `npx shadcn@latest add <component>`.

4. **Build required**: Always run `npm run build` in `journeyit-web/` before finishing to catch TypeScript errors.

5. **Backend deps**: Root `package.json` has some deps for shadcn, but frontend deps are in `journeyit-web/package.json`.

6. **Carousel**: Use `embla-carousel-react` + `embla-carousel-autoplay` for auto-looping carousels.

7. **Firebase config**: Hardcoded in `src/lib/firebase.ts` — acceptable for client-side.

## Database (SQLite)

### Setup
SQLite database is configured and ready to use:

```bash
cd backend

# Initialize database with sample data
./venv/Scripts/python init_db.py

# Check database status
./venv/Scripts/python db_utils.py

# Run custom SQL queries
./venv/Scripts/python db_utils.py query "SELECT * FROM users"
```

### Database Files
- `backend/journeyit.db` — SQLite database file (auto-created)
- `backend/database.py` — Database connection & session management
- `backend/models_sqlite.py` — SQLAlchemy ORM models (12 tables)
- `backend/init_db.py` — Database initialization with sample data
- `backend/db_utils.py` — Database utility script

### Tables
1. `users` — User accounts and profiles
2. `user_preferences` — User settings and preferences
3. `addresses` — User addresses
4. `flights` — Flight listings
5. `hotels` — Hotel listings
6. `flight_bookings` — Flight reservations
7. `hotel_bookings` — Hotel reservations
8. `itineraries` — Trip planning
9. `payments` — Payment transactions
10. `reviews` — User reviews
11. `favorites` — Wishlist items
12. `payment_methods` — Saved payment methods

### Switching to PostgreSQL
Change `DATABASE_URL` in `backend/.env`:
```bash
# SQLite (development)
DATABASE_URL=sqlite:///./journeyit.db

# PostgreSQL (production)
DATABASE_URL=postgresql://user:password@localhost:5432/journeyit
```

## Backend Virtual Environment

### Setup (Windows)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate and install dependencies
./venv/Scripts/python -m pip install sqlalchemy python-dotenv

# Run with venv Python
./venv/Scripts/python init_db.py
./venv/Scripts/uvicorn main:app --reload
```

### Key Dependencies
- `fastapi` — Web framework
- `uvicorn` — ASGI server
- `sqlalchemy` — ORM for database
- `python-dotenv` — Environment variable management
- `scikit-learn` — ML model (RandomForest)
- `tensorflow` — Optional LSTM models

## Environment Variables

Create `backend/.env` file:

```bash
# Database
DATABASE_URL=sqlite:///./journeyit.db

# External APIs (already have defaults in code)
RAPIDAPI_KEY=your_rapidapi_key
AVIATIONSTACK_KEY=your_aviationstack_key
GEMINI_KEY=your_gemini_key

# Email SMTP for OTP (optional)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## Updated Project Structure

```
JourneyIt/
├── journeyit-web/          # ACTIVE frontend (Vite + React + TS)
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── pages/          # Route pages
│   │   ├── context/        # React contexts
│   │   └── lib/            # Utils, firebase config
│   └── package.json
├── backend/                # FastAPI backend
│   ├── main.py            # All API routes
│   ├── database.py        # Database connection & config
│   ├── models_sqlite.py   # SQLAlchemy ORM models
│   ├── init_db.py         # Database initialization
│   ├── db_utils.py        # Database utilities
│   ├── .env               # Environment variables
│   ├── venv/              # Python virtual environment
│   └── journeyit.db       # SQLite database (auto-created)
├── dataset/               # ML training data
│   ├── Clean_Dataset.csv
│   ├── business.csv
│   ├── economy.csv
│   └── Flights.csv
├── ml_models/             # Trained ML models
│   ├── flight_price_model.pkl
│   └── model_columns.pkl
├── train.py               # RandomForest training script
├── lstm_inference.py      # LSTM inference module
├── architecture.md        # Comprehensive docs
└── AGENTS.md             # This file
```

## Architecture Reference

See `architecture.md` for complete system documentation including:
- API schemas
- ML model details
- Database schema (SQLAlchemy models)
- Request/response flows

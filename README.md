# Major Project

Travel planning platform with flight and hotel search, ML-based price prediction, and AI chatbot.

## Structure

- `journeyit-web/` — Vite + React + TypeScript frontend
- `backend/` — FastAPI backend with SQLite database
- `dataset/` — ML training data
- `train.py` — RandomForest training
- `train_lstm_model.py` — LSTM training

## Quick Start

```bash
cd journeyit-web && npm run dev   # Frontend on :5173
cd backend && uvicorn main:app --reload  # Backend on :8000
```

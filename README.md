# 🚀 Smart Guided Onboarding System

A full-stack interactive onboarding platform that delivers personalized, step-by-step product tours based on user roles. Built for **EDI 8**.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│   React (Vite) + Tailwind CSS + React Joyride   │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Dashboard │  │ TourGuide│  │ ProgressBar  │  │
│  └─────┬────┘  └─────┬────┘  └──────┬───────┘  │
│        │              │              │           │
│        └──────────────┼──────────────┘           │
│                       │                          │
│            OnboardingContext (React Context)      │
│                       │                          │
│                 API Utility (axios)               │
└───────────────────────┬─────────────────────────┘
                        │ HTTP (REST)
┌───────────────────────┴─────────────────────────┐
│                   Backend                        │
│              Python (FastAPI)                    │
│                                                  │
│  GET  /api/onboarding/{user_id}                  │
│  POST /api/onboarding/{user_id}/update           │
│  POST /api/onboarding/{user_id}/complete         │
│                                                  │
│              SQLAlchemy ORM                      │
└───────────────────────┬─────────────────────────┘
                        │
                ┌───────┴───────┐
                │  PostgreSQL   │
                │  (or SQLite)  │
                └───────────────┘
```

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18 (Vite), Tailwind CSS v3    |
| Tour       | react-joyride                       |
| Backend    | Python 3.10+, FastAPI               |
| ORM        | SQLAlchemy 2.0                      |
| Database   | PostgreSQL / SQLite (dev fallback)  |

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Edit with your DB URL
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Features

- 🎯 **Role-based tours** — Admins see extra onboarding steps
- 📊 **Progress tracking** — Real-time step persistence to database
- ⏭️ **Skip & resume** — Users can skip; tour won't return on refresh
- 🌙 **Dark glassmorphism UI** — Modern, premium design aesthetic
- 📱 **Responsive layout** — Works across screen sizes

## Team

Built by **8bitsquad** for EDI 8.

# AI-LMS Backend

FastAPI backend for AI-Powered Learning Management System.

## Setup

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

Open [http://localhost:8000/docs](http://localhost:8000/docs)

## Tech Stack

- FastAPI
- SQLAlchemy
- PostgreSQL/SQLite
- Pydantic

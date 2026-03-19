# User Service
Implementation of User Management and Authentication.

## Tech Stack
- **Language**: Python 3.12
- **Framework**: FastAPI 0.110.0+
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens)

## Dependencies
- `fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, `python-jose`, `passlib`, `python-dotenv`, `pydantic`, `email-validator`

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string.
- `SECRET_KEY`: For JWT signing.
- `ALGORITHM`: JWT algorithm (e.g., HS256).
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time.

## API Endpoints
- `POST /register`: Register a new user.
- `POST /login`: Login and receive a JWT.
- `GET /profile`: Get the current user's profile (requires JWT).
- `GET /health`: Health check.

## 🧪 Testing
To run tests:
```bash
pytest
```

## Running Locally
1. Install dependencies: `pip install -r requirements.txt`
2. Set environment variables in a `.env` file.
3. Run: `uvicorn main:app --reload`

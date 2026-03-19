# User Service

Authentication and user management service.

## Tech Stack
| | |
|-|-|
| **Language** | Python 3.12 |
| **Framework** | FastAPI 0.110 |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Port** | `8000` |

## Dependencies (requirements.txt)
```
fastapi, uvicorn, sqlalchemy, psycopg2-binary,
python-jose[cryptography], python-dotenv, pydantic, redis
```

## Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/userdb
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REDIS_HOST=localhost
```

## Run Locally
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API docs available at: `http://localhost:8000/docs`

## 🧪 Run Tests
```bash
pytest
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT |
| `GET` | `/profile` | ✅ JWT | Get current user profile |
| `GET` | `/info` | ❌ | Service hostname and IP |
| `GET` | `/redis-status` | ❌ | Redis connectivity check |
| `GET` | `/health` | ❌ | Health check |

### Register
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@example.com", "password": "secret"}'
```

### Login
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "secret"}'
# Returns: { "access_token": "...", "token_type": "bearer" }
```

### Profile (Authenticated)
```bash
curl http://localhost:8000/profile \
  -H "Authorization: Bearer <your_token>"
```

## Dockerfile Requirements (for DevOps)
- Base image: `python:3.12-slim`
- Install dependencies: `pip install -r requirements.txt`
- Expose port `8000`
- Run: `uvicorn main:app --host 0.0.0.0 --port 8000`
- Requires PostgreSQL and Redis to be running and accessible

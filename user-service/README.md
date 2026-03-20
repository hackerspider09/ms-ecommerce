# User Service

FastAPI-based authentication and user management service.

## Tech Stack
- **Python 3.12**
- **FastAPI 0.110**
- **PostgreSQL 16**
- **Redis 7**

## Configuration
All configurations are managed via environment variables:
- `DATABASE_URL`: PostgreSQL connection string. `postgresql://<username>:<password>@<host>:<port>/<database>)`
- `REDIS_HOST`: Hostname for Redis connection.
- `REDIS_PORT`: Port for Redis connection.
- Optional
  - `SECRET_KEY`: JWT signing key.
  - `ALGORITHM`: JWT algorithm (e.g., HS256).

## Run Locally
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API Endpoints (Prefix: `/api`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/register` | — | Register a new user |
| `POST` | `/api/login` | — | Login and receive JWT |
| `GET` | `/api/profile` | JWT | Get current user's profile |
| `GET` | `/api/info` | — | Get service hostname and IP |
| `GET` | `/api/redis-status` | — | Check Redis connectivity |
| `GET` | `/api/health` | — | Service health check |

## Examples

### Information
```bash
curl -X GET http://localhost:8000/api/info 
```
### Health
```bash
curl -X GET http://localhost:8000/api/health 
```

### Register
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"devuser","email":"dev@test.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"devuser","password":"password123"}'
```

### Profile
```bash
curl -X GET http://localhost:8000/api/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Running Tests
```bash
pytest
```

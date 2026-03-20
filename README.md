# 🛒 Microservice E-Commerce

A microservices-based e-commerce platform featuring authentication, product management, and order processing.

---

## Architecture

This project consists of 4 main services:

- **Frontend**: React-based user interface.
- **User Service**: Python (FastAPI) service for authentication and user profiles.
- **Product Service**: Node.js (Express) service for the product catalog.
- **Order Service**: Java (Spring Boot) service for order management.

### Service Overview
The frontend communicates directly with each microservice using their respective ports. No central gateway is required for local development.

- **User Service**: [http://localhost:8000/api](http://localhost:8000/api)
- **Product Service**: [http://localhost:3001/api/products](http://localhost:3001/api/products)
- **Order Service**: [http://localhost:8082/api/orders](http://localhost:8082/api/orders)
- **Frontend**: [http://localhost:5173](http://localhost:5173) (Vite default)

---

## Services & Tech Stack

| Service | Language | Runtime | Database | Port |
|---------|----------|---------|----------|------|
| [User Service](user-service/README.md) | Python | 3.12 | PostgreSQL 16 | 8000 |
| [Product Service](product-service/README.md) | Node.js | 20 (LTS) | MongoDB 7 | 3001 |
| [Order Service](order-service/README.md) | Java | 21 | PostgreSQL 16 | 8082 |
| [Frontend](frontend/README.md) | JavaScript | Node 20 | — | 5173 |

### Shared Infrastructure
- **Redis 7**: Used by User Service for session/cache status.

---

## Local Development Setup

To run the full system locally, follow the [Running Order](#running-order) and ensure all [Environment Variables](#environment-variables) are set.

### Running Order
1. **Databases**: Start PostgreSQL (instances for User and Order), MongoDB, and Redis.
2. **User Service**: Start after PostgreSQL and Redis are ready.
3. **Product Service**: Start after MongoDB is ready.
4. **Order Service**: Start after Product Service is ready (required for price fetching).
5. **Frontend**: Run the development server (`npm run dev`).

---

## Environment Variables

### User Service
```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
REDIS_HOST=localhost
REDIS_PORT=6379
Optional: 
    SECRET_KEY=your-secret-key
    ALGORITHM=HS256
```

### Product Service
```env
MONGODB_URI=mongodb://<username>:<password>@<host>:<port>/<database>?authSource=admin
```

### Order Service
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:<port>/<database>
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=password
PRODUCT_SERVICE_URL=http://localhost:3001
```

### Frontend
```env
VITE_USER_SERVICE_URL=http://localhost:8000
VITE_PRODUCT_SERVICE_URL=http://localhost:3001
VITE_ORDER_SERVICE_URL=http://localhost:8082
```

---

## Testing & Data

### Run Service Tests
```bash
# User Service
cd user-service && pytest

# Product Service
cd product-service && npm test

# Order Service
cd order-service && ./mvnw test
```

### Seed Product Database
```bash
cd product-service && npm run seed
```

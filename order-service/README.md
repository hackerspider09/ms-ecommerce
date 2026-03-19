# Order Service
Implementation of the Order Management System.

## Tech Stack
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.4
- **Database**: PostgreSQL (via Spring Data JPA)
- **Build Tool**: Maven

## Dependencies
- `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `postgresql`, `lombok`

## Inter-service Communication
- Calls **Product Service** to verify product prices before creating an order.

## Environment Variables
- `SPRING_DATASOURCE_URL`: PostgreSQL connection string.
- `SPRING_DATASOURCE_USERNAME`: DB username.
- `SPRING_DATASOURCE_PASSWORD`: DB password.
- `PRODUCT_SERVICE_URL`: URL of the Product Service (e.g., `http://product-service:3001`).

## API Endpoints
- `POST /api/orders`: Place a new order.
- `GET /api/orders/user/{userId}`: Get all orders for a specific user.

## 🧪 Testing
To run tests:
```bash
./mvnw test
```

## Running Locally
1. Ensure PostgreSQL is running.
2. Run: `./mvnw spring-boot:run`

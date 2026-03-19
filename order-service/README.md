# Order Service

Spring Boot order processing service that communicates with the Product Service.

## Tech Stack
- **Java 21**
- **Spring Boot 3.2.4**
- **PostgreSQL 16**

## Configuration
All configurations can be set via environment variables or `src/main/resources/application.properties`:
- `SPRING_DATASOURCE_URL`: PostgreSQL connection string.
- `SPRING_DATASOURCE_USERNAME`: Database username.
- `SPRING_DATASOURCE_PASSWORD`: Database password.
- `SERVER_PORT`: Port for the server (default: 8082).
- `PRODUCT_SERVICE_URL`: URL of the Product Service (e.g., http://localhost:3001).

## Run Locally
```bash
./mvnw spring-boot:run
```

## API Endpoints (Prefix: `/api/orders`)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders/user/{userId}` | List all orders for a user |
| `GET` | `/api/orders/info` | Get service hostname and IP |
| `GET` | `/api/orders/health` | Service health check |

## Examples

### Place Order
```bash
curl -X POST http://localhost:8082/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"orderItems":[{"productId":"<mongo_id>","quantity":2}]}'
```

## Running Tests
```bash
./mvnw test
```

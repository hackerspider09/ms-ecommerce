# Order Service

Spring Boot order processing service that communicates with the Product Service.

## Tech Stack
- **Java 21**
- **Spring Boot 3.2.4**
- **PostgreSQL 16**

## Service Details

- Service Name: Order Service
- Default Port: `8082`
- Base URL: `http://localhost:8082`
- DB Name: `orderdb`

## Configuration
All configurations can be set via environment variables or `src/main/resources/application.properties`:
- `SPRING_DATASOURCE_URL`: PostgreSQL connection string. `jdbc:postgresql://<host>:<port>/<database>`
- `SPRING_DATASOURCE_USERNAME`: Database username.
- `SPRING_DATASOURCE_PASSWORD`: Database password.
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

### Health
```bash
curl -X GET http://localhost:8082/api/orders/health 
```

### Information
```bash
curl -X POST http://localhost:8082/api/orders/info 
```

## Running Tests
```bash
./mvnw test
```

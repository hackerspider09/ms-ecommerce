# Order Service

Order management service with inter-service communication to Product Service.

## Tech Stack
| | |
|-|-|
| **Language** | Java 21 |
| **Framework** | Spring Boot 3.2.4 |
| **Build Tool** | Maven 3.9 |
| **Database** | PostgreSQL 16 |
| **Port** | `8082` |

## Key Dependencies (pom.xml)
```xml
spring-boot-starter-web
spring-boot-starter-data-jpa
postgresql (driver)
lombok
```

## Configuration (src/main/resources/application.properties)
```properties
server.port=8082
spring.datasource.url=jdbc:postgresql://localhost:5432/orderdb
spring.datasource.username=user
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
product.service.url=http://localhost:3001
```

For Docker/production, override these via environment variables:
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://order-db:5432/orderdb
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=password
PRODUCT_SERVICE_URL=http://product-service:3001
```

## Run Locally
```bash
# Requires Java 21 and PostgreSQL running locally
./mvnw spring-boot:run
```

## 🧪 Run Tests
```bash
./mvnw test
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders/user/{userId}` | Get orders for a user |
| `GET` | `/api/orders/info` | Service hostname and IP |
| `GET` | `/api/orders/health` | Health check |

### Place Order
```bash
curl -X POST http://localhost:8082/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "orderItems": [
      { "productId": "<mongo_product_id>", "quantity": 2 }
    ]
  }'
```

### Get User Orders
```bash
curl http://localhost:8082/api/orders/user/1
```

## Inter-Service Dependency
When placing an order, the Order Service calls:
```
GET http://product-service:3001/api/products/{productId}
```
to fetch the current price. **Product Service must be running** for orders to work correctly.

## Dockerfile Requirements (for DevOps)
This service requires a **multi-stage Docker build**:

**Stage 1 — Build:**
- Base: `maven:3.9-eclipse-temurin-21-alpine`
- Run `mvn dependency:go-offline` then `mvn package -DskipTests`

**Stage 2 — Run:**
- Base: `eclipse-temurin:21-jre-alpine`
- Copy the JAR from stage 1
- Expose port `8082`
- Run: `java -jar app.jar`

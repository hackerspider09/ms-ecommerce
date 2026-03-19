# 🛒 Microservice E-Commerce — DevOps Starter

> **Branch:** `main` — Application source code only. Your job as a DevOps Engineer is to write the containerization, orchestration, and deployment configuration.
>
> **Need the complete solution?** → `git checkout fullcode`

---

## 🧩 System Architecture

```
Internet
    │
    ▼
[Gateway — Nginx :80]
    ├── /              → Frontend  (React)
    ├── /api/users/    → User Service    (FastAPI   :8000)
    ├── /api/products  → Product Service (Express   :3001)
    └── /api/orders    → Order Service   (Spring Boot :8082)
```

### Inter-Service Communication
- **Order Service** calls **Product Service** at `http://product-service:3001` to fetch product prices when an order is placed.

---

## 📦 Services & Dependencies

### 1. User Service
| Property | Value |
|----------|-------|
| **Language** | Python 3.12 |
| **Framework** | FastAPI 0.110+ |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Port** | 8000 |
| **DB Name** | `userdb` |

**Required Environment Variables:**
```env
DATABASE_URL=postgresql://user:password@user-db:5432/userdb
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REDIS_HOST=redis
```

---

### 2. Product Service
| Property | Value |
|----------|-------|
| **Language** | Node.js 20 (LTS) |
| **Framework** | Express 4.19 |
| **Database** | MongoDB 7 |
| **Port** | 3001 |

**Required Environment Variables:**
```env
MONGODB_URI=mongodb://product-db:27017/productdb
PORT=3001
```

---

### 3. Order Service
| Property | Value |
|----------|-------|
| **Language** | Java 21 |
| **Framework** | Spring Boot 3.2.4 |
| **Build Tool** | Maven 3.9 |
| **Database** | PostgreSQL 16 |
| **Port** | 8082 |
| **DB Name** | `orderdb` |

**Required Environment Variables (or `application.properties`):**
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://order-db:5432/orderdb
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=password
PRODUCT_SERVICE_URL=http://product-service:3001
```

---

### 4. Frontend
| Property | Value |
|----------|-------|
| **Language** | JavaScript (Node.js 20) |
| **Framework** | React 18, Vite 5 |
| **Port** | 80 (served via Nginx in production) |

> The frontend expects all API calls to go through a gateway at `/api/*`. Configure Nginx to proxy these.

---

### 5. Gateway (Nginx)
| Property | Value |
|----------|-------|
| **Image** | nginx:stable-alpine |
| **Port** | 80 |

**Routing Rules to Implement:**
```
/              → proxy to frontend:80
/api/users/    → proxy to user-service:8000/ (strip prefix)
/api/products  → proxy to product-service:3001 (pass full path)
/api/orders    → proxy to order-service:8082  (pass full path)
```

> See `fullcode` branch `gateway/README.md` for a full explanation of trailing slash behavior in Nginx proxy_pass.

---

### 6. Redis
| Property | Value |
|----------|-------|
| **Image** | redis:7-alpine |
| **Port** | 6379 |

Used by the User Service to verify cache connectivity (shown on the Infrastructure page).

---

## 🗄️ Databases Summary

| Database | Type | Port | Used By |
|----------|------|------|---------|
| `user-db` | PostgreSQL 16 | 5432 | User Service |
| `product-db` | MongoDB 7 | 27017 | Product Service |
| `order-db` | PostgreSQL 16 | 5432 | Order Service |
| `redis` | Redis 7 | 6379 | User Service |

---

## 🏗️ What You Need to Create

```
├── user-service/Dockerfile      # Python 3.12 slim, pip install, uvicorn
├── product-service/Dockerfile   # Node 20 slim, npm install
├── order-service/Dockerfile     # Multi-stage: Maven build → JRE 21 run
├── frontend/Dockerfile          # Multi-stage: Node build → Nginx serve
├── docker-compose.yml           # Wire up all 8 containers + volumes + networks
├── gateway/
│   ├── Dockerfile               # FROM nginx:stable-alpine + copy conf
│   └── nginx.conf               # Reverse proxy routing
└── infra/k8s/                   # Kubernetes Deployments, Services, ConfigMaps
```

---

## 📚 Service READMEs
Each service has its own README with running instructions, API endpoints, and test commands:
- [User Service →](user-service/README.md)
- [Product Service →](product-service/README.md)
- [Order Service →](order-service/README.md)
- [Frontend →](frontend/README.md)

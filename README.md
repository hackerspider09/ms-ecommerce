# Microservice E-Commerce

A full-stack, production-ready microservices e-commerce application. This project demonstrates real-world microservices architecture with a **DevOps-first** mindset.

## 📁 Branches
| Branch | Purpose |
|--------|---------|
| `fullcode` | ✅ **Complete working application** — all services coded and functional |
| `main` | 🏗️ **DevOps Starter** — Service skeleton code, infrastructure files ready, business logic removed for practice |

> 🎯 **Use `main` to practice**: Docker, Nginx, CI/CD, Kubernetes, monitoring. The infrastructure is set up for you — your job is to implement the service logic.

---

## 🧩 Architecture

```
Browser → Gateway (Nginx:80) → User Service (FastAPI:8000)
                              → Product Service (Express:3001)  
                              → Order Service (Spring Boot:8082)
                              → Frontend (React:80)
```

### Services
| Service | Tech | DB | Port |
|---------|------|----|------|
| Gateway | Nginx | - | 80 |
| Frontend | React + Vite | - | 3000 |
| User Service | Python (FastAPI) | PostgreSQL | 8000 |
| Product Service | Node.js (Express) | MongoDB | 3001 |
| Order Service | Java (Spring Boot) | PostgreSQL | 8082 |
| Redis | Redis 7 | - | 6379 |

---

## 🚀 Quick Start

### Prerequisites
- Docker 24+
- Docker Compose v2

### Run the full app
```bash
# Clone and switch to the complete branch
git clone <your-repo-url>
git checkout fullcode

# Start everything
docker compose up --build

# Visit: http://localhost
```

### Seed the product database
```bash
docker compose exec product-service npm run seed
```

### Run tests
```bash
# User Service
docker compose exec user-service pytest

# Product Service
docker compose exec product-service npm test

# Order Service
docker compose exec order-service mvn test
```

---

## 📖 Nginx Routing
See [gateway/README.md](gateway/README.md) for a detailed explanation of how Nginx proxies requests and the difference between `proxy_pass http://host/` vs `http://host`.

---

## 📂 Project Structure
```
├── frontend/         React app (Vite)
├── user-service/     Python FastAPI (JWT auth)
├── product-service/  Node.js Express (product catalog)
├── order-service/    Java Spring Boot (order management)
├── gateway/          Nginx reverse proxy
├── infra/
│   └── k8s/         Kubernetes manifests
└── docker-compose.yml
```

---

## 🌱 Future Improvements
- [ ] Prometheus & Grafana monitoring
- [ ] RabbitMQ/Kafka for async order processing
- [ ] GitHub Actions CI/CD pipeline
- [ ] Redis caching for product listings

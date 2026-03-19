# Microservice E-Commerce — DevOps Starter (main branch)

> 🏗️ This is the **starter branch**. The infrastructure is ready — your job is to implement the business logic inside each service.
>
> 🔍 Switch to `fullcode` branch to see the complete working solution.

---

## 🎯 Your Mission

This project simulates a real-world production system. The Docker, Nginx, and database configurations are all set up. **You need to implement the service code** inside each service directory.

### What's already done ✅
- `docker-compose.yml` with all services wired up
- Nginx gateway routing rules
- Database connections and models
- Kubernetes manifests in `infra/k8s/`
- Dockerfiles for every service

### What you build 🏗️
| Service | Your Task |
|---------|-----------|
| `user-service/` | Register/Login endpoints, JWT auth |
| `product-service/` | CRUD product routes |
| `order-service/` | Place order, call product-service |
| `frontend/` | Connect UI to backend APIs |

---

## 🚀 Quick Start

```bash
docker compose up --build
# http://localhost
```

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite 5
- **User Service**: Python 3.12, FastAPI
- **Product Service**: Node.js 20, Express
- **Order Service**: Java 21, Spring Boot 3.2
- **Gateway**: Nginx
- **Databases**: PostgreSQL 16, MongoDB 7
- **Cache**: Redis 7

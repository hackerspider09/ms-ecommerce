# Microservice E-Commerce — DevOps Starter (main branch)

> 🏗️ **This is the DevOps starter branch.**
>
> The **application source code is complete and working.** Your job as a DevOps engineer is to containerize, orchestrate, and deploy this system.
>
> ✅ Switch to `fullcode` branch to see the complete solution with all DevOps files included.

---

## 🎯 Your Mission

| Task | What to Create |
|------|----------------|
| **Containerize** | Write a `Dockerfile` for each of the 4 services |
| **Orchestrate locally** | Write a `docker-compose.yml` to run all services together |
| **Gateway** | Set up an Nginx reverse proxy to route `/api/*` traffic |
| **Deploy** | Write Kubernetes manifests in `infra/k8s/` |
| **CI/CD** | Create GitHub Actions pipeline |

---

## 🧩 Services (Source Code Provided)

| Service | Language | What It Does | Port |
|---------|----------|--------------|------|
| `user-service/` | Python 3.12 (FastAPI) | Auth, JWT, Register/Login | 8000 |
| `product-service/` | Node.js 20 (Express) | Product CRUD, MongoDB | 3001 |
| `order-service/` | Java 21 (Spring Boot) | Orders, calls Product Service | 8082 |
| `frontend/` | React 18 (Vite) | UI, calls all services | 3000 |

---

## 📋 Service Details

### User Service (`user-service/`)
- **Run locally**: `pip install -r requirements.txt && uvicorn main:app --reload`
- **Database**: PostgreSQL (`DATABASE_URL` env var)
- **Auth**: JWT (`SECRET_KEY`, `ALGORITHM` env vars)

### Product Service (`product-service/`)
- **Run locally**: `npm install && npm start`
- **Database**: MongoDB (`MONGODB_URI` env var)

### Order Service (`order-service/`)
- **Run locally**: `./mvnw spring-boot:run`
- **Database**: PostgreSQL
- **Calls**: Product Service (`product.service.url` property)

### Frontend (`frontend/`)
- **Run locally**: `npm install && npm run dev`
- **Expects**: All services proxied through `/api/*`

---

## 🏗️ What DevOps Files Are Needed

```
├── user-service/Dockerfile
├── product-service/Dockerfile
├── order-service/Dockerfile
├── frontend/Dockerfile
├── docker-compose.yml        ← wire up all services + databases
├── gateway/
│   ├── Dockerfile
│   └── nginx.conf            ← reverse proxy config
└── infra/
    └── k8s/                  ← k8s deployments, services, configmaps
```

> 💡 Tip: Check the `fullcode` branch to see how it was done if you get stuck on a specific service.

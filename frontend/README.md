# Frontend

React e-commerce UI with product listing, cart, checkout, and infrastructure dashboard.

## Tech Stack
| | |
|-|-|
| **Language** | JavaScript (ES2022) |
| **Framework** | React 18, Vite 5 |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios |
| **Node Version** | 20 (LTS) |

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Product grid + Add to Cart + Checkout |
| `/signup` | Signup | Register a new account |
| `/login` | Login | Login and set JWT |
| `/orders` | My Orders | View past orders (auth required) |
| `/add-product` | Add Product | Add a new product (auth required) |
| `/status` | Infrastructure | Live service IPs and Redis status |

## API Calls (via Nginx proxy)

| Axios Instance | Base URL | Service |
|----------------|----------|---------|
| `userApi` | `/api/users` | User Service |
| `productApi` | `/api/products` | Product Service |
| `orderApi` | `/api/orders` | Order Service |

> All API calls go through the Nginx gateway — no direct service URLs in the frontend code.

## Run Locally (Dev Mode)
```bash
npm install
npm run dev
# http://localhost:5173
```
> In dev mode, Vite proxies `/api` calls to the gateway. In production, Nginx handles it.

## Build for Production
```bash
npm run build
# output in dist/
```

## Dockerfile Requirements (for DevOps)
Multi-stage build:

**Stage 1 — Build:**
- Base: `node:20-slim`
- Run `npm install` then `npm run build`

**Stage 2 — Serve:**
- Base: `nginx:stable-alpine`
- Copy `dist/` into `/usr/share/nginx/html`
- Add a custom `nginx.conf` with SPA fallback:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
- Expose port `80`

> The SPA fallback is **required** so that direct URL access (e.g. `http://localhost/status`) works correctly instead of returning 404.

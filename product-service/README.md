# Product Service

Product catalog CRUD API.

## Tech Stack
| | |
|-|-|
| **Language** | Node.js 20 (LTS) |
| **Framework** | Express 4.19 |
| **Database** | MongoDB 7 |
| **Port** | `3001` |

## Dependencies (package.json)
```
express, mongoose, cors, dotenv
devDependencies: nodemon, jest, supertest
```

## Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/productdb
PORT=3001
```

## Run Locally
```bash
npm install
npm start          # production
npm run dev        # with hot reload (nodemon)
```

## 🧪 Run Tests
```bash
npm test
```

## 🌱 Seed Database
Populate with sample products:
```bash
npm run seed
# or inside docker: docker compose exec product-service npm run seed
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/products` | List all products |
| `POST` | `/api/products` | Create a product |
| `GET` | `/api/products/:id` | Get product by ID |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |
| `GET` | `/api/products/info` | Service hostname and IP |
| `GET` | `/health` | Health check |

### List Products
```bash
curl http://localhost:3001/api/products
```

### Create Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Pro",
    "description": "High-performance laptop",
    "price": 1499,
    "category": "Electronics",
    "stock": 30
  }'
```

### Get by ID
```bash
curl http://localhost:3001/api/products/<product_id>
```

## Product Schema
```json
{
  "name": "string (required)",
  "description": "string",
  "price": "number (required)",
  "category": "string",
  "stock": "number",
  "imageUrl": "string"
}
```

## Dockerfile Requirements (for DevOps)
- Base image: `node:20-slim`
- Install production deps: `npm install --omit=dev`
- Expose port `3001`
- Run: `node index.js`
- Requires MongoDB to be running and accessible

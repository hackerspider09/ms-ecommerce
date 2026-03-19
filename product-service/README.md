# Product Service

Express.js product catalog service with MongoDB integration.

## Tech Stack
- **Node.js 20**
- **Express 4.19**
- **MongoDB 7**

## Configuration
All configurations are managed via environment variables:
- `MONGODB_URI`: MongoDB connection string.
- `PORT`: Port for the server (default: 3001).

## Run Locally
```bash
npm install
npm start
```
For development with hot reload: `npm run dev`

## API Endpoints (Prefix: `/api/products`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/products` | List all products |
| `POST` | `/api/products` | Add a new product |
| `GET` | `/api/products/:id` | Get details for a specific product |
| `PUT` | `/api/products/:id` | Update product information |
| `DELETE` | `/api/products/:id` | Remove a product |
| `GET` | `/api/products/info` | Get service hostname and IP |
| `GET` | `/api/products/health` | Service health check |

## Seeding Sample Data
```bash
npm run seed
```

## Running Tests
```bash
npm test
```

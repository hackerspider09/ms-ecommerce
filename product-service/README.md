# Product Service
Implementation of the Product Catalog.

## Tech Stack
- **Language**: Node.js 20
- **Framework**: Express 4.19+
- **Database**: MongoDB

## Dependencies
- `express`, `mongoose`, `dotenv`, `cors`

## Environment Variables
- `MONGODB_URI`: MongoDB connection string.
- `PORT`: Service port (default 3001).

## API Endpoints
- `GET /api/products`: List all products.
- `POST /api/products`: Create a new product.
- `GET /api/products/:id`: Get product by ID.
- `PUT /api/products/:id`: Update a product.
- `DELETE /api/products/:id`: Delete a product.

## 🧪 Testing
To run tests:
```bash
npm test
```

## Running Locally
1. Install dependencies: `npm install`
2. Set environment variables in a `.env` file.
3. Run: `npm start`

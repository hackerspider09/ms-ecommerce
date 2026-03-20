# Frontend

React-based e-commerce storefront.

## Tech Stack
- **React 18**
- **Vite 5**
- **Axios**
- **Node.js 20**

## Run Locally (Development)
```bash
npm install
npm run dev
```

## Service Details

- Service Name: Frontend
- Default Port: `5173`
- Base URL: `http://localhost:5173`

The development server runs on the default Vite port: **5173**.

## Configuration
The frontend uses environment variables (via Vite) to connect to backend services. You can set these in a `.env` file:

```env
VITE_USER_SERVICE_URL=http://localhost:8000
VITE_PRODUCT_SERVICE_URL=http://localhost:3001
VITE_ORDER_SERVICE_URL=http://localhost:8082
```

## Build for Production
To generate a production-ready build:
```bash
npm run build
```
The output will be in the `dist/` directory.

### Key Pages
- `Home`: Product browsing and cart.
- `Product Details`: Detailed product information.
- `Checkout`: Order placement.
- `Profile/Orders`: User session and history.
- `Status`: System infrastructure overview.

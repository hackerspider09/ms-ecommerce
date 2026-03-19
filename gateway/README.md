# Gateway Service
Nginx Reverse Proxy for the microservices architecture.

## How it Works
The gateway acts as the single entry point for the entire system. It routes requests based on the URL path.

### Root Routing (`/`)
The `location /` block serves the static files of the **Frontend** application.
- When you visit `http://localhost`, Nginx looks into the `/usr/share/nginx/html` directory.
- For Single Page Applications (SPA), any unknown path is redirected to `index.html` so React Router can handle it.

### API Routing (`/api/...`)
Requests starting with `/api` are proxied to their respective services. There are two main ways this happens:

#### 1. Strip Prefix (Using Trailing Slash)
In the User Service configuration:
```nginx
location /api/users/ {
    proxy_pass http://user-service:8000/;
}
```
- **Behavior**: Nginx replaces the matched part (`/api/users/`) with the path in `proxy_pass` (`/`).
- **Example**: A request to `/api/users/login` becomes `/login` when it reaches the User Service.
- **Why?**: Because the Python code for the User Service does not have `/api/users` in its route definitions.

#### 2. Pass Full Path (No Trailing Slash)
In the Product and Order Service configurations:
```nginx
location /api/products {
    proxy_pass http://product-service:3001;
}
```
- **Behavior**: Nginx passes the **entire original URI** to the backend service.
- **Example**: A request to `/api/products/123` reaches the Product Service as `/api/products/123`.
- **Why?**: Because the Node.js and Java code for these services already include the `/api/products` or `/api/orders` prefix in their controllers.


#### 3. Trailing Slash Mismatch (A Common Pitfall)
If you define `location` **without** a slash but `proxy_pass` **with** one:
```nginx
location /api/products {
    proxy_pass http://product-service:3001/;
}
```
- **Result**: A request to `/api/products/123` can result in a double slash `//123` at the backend.
- **Why?**: Nginx matches `/api/products` and replaces it with `/`. The remaining string `/123` is appended to `/`, making `//123`.
- **Best Practice**: Always match the trailing slash in the `location` if you use it in the `proxy_pass`.

### Summary Table
| Config Type | Trailing Slash in `proxy_pass`? | Effect | Used When... |
|-------------|--------------------------------|--------|--------------|
| **Strip Prefix** | Yes (`http://host/`) | Replaces prefix | Backend *doesn't* have prefix in code |
| **Full Path** | No (`http://host`) | Passes entire URI | Backend *already has* prefix in code |

## Configuration
The main configuration is located in `nginx.conf`.

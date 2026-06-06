# k8s/gateway

Kubernetes Gateway API manifests for the ms-ecommerce project using [Envoy Gateway](https://gateway.envoyproxy.io/).

## Directory Structure

```
gateway/
├── base/               # Shared Gateway + HTTPRoute definitions
│   ├── gateway.yaml    # Gateway resource (listeners on port 80, 8080)
│   ├── http-route.yaml # HTTPRoute rules (path-based routing to services)
│   ├── namespace.yaml  # ms-gateway namespace
│   └── kustomization.yaml
├── dev/                # Dev-only overrides (NodePort instead of LoadBalancer)
│   ├── gatewayClass.yaml       # GatewayClass pointing to local-dev-service EnvoyProxy
│   ├── envoy-service-dev.yaml  # EnvoyProxy with NodePort patch
│   └── kustomization.yaml
└── prod/               # Prod overrides (LoadBalancer, TLS, etc.)
```

---

## Why targetPort 10080 and not 80?

Envoy Gateway automatically adds an offset of **+10000** to any privileged port (< 1024) when binding inside the container.

| Gateway listener port | Actual container port |
|---|---|
| `80`  | `10080` |
| `443` | `10443` |
| `8080`| `18080` |

**Reason:** The Envoy container runs without the `CAP_NET_BIND_SERVICE` Linux capability, which is required to bind ports below 1024. To avoid needing root privileges, Envoy Gateway shifts the port internally and the K8s Service bridges them.

```
External (NodePort 30010)
    → K8s Service port 80
        → targetPort 10080  (actual Envoy container port)
            → Envoy listener (configured as port 80 in gateway.yaml)
```

### Verifying on the node

```bash
curl localhost:19000/listeners
```

You will see something like:
```
ms-gateway/ms-gateway/http::0.0.0.0:10080
ms-gateway/ms-gateway/http-8080::0.0.0.0:18080
```

The listener name says `http` (port 80 from the Gateway spec), but it is actually bound to `10080` - that is the offset in action.

### To disable this behavior

If you ever want Envoy to bind directly on the privileged port (e.g., when running privileged or in host-network mode), set `useListenerPortAsContainerPort: true` in the `EnvoyProxy` spec:

```yaml
spec:
  provider:
    type: Kubernetes
    kubernetes:
      useListenerPortAsContainerPort: true
```

---

## Official References

- **Port offset / `useListenerPortAsContainerPort` field:**
  https://gateway.envoyproxy.io/v1.2/api/extension_types/#envoyproxykubernetesprovider

- **Why this exists (security - no CAP_NET_BIND_SERVICE):**
  https://gateway.envoyproxy.io/latest/tasks/security/restrict-envoy-container-capabilities/

- **EnvoyProxy API reference:**
  https://gateway.envoyproxy.io/v1.2/api/extension_types/#envoyproxy



# HTTP-ROute

Let's use **your exact HTTPRoute** and think of it like a receptionist in an office.

When a request comes to your AWS Load Balancer:

```text
http://alb.amazonaws.com/api/products/123
```

the Gateway receives it first.

The **HTTPRoute** is the receptionist's rulebook:

> "If someone asks for X, send them to Y."

---

## Structure of HTTPRoute

```yaml
spec:
  parentRefs:
  - name: ms-gateway

  rules:
  - matches:
    ...
    backendRefs:
    ...
```

### parentRefs

```yaml
parentRefs:
- name: ms-gateway
```

This means:

> Attach this route to the Gateway named `ms-gateway`.

Think:

```text
Internet
    ↓
AWS Load Balancer
    ↓
Gateway (ms-gateway)
    ↓
HTTPRoute (your rules)
    ↓
Services
```

---

# Rule 1

```yaml
- matches:
  - path:
      type: PathPrefix
      value: /

  backendRefs:
  - name: frontend-service
    port: 5173
```

Meaning:

```text
If path starts with "/"
send to frontend-service
```

Examples:

```text
/                     -> frontend
/home                 -> frontend
/products             -> frontend
/about                -> frontend
```

This is your catch-all route.

---

# Rule 2

```yaml
- matches:
  - path:
      type: PathPrefix
      value: /api/

  backendRefs:
  - name: userservice-service
    port: 8000
```

Meaning:

```text
/api/* -> userservice
```

Examples:

```text
/api/login
/api/register
/api/profile
```

go to:

```text
userservice-service:8000
```

---

# How Gateway chooses

Suppose request is:

```text
/api/products/123
```

It matches:

```text
/
```

and

```text
/api/
```

and

```text
/api/products
```

all three!

Gateway chooses the **most specific path**.

Think of specificity like:

```text
/                  score 1
/api/              score 2
/api/products      score 3
```

Winner:

```text
/ api/products
```

So request goes to:

```text
productservice-service
```

---

## Why backendRefs is outside matches


```yaml
- matches:
  - path: /api/users
  - path: /api/customers
  - path: /api/accounts

  backendRefs:
  - name: userservice
```

This means:

```text
/api/users      \
/api/customers   ---> userservice
/api/accounts   /
```

All three paths go to the same backend.

That's why the design is:

```text
matches  ---> backendRefs
```

rather than:

```text
path ---> backend
path ---> backend
path ---> backend
```

which would repeat the backend many times.

---

# Mental model

Whenever you see a rule, read it as:

```yaml
- matches:
    <conditions>

  backendRefs:
    <destination>
```

Translate it to English:

> If the request matches these conditions, send it to this destination.

For example:

```yaml
- matches:
  - path:
      value: /api/orders

  backendRefs:
  - name: orderservice
```

becomes:

> If URL starts with `/api/orders`, send it to `orderservice`.



## install nginx gateay
doc: https://docs.nginx.com/nginx-gateway-fabric/get-started/

to add Gateway api resource (crd): kubectl kustomize "https://github.com/nginx/nginx-gateway-fabric/config/crd/gateway-api/standard?ref=v2.5.1" | kubectl apply -f -

to install gateway controller: helm install ngf oci://ghcr.io/nginx/charts/nginx-gateway-fabric --create-namespace -n nginx-gateway --set nginx.service.type=NodePort --set-json 'nginx.service.nodePorts=[{"port":30007,"listenerPort":80}, {"port":30008,"listenerPort":8080}]'

helm install ngf oci://ghcr.io/nginx/charts/nginx-gateway-fabric --create-namespace -n nginx-gateway --set nginx.service.type=NodePort --set-json 'nginx.service.nodePorts=[{"port":30007,"listenerPort":80}]'

## gateway api working


Think of Gateway API like this:

* It is just a **set of Kubernetes CRDs (like Ingress, but better)**
* It does **NOT route traffic by itself**
* You need a **controller** (like NGINX Gateway Fabric) to actually make it work

👉 So:

| Layer                                 | What it does               |
| ------------------------------------- | -------------------------- |
| **CRDs (Gateway API)**                | Define *what you want*     |
| **Controller (NGINX Gateway Fabric)** | Makes it *actually happen* |

---

# 🔧 What you installed

### 1. CRDs

```bash
kubectl kustomize ... | kubectl apply -f -
```

This created new Kubernetes objects:

* `GatewayClass`
* `Gateway`
* `HTTPRoute`
* etc.

👉 These are just **schemas**, not working resources yet.

---

### 2. Controller (NGINX Gateway Fabric)

```bash
helm install ngf ...
```

This installs:

* Pods (controller)
* Service (NodePort in your case)

👉 This is the **brain** that:

* Watches Gateway API objects
* Configures NGINX internally
* Routes traffic

---

# 🤔 Why in above used nginx controller doc didn’t create GatewayClass manually?

The controller **auto-creates a GatewayClass**

For example, NGINX Gateway Fabric creates something like:

```
nginx
```

Check it:

```bash
kubectl get gatewayclass
```

You’ll see something like:

```
NAME    CONTROLLER
nginx   nginx.org/gateway-controller
```

👉 So docs skip manual creation because:

* Controller already provides one

---

# 🧱 The 3 Core Components (Simple Mental Model)

## 1. GatewayClass → "Which controller?"

Like:

> “Which system will handle traffic?”

Example:

```yaml
kind: GatewayClass
spec:
  controllerName: nginx.org/gateway-controller
```

👉 You usually **don’t touch this** unless building your own controller.

---

## 2. Gateway → "Entry point (LoadBalancer)"

Like:

> “Open port 80 and accept traffic”

Example:

```yaml
kind: Gateway
spec:
  gatewayClassName: nginx
  listeners:
  - port: 80
    protocol: HTTP
```

👉 This is like **Ingress Controller Service**

---

## 3. HTTPRoute → "Routing rules"

Like:

> “/api → service A”

Example:

```yaml
kind: HTTPRoute
spec:
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /api
    backendRefs:
    - name: my-service
      port: 80
```

---

# 🔁 How everything connects (IMPORTANT)

```
Client → NodePort → Gateway → HTTPRoute → Service → Pod
```

Step-by-step:

1. Request hits:

   ```
   localhost:31437
   ```

2. Goes to:

   * NGINX (via NodePort)

3. NGINX checks:

   * Gateway (what ports are open)
   * HTTPRoute (where to send traffic)

4. Routes to:

   * Kubernetes Service → Pod

---

# ⚙️ What is the Controller doing internally?

The controller (NGF) is constantly watching:

```bash
kubectl get gateway
kubectl get httproute
```

When you create/update:

* It converts them into **NGINX config**
* Reloads NGINX

👉 It’s basically:

> “Gateway API → NGINX config translator”

---

# 🧪 Minimal Working Example (for your KIND setup)

## 1. Create Gateway

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: my-gateway
spec:
  gatewayClassName: nginx
  listeners:
  - name: http
    protocol: HTTP
    port: 80
```

---

## 2. Create HTTPRoute

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: my-route
spec:
  parentRefs:
  - name: my-gateway
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: my-service
      port: 80
```

---

## 3. Access it

Since you used NodePort:

```
http://localhost:31437
```

---

# ⚠️ Common confusion (you hit this)

### ❌ "Why only route, no class?"

Because:

* Controller auto-creates GatewayClass

---

### ❌ "Why nothing works after CRD install?"

Because:

* CRDs ≠ running system
* You need controller

---

### ❌ "Is Gateway same as Ingress?"

Not exactly:

| Ingress    | Gateway API                    |
| ---------- | ------------------------------ |
| Simple     | More flexible                  |
| One object | Multiple objects               |
| Limited    | Role-based (infra vs app team) |

---

# 🧠 Real-world mapping (important for DevOps interviews)

| Role          | Object       |
| ------------- | ------------ |
| Platform team | GatewayClass |
| Infra team    | Gateway      |
| App team      | HTTPRoute    |

---

# 🚀 If you want next step (recommended)

I can help you:

* Build full **microservice routing setup**
* `/api → backend`, `/ → frontend`
* Add TLS (HTTPS)
* Debug why routing fails in KIND

Just tell me 👍



## way to connect app to service
productdb-st-0.productdb-service
name.svcname
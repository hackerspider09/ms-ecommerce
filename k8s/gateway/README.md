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

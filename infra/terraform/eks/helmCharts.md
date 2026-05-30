# Understanding `repository` and `chart` in Terraform Helm Provider

## Overview

When using Terraform's `helm_release` resource, how to know repo and chart:

```hcl
repository = "..."
chart      = "..."
```

The values depend on how the Helm chart is distributed.

There are two major chart distribution methods:

1. Traditional Helm Repository
2. OCI Registry

---

# How Terraform Uses These Values

Terraform ultimately executes something similar to:

```bash
helm install <release-name> <chart-reference>
```

The `repository` and `chart` values are simply Terraform's way of constructing the chart reference.

---

# Method 1: Traditional Helm Repository

## Example

Official ArgoCD installation:

```bash
helm repo add argo https://argoproj.github.io/argo-helm

helm install argocd argo/argo-cd
```

Terraform:

```hcl
resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"

  namespace        = "argocd"
  create_namespace = true
}
```

---

## How to Find the Chart Name

After adding the repository:

```bash
helm search repo argo
```

Example output:

```text
argo/argo-cd
argo/argo-rollouts
argo/argo-events
```

The chart name is:

```text
argo-cd
```

Terraform:

```hcl
chart = "argo-cd"
```

---

## Another Example

Official Metrics Server installation:

```bash
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server

helm install metrics-server metrics-server/metrics-server
```

Terraform:

```hcl
repository = "https://kubernetes-sigs.github.io/metrics-server"
chart      = "metrics-server"
```

---

# Method 2: OCI Registry

OCI registries work differently.

The chart reference itself contains the chart name.

---

## Example: Envoy Gateway

Official installation:

```bash
helm install eg oci://docker.io/envoyproxy/gateway-helm
```

Terraform:

```hcl
repository = "oci://docker.io/envoyproxy"
chart      = "gateway-helm"
```

---

## OCI Rule

Given:

```text
oci://registry/path/chart-name
```

Terraform becomes:

```hcl
repository = "oci://registry/path"
chart      = "chart-name"
```

The chart name is always the last path segment.

---

## Example: Cert Manager OCI

Official command:

```bash
helm install cert-manager \
  oci://quay.io/jetstack/charts/cert-manager
```

Terraform:

```hcl
repository = "oci://quay.io/jetstack/charts"
chart      = "cert-manager"
```

---

## Example: NGINX OCI

Official command:

```bash
helm install nginx \
  oci://registry-1.docker.io/bitnamicharts/nginx
```

Terraform:

```hcl
repository = "oci://registry-1.docker.io/bitnamicharts"
chart      = "nginx"
```

---



# How to Discover the Correct Chart Name

## Option 1: Read Official Documentation

Always start here.

Example:

```bash
helm install argocd argo/argo-cd
```

Chart:

```text
argo-cd
```

---

## Option 2: Search Repository

For traditional repositories:

```bash
helm search repo argo
```

Output:

```text
argo/argo-cd
argo/argo-rollouts
argo/argo-events
```

Chart:

```text
argo-cd
```

---

## Option 3: Inspect Chart Metadata

Traditional repository:

```bash
helm show chart argo/argo-cd
```

OCI:

```bash
helm show chart oci://docker.io/envoyproxy/gateway-helm
```

Example output:

```yaml
apiVersion: v2
name: gateway-helm
version: 1.4.0
```

The important field:

```yaml
name: gateway-helm
```

Terraform:

```hcl
chart = "gateway-helm"
```

---


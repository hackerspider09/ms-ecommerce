# `kubernetes_manifest` in Terraform

## What it does

`kubernetes_manifest` applies any raw Kubernetes YAML/JSON manifest to a cluster - the same as running `kubectl apply -f`.

Used previously in `deploy_app.tf` to deploy the ArgoCD `Application` resource (apps-of-apps root app) after ArgoCD is installed via Helm.

```hcl
resource "kubernetes_manifest" "install_argo_app" {
  manifest = yamldecode(file("${path.module}/../../../argocd/argo_app/argo_app_${var.deployment_env}.yaml"))

  depends_on = [helm_release.argocd, helm_release.envoy_gateway]
}
```

`yamldecode(file(...))` reads the YAML file from disk and converts it to a Terraform map that `kubernetes_manifest` understands.

The `depends_on` ensures ArgoCD is fully running before Terraform tries to create an `Application` CRD inside it.

---

## Provider setup

`kubernetes_manifest` needs the `hashicorp/kubernetes` provider declared in `required_providers` and configured separately.


```hcl
terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "3.1.0"
    }
  }
}
```

### `provider "kubernetes"` block (`providers.tf`)

Authenticates to EKS using `aws eks get-token` so Terraform can talk to the cluster.

```hcl
# Configure Kubernetes provider to allow Terraform resources
# (e.g. kubernetes_manifest, namespace, secret, configmap)
# to authenticate and interact with the EKS cluster.
# https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs#exec-plugins
provider "kubernetes" {
  host                   = local.eks_host
  cluster_ca_certificate = local.eks_ca

  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args = [
      "eks",
      "get-token",
      "--cluster-name",
      module.eks.cluster_name
    ]
  }
}
```

`local.eks_host` and `local.eks_ca` come from the EKS module outputs (see `locals.tf`):

```hcl
locals {
  eks_host = module.eks.cluster_endpoint
  eks_ca   = base64decode(module.eks.cluster_certificate_authority_data)
}
```

---

## The manifest it loads

`argocd/argo_app/argo_app_prod.yaml`:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: argo-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/hackerspider09/ms-ecommerce.git
    targetRevision: main
    path: argocd/apps/prod_gateway   
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated: {}
```

The `path` must be relative - ArgoCD treats a leading `/` as an absolute path and will reject it.

---

## How it differs from `helm_release`

| | `kubernetes_manifest` | `helm_release` |
|---|---|---|
| Talks to cluster at **plan** time | ✅ Yes - fetches CRD schema to validate | ❌ No - defers to apply |
| Talks to cluster at **apply** time | ✅ Yes | ✅ Yes |
| Use case | Raw K8s YAML (CRDs, custom resources) | Helm chart installs |

Because `kubernetes_manifest` contacts the live cluster **during plan** to validate the resource schema, it will fail if the cluster doesn't exist yet.

---

## Note: `terraform plan` fails on a fresh setup

When the EKS cluster hasn't been created yet, `terraform plan` errors out:

```
╷
│ Error: Failed to construct REST client
│
│   with kubernetes_manifest.install_argo_app,
│   on deploy_app.tf line 3, in resource "kubernetes_manifest" "install_argo_app":
│    3: resource "kubernetes_manifest" "install_argo_app" {
│
│ cannot create REST client: no client config
```

**Root cause:** The Kubernetes provider needs `eks_host` and `eks_ca` (cluster endpoint + certificate), which come from `module.eks`. But `module.eks` hasn't run yet, so the provider has no API server to connect to during plan.

`helm_release` doesn't have this issue because the Helm provider only contacts the cluster at apply time.

---

## Workaround: use `-target` to bootstrap in two steps

```bash
# Step 1 - create the cluster and install Helm tools first
terraform apply -target=module.eks \
                -target=helm_release.argocd \
                -target=helm_release.envoy_gateway

# Step 2 - now the cluster exists, apply everything else normally
terraform apply
```

After step 1, the EKS endpoint is known, so the Kubernetes provider can resolve it and `kubernetes_manifest` can validate and apply cleanly in step 2.


Also, you can use the kubectl provider: https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs 
It's implemented in the current eks terraform manifests.

---

## Official docs

- `kubernetes_manifest` resource: https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/manifest
- Kubernetes provider (exec auth): https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs#exec-plugins

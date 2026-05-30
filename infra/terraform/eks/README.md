
How to write helm config file for installation

equivalent cmd: helm install argocd argo-cd --repo https://argoproj.github.io/argo-helm

terraform: 
resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"

  namespace        = "argocd"
  create_namespace = true
}

most of the time you will use 5 fields:  
name
repository
chart
namespace
create_namespace


Installing with values.yaml
resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"

  namespace        = "argocd"
  create_namespace = true

  values = [
    file("${path.module}/values/argocd-values.yaml")
  ]
}

Equivalent to:

helm install argocd argo-cd \
  --repo https://argoproj.github.io/argo-helm \
  -f values.yaml


  Setting individual values

Instead of a values file:

resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"

  namespace        = "argocd"
  create_namespace = true

  set {
    name  = "server.service.type"
    value = "LoadBalancer"
  }
}

Equivalent to:

--set server.service.type=LoadBalancer
Multiple values
set {
  name  = "server.service.type"
  value = "LoadBalancer"
}

set {
  name  = "configs.params.server\\.insecure"
  value = "true"
}
Using variables
set {
  name  = "server.service.type"
  value = var.service_type
}

Installing CRDs

Many charts need CRDs.

Example:

resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"

  namespace        = "cert-manager"
  create_namespace = true

  set {
    name  = "crds.enabled"
    value = "true"
  }
}
Dependencies

Gateway API first:

resource "helm_release" "gateway_api" {
  ...
}

Then Envoy:

resource "helm_release" "envoy_gateway" {
  ...

  depends_on = [
    helm_release.gateway_api
  ]
}


# Note:
when you try to plan terraform it may give error as in kubenetes manifest provider used in install argo app it will require eks host and eks ca so it gives error as its not setu up yet it will get after running apply 

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
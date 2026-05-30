# Install argocd, gateway crds, envoy etc


# https://registry.terraform.io/providers/hashicorp/helm/latest/docs/resources/release
# helm install argocd argo-cd --repo https://argoproj.github.io/argo-helm

resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  version    = "6.0.1"

  namespace = "argocd"
  create_namespace = true

  depends_on = [ module.eks ]
}


# Install envoy and CRDs
# https://gateway.envoyproxy.io/docs/install/install-helm/
# helm install eg oci://docker.io/envoyproxy/gateway-helm --version v1.8.0 -n envoy-gateway-system --create-namespace
resource "helm_release" "envoy_gateway" {
  name       = "envoy-gw"
  repository = "oci://docker.io/envoyproxy"
  chart      = "gateway-helm"
  version    = "v1.8.0"

  namespace = "envoy-gateway-system"
  create_namespace = true

  depends_on = [ module.eks ]
}



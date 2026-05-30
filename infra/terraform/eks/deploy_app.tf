# This yaml will deploy argocd applicaiton which is of patern apps-of-apps

resource "kubernetes_manifest" "install_argo_app" {
  manifest = file("${path.module}/../../../argocd/argo_app/argo_app_${var.deployment_env}.yaml")

  depends_on = [ helm_release.argocd, helm_release.envoy_gateway ]
}
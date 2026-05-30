# This yaml will deploy argocd applicaiton which is of patern apps-of-apps

# https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs/resources/kubectl_manifest
resource "kubectl_manifest" "deploy_argo_app" {
    # it require string body
    yaml_body = file("${path.module}/../../../argocd/argo_app/argo_app_${var.deployment_env}.yaml")

  depends_on = [ helm_release.argocd, helm_release.envoy_gateway ]
}
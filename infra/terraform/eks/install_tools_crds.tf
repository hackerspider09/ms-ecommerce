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

  set = [{
    name  = "server.service.type"
    value = "LoadBalancer"
  }]

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


# Cleanup K8s-created AWS resources before terraform destroy.
# When K8s creates LoadBalancer services, the cloud controller creates ELBs + security
# groups (named k8s-elb-*) that are OUTSIDE Terraform state. These block VPC deletion.
# This resource runs its destroy provisioner BEFORE the helm releases and EKS are destroyed
# (depends_on reverses during destroy: dependents are destroyed first).
# See README.md for full explanation of why TF cannot do this on its own.
resource "null_resource" "cleanup_lb_on_destroy" {
  # Store values in triggers - available as self.triggers.* even during destroy
  # when the actual resources may already be gone.
  triggers = {
    cluster_name = module.eks.cluster_name
    region       = var.region_name
    vpc_id       = module.vpc.vpc_id
  }

  provisioner "local-exec" {
    when    = destroy
    command = <<-EOT
      # Get kubeconfig so kubectl can reach the cluster
      aws eks update-kubeconfig --name ${self.triggers.cluster_name} --region ${self.triggers.region} 2>/dev/null || true

      # Delete LB services so cloud controller cleans up ELBs and k8s-elb-* SGs from AWS
      # NOTE: deleting ELBs from the AWS Console bypasses this controller cleanup
      # and leaves the security groups orphaned - always delete via kubectl
      kubectl delete svc argocd-server -n argocd --ignore-not-found=true 2>/dev/null || true
      kubectl delete svc $(kubectl get svc -n envoy-gateway-system -o jsonpath='{.items[?(@.spec.type=="LoadBalancer")].metadata.name}' 2>/dev/null) -n envoy-gateway-system --ignore-not-found=true 2>/dev/null || true

      # Wait for the cloud controller to remove the SGs from AWS
      sleep 90

      # Safety net: force-delete any k8s-elb-* SGs still remaining in the VPC.
      # Handles cases where ELB was previously deleted from console instead of kubectl.
      aws ec2 describe-security-groups \
        --filters "Name=vpc-id,Values=${self.triggers.vpc_id}" "Name=group-name,Values=k8s-elb-*" \
        --query 'SecurityGroups[*].GroupId' --output text --region ${self.triggers.region} 2>/dev/null \
        | tr '\t' '\n' | xargs -I{} -r aws ec2 delete-security-group --group-id {} --region ${self.triggers.region} 2>/dev/null || true
    EOT
  }

  # destroy order:
  #   apply:   this resource created AFTER helm releases (it depends on them)
  #   destroy: this resource destroyed FIRST - cleanup runs while cluster is still up
  depends_on = [helm_release.argocd, helm_release.envoy_gateway]
}

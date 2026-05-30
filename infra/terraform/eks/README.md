
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


---

# VPC Deletion Issue on `terraform destroy`

## What happens

When you run `terraform destroy`, the VPC gets stuck in a **"deleting"** state (sometimes for 10+ minutes) or the destroy fails completely.

## Root cause: K8s-created AWS resources outside Terraform state

When Kubernetes provisions a `LoadBalancer` service (ArgoCD, Envoy Gateway), the **K8s cloud controller manager** automatically creates AWS resources in the background:

- A Classic ELB (the load balancer itself)
- A security group named `k8s-elb-<hash>` for that ELB

These resources are created by Kubernetes **not by any `resource` block in `.tf` files**. Because of this, they are never added to Terraform state.

```
terraform destroy  →  reads state file
                   →  "I know about: VPC, subnets, EKS cluster, helm releases..."
                   →  "k8s-elb-* security groups? Never heard of them."
                   →  tries to delete VPC subnets
                   →  AWS returns: DependencyViolation (SGs still attached)
                   →  Terraform stuck / times out
```

Terraform cannot delete what it doesn't know about.

## Why deleting the ELB from AWS Console doesn't fix it

When you delete the ELB from the **AWS Console**, only the ELB is deleted. The associated security group is left behind because:

- AWS doesn't know the SG was created specifically for that ELB
- The Kubernetes cloud controller (which knows the relationship) never ran its cleanup code
- The cleanup code only runs when it sees the K8s `Service` resource get deleted


## Automated fix: `null_resource.cleanup_lb_on_destroy`

Added in `install_tools_crds.tf`. On `terraform destroy`, this runs a `local-exec` destroy provisioner **before** the EKS cluster and helm releases are torn down (controlled via `depends_on` during destroy, dependents are destroyed first).

It:
1. Updates kubeconfig for the cluster
2. Deletes all `LoadBalancer`-type services across all namespaces via `kubectl` this triggers the cloud controller to cleanly delete the ELBs and their SGs
3. Waits 90 seconds for AWS to process the deletions
4. Force-deletes any `k8s-elb-*` SGs still remaining (safety net for previously orphaned SGs)

## Manual steps (if stuck without the automation)

```bash
# Find your VPC ID
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=ms-ecom-eks-VPC" \
  --query 'Vpcs[0].VpcId' --output text --region us-east-1

# List any remaining k8s-elb-* security groups
aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=<vpc-id>" "Name=group-name,Values=k8s-elb-*" \
  --query 'SecurityGroups[*].{ID:GroupId,Name:GroupName}' --output table --region us-east-1

# Delete each one
aws ec2 delete-security-group --group-id <sg-id> --region us-east-1
```
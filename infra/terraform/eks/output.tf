output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "cluster_region" {
  value = var.region_name
}

output "kube_config_cmd" {
  value = "aws eks update-kubeconfig --region ${var.region_name} --name ${var.cluster_name}"
}
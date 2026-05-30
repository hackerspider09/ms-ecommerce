terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "3.1.2"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.7.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.region_name
}




# Used to solve problem when terraform apply run: check kubenetes_manifest.md 
provider "kubectl" {
  host                   = local.eks_host
  cluster_ca_certificate = local.eks_ca
  token                  = data.aws_eks_cluster_auth.eks_auth_token.token
  load_config_file       = false
}


# https://developer.hashicorp.com/terraform/tutorials/kubernetes/helm-provider#review-the-helm-configuration
# In above doc you can see how to access eks by helm module in terraform
provider "helm" {
  # k8s provider is specific to helm only
  kubernetes = {
    host                   = local.eks_host
    cluster_ca_certificate = local.eks_ca
    token = data.aws_eks_cluster_auth.eks_auth_token.token
  }
}
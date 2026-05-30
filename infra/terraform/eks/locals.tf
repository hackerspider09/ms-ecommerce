locals {
  common_tags =  {
    Environment = "prod"
    Application = "ms-ecom"
  }

  eks_host = module.eks.cluster_endpoint
  eks_ca = base64decode(module.eks.cluster_certificate_authority_data)
}
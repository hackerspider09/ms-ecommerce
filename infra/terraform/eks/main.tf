

# https://registry.terraform.io/modules/terraform-aws-modules/eks/aws/latest#eks-managed-node-group
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = var.cluster_name
  kubernetes_version = "1.33"

  # Optional
  endpoint_public_access = true

  # Optional: Adds the current caller identity as an administrator via cluster access entry
  enable_cluster_creator_admin_permissions = true

  addons = {
    coredns                = {}
    eks-pod-identity-agent = {
      before_compute = true
    }
    kube-proxy             = {}
    vpc-cni                = {
      before_compute = true
    }
  }


  # EKS Managed Node Group(s)
  eks_managed_node_groups = {
    example = {
      ami_type       = "AL2023_x86_64_STANDARD"
      instance_types = [var.instance_type]

      min_size     = 1
      max_size     = 3
      desired_size = 1
    }
  }

  vpc_id     =  module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  tags = local.common_tags
}


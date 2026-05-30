variable "region_name" {
  type = string
  default = "us-east-1"
}

variable "instance_type" {
  type = string
  default = "t3-medium"
}

variable "cluster_name" {
  type = string
}

variable "vpc_cidr" {
  type = string
  default = "10.0.0.0/16"
}

variable "deployment_env"{
  type = string
  description = "use dev if running inside ec2/dev env and use prod for eks, it will define which config file to use by argo to setup application"

  validation {
    condition = contains(["dev","prod"],var.deployment_env)
    error_message = "Env must be dev or prod"
  }
}
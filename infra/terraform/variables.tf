variable "region_name" {
  type = string
  default = "us-east-1"
}

variable "instance_name" {
  type = string
  default = "ecom-ec2"
}

variable "instance_type" {
  type = string
  default = "t3-medium"
}

variable "ami_id" {
  type = string
}

variable "key_filename" {
  type = string
}
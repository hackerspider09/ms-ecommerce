
# get vpc
data "aws_vpc" "default_vpc" {
  default = true
}

# get subnet
data "aws_subnets" "default_sn" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default_vpc.id]
  }
}

# sg
module "kind_sg" {
  source = "terraform-aws-modules/security-group/aws"
  version = "5.3.1"

  name        = "kind-sg"
  vpc_id      = data.aws_vpc.default_vpc.id

  ingress_cidr_blocks = ["0.0.0.0/0"]   # can use here it will appply to all other wise can add individualy
  ingress_with_cidr_blocks = [
    {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      description = "SSH"
      # cidr_blocks = "0.0.0.0/0"
    },
    {
      from_port   = 30010
      to_port     = 30010
      protocol    = "tcp"
      description = "gateway-port for kind"
    },
    {
      from_port   = 8000
      to_port     = 8000
      protocol    = "tcp"
      description = "port-forward for kind"
    },
  ]
  egress_rules = ["all-all"]
}

resource "aws_instance" "kind_instance" {
  ami           = var.ami_id
  instance_type = var.instance_type

  
  subnet_id = data.aws_subnets.default_sn.ids[0]
  vpc_security_group_ids = [module.kind_sg.security_group_id]
  tags = local.common_tags

  associate_public_ip_address = true

  # directly add ssh key in authorised keys 
  # i am not creating key_pair resource
  user_data_replace_on_change = true # recreate instance if there is any change in user data
  # Note: dont add spaces in shebang line else it not gona work 
  user_data = <<EOF
#!/bin/bash
mkdir -p /home/ubuntu/.ssh
echo "${file(local.ssh_key_path)}" >> /home/ubuntu/.ssh/authorized_keys
    EOF

  lifecycle {
    precondition {
      condition = fileexists(local.ssh_key_path)
      error_message = "ssh keys should be created in keys dir"
    }
  }
}
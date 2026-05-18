output "vpc_detail" {
  value = data.aws_vpc.default_vpc.id
}

output "sn_detail" {
  value = data.aws_subnets.default_sn.ids
}

output "key_path" {
  value = local.ssh_key_path
}

output "ec2_ip" {
  value = {
    ip = resource.aws_instance.kind_instance.public_ip
    used_sn = resource.aws_instance.kind_instance.subnet_id
  }
}
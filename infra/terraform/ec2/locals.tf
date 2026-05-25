
locals {
  common_tags = {
    "env": "dev",
    "project": "ms-ecom"
  }

  ssh_key_path = "${path.module}/keys/${var.sshkey_filename}"
}
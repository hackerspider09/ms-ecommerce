

; server group
[servers]
kind_server ansible_host=${ip} ansible_user=${username}

; variables for servers
[servers:vars]
ansible_ssh_private_key_file="../terraform/ec2/keys/${ssh_filename}"


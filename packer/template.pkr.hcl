packer {
  required_version = ">= 1.7.0"
}

source "amazon-ebs" "ubuntu" {
  region      = var.aws_region
  instance_type = "t2.micro"
  source_ami_filter {
    filters = {
      name = "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"
      root-device-type = "ebs"
      virtualization-type = "hvm"
    }
    owners      = ["099720109477"]
    most_recent = true
  }
  ssh_username = "ubuntu"
  ami_name     = "demo-ami-${timestamp()}"
}

build {
  name    = "demo-image"
  sources = ["source.amazon-ebs.ubuntu"]

  provisioner "ansible" {
    playbook_file = "../ansible/playbook.yml"
  }
}

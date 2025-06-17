packer {
  required_plugins {
    amazon = {
      version = ">= 1.3.7"
      source  = "github.com/hashicorp/amazon"
    }
    ansible = {
      version = ">= 1.1.3"
      source  = "github.com/hashicorp/ansible"
    }
  }
}

source "amazon-ebs" "rhel9" {
  region      = var.aws_region
  instance_type = "t2.micro"
  source_ami = "ami-0b8c2bd77c5e270cf"
  ssh_username = "ec2-user"
  ami_name     = "rhel9-stig-${timestamp()}"
}

build {
  name    = "rhel9-stig-pkr"
  sources = ["source.amazon-ebs.rhel9"]

  provisioner "ansible" {
    playbook_file = "../ansible/main.yml"

    ansible_env_vars = [
      "ANSIBLE_SCP_EXTRA_ARGS=-O",
    ]

    extra_arguments = [
      "-e", "ansible_python_interpreter=/usr/bin/python3",
    ]
  }
}

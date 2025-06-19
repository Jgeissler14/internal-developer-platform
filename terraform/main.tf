terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "6.0.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_ami" "rhel9" {
  most_recent = true
  owners      = ["285824578675"]

  filter {
    name   = "name"
    values = ["rhel9-stig*"]
  }
}

resource "aws_instance" "demo" {
  ami           = data.aws_ami.rhel9.id
  instance_type = "t2.micro"
  tags = {
    Name = var.instance_name
  }
}

output "instance_id" {
  value = aws_instance.demo.id
}

output "public_ip" {
  value = aws_instance.demo.public_ip
}

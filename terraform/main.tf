terraform {
  required_version = ">= 1.0"
}

provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "demo" {
  ami           = var.ami_id
  instance_type = "t2.micro"
  tags = {
    Name = "demo-instance"
  }
}

output "instance_id" {
  value = aws_instance.demo.id
}

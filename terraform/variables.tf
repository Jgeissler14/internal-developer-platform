variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_name" {
  description = "Name of the AWS instance"
  type        = string
}

variable "instance_type" {
  description = "Type of the AWS instance"
  type        = string
  default     = "t2.micro"
}

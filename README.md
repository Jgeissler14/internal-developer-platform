# Internal Developer Platform Example

This repository provides a baseline structure for creating an internal developer platform that demonstrates multiple DevOps practices. It can be used for a short tutorial or demo session (~1–2 hours) that covers:

1. **Terraform** &ndash; defining and provisioning infrastructure.
2. **Packer** & **Ansible** &ndash; building machine images with configuration management.
3. **Next.js** app &ndash; combined frontend and API routes.

The repository is intentionally lightweight and modular so you can focus on the concepts during the session.

## Directory layout

```
terraform/   # Infrastructure as code
packer/      # Image build definition
ansible/     # Configuration management
app/         # Next.js frontend + API
```

## Usage outline

1. **Terraform**
   - Configure your cloud provider in `terraform/main.tf` and run `terraform init` then `terraform apply` to provision infrastructure.
   - Remote state is recommended for collaborative use; see below for tips.
2. **Packer & Ansible**
   - Build a custom image using `packer build packer/template.pkr.hcl`.
   - Role required `ansible-galaxy install RedHatOfficial.rhel9_stig -p ./ansible`
3. **Next.js app**
   - From `app/`, run `npm install` then `npm run dev` to start the combined frontend and API server.

## Managing state of created instances

Terraform keeps track of managed infrastructure in a **state file**. For team use, store this state remotely (for example in Amazon S3 or Terraform Cloud) and enable state locking (such as using DynamoDB when on AWS) so that multiple users don't modify it concurrently. Keeping the state remotely also allows the platform to accurately destroy or update resources later.

```
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "devops-demo/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}
```

With remote state in place, anyone running Terraform from this repo will see the same infrastructure history and can safely create or destroy instances.

## Next steps

The individual folders contain minimal examples to get started. Expand them as needed for your demo by adding cloud resources, provisioning tasks, API routes, or UI components.

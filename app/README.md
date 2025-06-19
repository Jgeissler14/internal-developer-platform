# Internal Developer Platform App

This is a minimal Next.js application that exposes a simple interface for managing EC2 instances. Actions are executed using the AWS SDK and credentials provided via environment variables.

## Setup

1. Install dependencies
   ```
   npm install
   ```
2. Start the dev server
   ```
   npm run dev
   ```

Set the following environment variables if you want new instances to be
committed automatically to GitHub:

```bash
export GITHUB_TOKEN=<your PAT>
export GITHUB_OWNER=<github owner>
export GITHUB_REPO=<repository name>
# optional
export GITHUB_BRANCH=main
```

## API

POST `/api/ec2`

Request body:
```
{
  "action": "create|start|stop|terminate",
  "instanceName": "optional when action=create",
  "instanceId": "optional when action!=create"
}
```

When `action` is `create`, a `terraform.tfvars` file is written to `terraform/terraform.tfvars` with the provided `instanceName`. If the environment variables `GITHUB_TOKEN`, `GITHUB_OWNER`, and `GITHUB_REPO` are set (and optionally `GITHUB_BRANCH`), the file is also committed to the specified GitHub repository using the GitHub API.

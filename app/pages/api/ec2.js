import fs from 'fs';
import path from 'path';
import {
  EC2Client,
  DescribeInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2';

export default async function handler(req, res) {
  const client = new EC2Client({ region: process.env.AWS_REGION || 'us-east-1' });

  if (req.method === 'GET') {
    try {
      const data = await client.send(new DescribeInstancesCommand({}));
      const instances = [];
      for (const reservation of data.Reservations || []) {
        for (const instance of reservation.Instances || []) {
          const nameTag = (instance.Tags || []).find(t => t.Key === 'Name');
          instances.push({
            id: instance.InstanceId,
            state: instance.State?.Name,
            type: instance.InstanceType,
            name: nameTag ? nameTag.Value : '',
          });
        }
      }
      res.status(200).json({ instances });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { action, instanceId, instanceIds, instanceName } = req.body;

  try {
    if (action === 'create') {
      const tfvarsPath = path.join(process.cwd(), '.', 'terraform.tfvars');
      fs.writeFileSync(tfvarsPath, `instance_name = "${instanceName}"\ninstance_type = "${req.body.instanceType}"`);

      const token = process.env.GITHUB_TOKEN;
      const owner = process.env.GITHUB_OWNER;
      const repo = process.env.GITHUB_REPO;
      const branch = process.env.GITHUB_BRANCH || 'main';

      if (token && owner && repo) {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/terraform/terraform.tfvars`;

        const headers = {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'idf-app',
          Accept: 'application/vnd.github+json',
        };

        // Attempt to read existing file to get its SHA
        const currentRes = await fetch(`${apiUrl}?ref=${branch}`, { headers });
        let sha;
        if (currentRes.ok) {
          const currentData = await currentRes.json();
          sha = currentData.sha;
        }

        const content = fs.readFileSync(tfvarsPath, 'utf8');
        await fetch(apiUrl, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: `Update terraform.tfvars for ${instanceName}`,
            content: Buffer.from(content).toString('base64'),
            branch,
            ...(sha ? { sha } : {}),
          }),
        });
      }
    } else if (action === 'start') {
      const ids = instanceIds || [instanceId];
      await client.send(new StartInstancesCommand({ InstanceIds: ids }));
    } else if (action === 'stop') {
      const ids = instanceIds || [instanceId];
      await client.send(new StopInstancesCommand({ InstanceIds: ids }));
    } else if (action === 'terminate') {
      const ids = instanceIds || [instanceId];
      await client.send(new TerminateInstancesCommand({ InstanceIds: ids }));
    } else {
      throw new Error('Unknown action');
    }

    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

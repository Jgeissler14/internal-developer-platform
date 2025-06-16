export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { action } = req.body || {};
  let message;

  switch (action) {
    case 'create':
      message = 'Server created';
      break;
    case 'start':
      message = 'Server started';
      break;
    case 'shutdown':
      message = 'Server shut down';
      break;
    case 'reboot':
      message = 'Server rebooted';
      break;
    case 'delete':
      message = 'Server deleted';
      break;
    default:
      message = 'Unknown action';
  }

  console.log(`Received action: ${action}`);
  res.json({ message });
}

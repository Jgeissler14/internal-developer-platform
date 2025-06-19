import { useState } from 'react';

export default function Home() {
  const [instanceName, setInstanceName] = useState('');
  const [instanceId, setInstanceId] = useState('');
  const [message, setMessage] = useState('');

  const callApi = async (action) => {
    const body = { action };
    if (action === 'create') body.instanceName = instanceName;
    else body.instanceId = instanceId;

    const res = await fetch('/api/ec2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) setMessage('Success');
    else setMessage(data.error || 'Error');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>EC2 Manager</h1>
      <div>
        <h2>Create Instance</h2>
        <input placeholder="Instance name" value={instanceName} onChange={e => setInstanceName(e.target.value)} />
        <button onClick={() => callApi('create')}>Create</button>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h2>Manage Instance</h2>
        <input placeholder="Instance ID" value={instanceId} onChange={e => setInstanceId(e.target.value)} />
        <button onClick={() => callApi('start')}>Start</button>
        <button onClick={() => callApi('stop')}>Stop</button>
        <button onClick={() => callApi('terminate')}>Terminate</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

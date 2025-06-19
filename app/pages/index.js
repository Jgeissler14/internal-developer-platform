import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [instanceName, setInstanceName] = useState('');
  const [instanceId, setInstanceId] = useState('');
  const [message, setMessage] = useState('');

  const callApi = async (action) => {
    const body = { action };
    if (action === 'create') {
      body.instanceName = instanceName;
      body.instanceType = instanceType;
    } else {
      body.instanceId = instanceId;
    }

    const res = await fetch('/api/ec2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) setMessage('Success');
    else setMessage(data.error || 'Error');
  };

  const [instanceType, setInstanceType] = useState('t2.micro');

  return (
    <div className={styles.container}>
      <h1>EC2 Manager</h1>
      <div className={styles.section}>
        <h2>Create Instance</h2>
        <input
          placeholder="Instance name"
          value={instanceName}
          onChange={e => setInstanceName(e.target.value)}
        />
        <select
          value={instanceType}
          onChange={e => setInstanceType(e.target.value)}
        >
          <option value="t2.micro">t2.micro</option>
          <option value="t2.small">t2.small</option>
          <option value="t2.medium">t2.medium</option>
          <option value="t2.large">t2.large</option>
        </select>
        <button onClick={() => callApi('create')}>Create</button>
      </div>
      <div className={styles.section}>
        <h2>Manage Instance</h2>
        <input
          placeholder="Instance ID"
          value={instanceId}
          onChange={e => setInstanceId(e.target.value)}
        />
        <button onClick={() => callApi('start')}>Start</button>
        <button onClick={() => callApi('stop')}>Stop</button>
        <button onClick={() => callApi('terminate')}>Terminate</button>
      </div>
      {message && (
        <p className={message === 'Success' ? styles.message : styles.error}>
          {message}
        </p>
      )}
    </div>
  );
}

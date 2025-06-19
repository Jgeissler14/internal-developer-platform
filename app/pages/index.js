import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [instanceName, setInstanceName] = useState('');
  const [instanceType, setInstanceType] = useState('t2.micro');
  const [instances, setInstances] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');

  const fetchInstances = async () => {
    const res = await fetch('/api/ec2');
    const data = await res.json();
    if (res.ok) setInstances(data.instances);
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  const callApi = async (action, ids = selected) => {
    const body = { action };
    if (action === 'create') {
      body.instanceName = instanceName;
      body.instanceType = instanceType;
    } else {
      body.instanceIds = ids;
    }

    const res = await fetch('/api/ec2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Success');
      fetchInstances();
      setSelected([]);
    } else setMessage(data.error || 'Error');
  };

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
        <h2>Instances</h2>
        <button onClick={fetchInstances}>Refresh</button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>ID</th>
              <th>Type</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {instances.map(inst => (
              <tr key={inst.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(inst.id)}
                    onChange={() =>
                      setSelected(prev =>
                        prev.includes(inst.id)
                          ? prev.filter(i => i !== inst.id)
                          : [...prev, inst.id]
                      )
                    }
                  />
                </td>
                <td>{inst.name}</td>
                <td>{inst.id}</td>
                <td>{inst.type}</td>
                <td>{inst.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.buttons}>
          <button onClick={() => callApi('start')}>Start</button>
          <button onClick={() => callApi('stop')}>Stop</button>
          <button onClick={() => callApi('terminate')}>Terminate</button>
        </div>
      </div>
      {message && (
        <p className={message === 'Success' ? styles.message : styles.error}>
          {message}
        </p>
      )}
    </div>
  );
}

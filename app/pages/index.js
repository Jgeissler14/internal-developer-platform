import { useState } from 'react';

export default function Home() {
  const [action, setAction] = useState('create');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/server', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Server Actions</h1>
      <form onSubmit={handleSubmit}>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="create">Create</option>
          <option value="start">Start</option>
          <option value="shutdown">Shut down</option>
          <option value="reboot">Reboot</option>
          <option value="delete">Delete</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

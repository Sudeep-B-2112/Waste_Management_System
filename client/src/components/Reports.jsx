import { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';

export default function Reports({ token }) {
  const [d, setD] = useState(null);

  useEffect(() => {
    apiRequest(token, '/reports').then(setD).catch(console.error);
  }, [token]);

  if (!d) return <div>Loading...</div>;

  return (
    <section className="panel">
      <h2>Collection Reports</h2>
      <div className="cards">
        <div className="card">
          <span>Completed Collections</span>
          <b>{d.completed}</b>
        </div>
        {d.byType.map((x) => (
          <div className="card" key={x._id}>
            <span>{x._id}</span>
            <b>{x.count}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
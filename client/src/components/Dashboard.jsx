export default function Dashboard({ stats, role }) {
  return (
    <>
      <div className="hero">
        <div>
          <h2>Welcome back</h2>
          <p>
            {role === 'admin'
              ? 'Monitor collections and verify proof uploads.'
              : role === 'collector'
              ? 'Complete assigned collections and upload proof.'
              : 'Create requests and track your waste pickup.'}
          </p>
        </div>
        <div className="leaf">♻</div>
      </div>

      <div className="cards">
        {Object.entries(stats).map(([k, v]) => (
          <div className="card" key={k}>
            <span>{k.replace(/([A-Z])/g, ' $1')}</span>
            <b>{v || 0}</b>
          </div>
        ))}
      </div>
    </>
  );
}
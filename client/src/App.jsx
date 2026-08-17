import { useEffect, useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CreateRequest from './components/CreateRequest';
import Requests from './components/Requests';
import Reports from './components/Reports';
import { apiRequest } from './utils/api';

const MENU_ICONS = {
  'dashboard': '📊',
  'create request': '➕',
  'my requests': '📋',
  'requests': '📋',
  'reports': '📈',
  'assigned requests': '🚚',
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [page, setPage] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [requests, setRequests] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    if (!token) return;
    try {
      const [d, r] = await Promise.all([
        apiRequest(token, '/dashboard'),
        apiRequest(token, '/requests'),
      ]);
      setStats(d);
      setRequests(r);
      if (user?.role === 'admin') {
        setCollectors(await apiRequest(token, '/collectors'));
      }
    } catch (e) {
      setMsg(e.message);
    }
  };

  useEffect(() => {
    load();
  }, [token, page]);

  const action = (p, m = 'GET', b, f = false) => apiRequest(token, p, m, b, f);

  if (!token) {
    return (
      <Auth
        onLogin={(t, u) => {
          localStorage.setItem('token', t);
          localStorage.setItem('user', JSON.stringify(u));
          setToken(t);
          setUser(u);
        }}
      />
    );
  }

  const menu = [
    'dashboard',
    ...(user.role === 'user' ? ['create request', 'my requests'] : []),
    ...(user.role === 'admin' ? ['requests', 'reports'] : []),
    ...(user.role === 'collector' ? ['assigned requests'] : []),
  ];

  return (
    <div className="shell">
      <aside>
        <div className="brand">
          ♻ <span>EcoTrack</span>
        </div>
        <div className="role">{user.role} portal</div>

        {menu.map((x) => (
          <button
            key={x}
            className={page === x ? 'selected' : ''}
            onClick={() => setPage(x)}
          >
            {MENU_ICONS[x] || '•'} {x.replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}

        <button
          className="logout"
          onClick={() => {
            localStorage.clear();
            setToken(null);
            setUser(null);
          }}
        >
          🚪 Sign Out
        </button>
      </aside>

      <main>
        <header>
          <div>
            <p className="eyebrow">WASTE MANAGEMENT</p>
            <h1>{page}</h1>
          </div>
          <div className="avatar">{user.name?.[0]}</div>
        </header>

        {msg && <div className="notice">{msg}</div>}

        {page === 'dashboard' && <Dashboard stats={stats} role={user.role} />}

        {page === 'create request' && (
          <CreateRequest
            onSubmit={async (b) => {
              try {
                await action('/requests', 'POST', b);
                setMsg('Waste request submitted successfully');
                setPage('my requests');
              } catch (e) {
                setMsg(e.message);
              }
            }}
          />
        )}

        {['my requests', 'requests', 'assigned requests'].includes(page) && (
          <Requests
            rows={requests}
            role={user.role}
            collectors={collectors}
            action={action}
            reload={load}
            say={setMsg}
          />
        )}

        {page === 'reports' && <Reports token={token} />}
      </main>
    </div>
  );
}
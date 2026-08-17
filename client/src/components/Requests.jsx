import { BASE } from '../utils/api';

export default function Requests({ rows, role, collectors, action, reload, say }) {
  const run = async (fn) => {
    try {
      await fn();
      say('Updated successfully');
      await reload();
    } catch (e) {
      say(e.message);
    }
  };

  return (
    <section className="panel">
      <h2>{role === 'collector' ? 'Assigned Collections' : 'Waste Requests'}</h2>

      <div className="request-list">
        {rows.map((r) => (
          <article className="request" key={r._id}>

            <div className="request-top">
              <div>
                <span className="badge">{r.status}</span>
                <h3>{r.wasteType} · {r.quantity}</h3>
                <p>📍 {r.address}</p>
                <p>📅 {r.pickupDate}</p>
                {r.user && <p>👤 {r.user.name} · {r.user.phone}</p>}
              </div>

              <div className="verify">
                {r.collectionPhoto && (
                  <a href={BASE + r.collectionPhoto} target="_blank" rel="noreferrer">
                    <img src={BASE + r.collectionPhoto} alt="Collection proof" />
                  </a>
                )}
                <strong>{r.verificationStatus}</strong>
              </div>
            </div>

            {role === 'admin' && (
              <div className="actions">
                <select
                  value={r.assignedCollector?._id || ''}
                  onChange={(e) => {
                    const collectorId = e.target.value;
                    if (collectorId) {
                      run(() => action(`/requests/${r._id}/assign`, 'PUT', { collectorId }));
                    }
                  }}
                >
                  <option value="">Assign collector</option>
                  {collectors.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>

                {r.verificationStatus === 'Pending Verification' && (
                  <>
                    <button
                      onClick={() =>
                        run(() => action(`/requests/${r._id}/verify`, 'PUT', { approved: true }))
                      }
                    >
                      ✓ Verify & Complete
                    </button>
                    <button
                      className="reject"
                      onClick={() =>
                        run(() =>
                          action(`/requests/${r._id}/verify`, 'PUT', {
                            approved: false,
                            rejectionReason: 'Proof rejected',
                          })
                        )
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            )}

            {role === 'collector' && (
              <div className="actions">
                <button
                  onClick={() =>
                    run(() => action(`/requests/${r._id}/status`, 'PUT', { status: 'Collected' }))
                  }
                >
                  Mark Collected
                </button>

                <label className="upload">
                  📷 Upload Proof
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        const fd = new FormData();
                        fd.append('photo', e.target.files[0]);
                        run(() => action(`/requests/${r._id}/photo`, 'POST', fd, true));
                      }
                    }}
                  />
                </label>
              </div>
            )}

            {r.verificationStatus === 'Rejected' && (
              <p className="rejected">Admin rejected the proof. Please upload a new photo.</p>
            )}

          </article>
        ))}
      </div>

      {!rows.length && <div className="empty">No requests found.</div>}
    </section>
  );
}
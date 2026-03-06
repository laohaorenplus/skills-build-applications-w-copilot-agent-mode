import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ user: '', type: '', duration: '', calories: '' });

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
  const usersUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  const fetchActivities = () => {
    console.log('Activities: fetching from', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Activities: fetched data', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Activities: fetch error', err);
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchActivities();
    fetch(usersUrl).then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : d.results || []));
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user: parseInt(form.user), duration: parseInt(form.duration), calories: parseInt(form.calories) }),
    })
      .then(res => res.json())
      .then(() => { setForm({ user: '', type: '', duration: '', calories: '' }); setShowModal(false); fetchActivities(); })
      .catch(err => setError(err.message));
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
      .then(() => fetchActivities())
      .catch(err => setError(err.message));
  };

  return (
    <div className="page-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">&#x1F3C3; Activities</h2>
        <button className="btn btn-octofit" onClick={() => setShowModal(true)}>+ Log Activity</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr><th>#</th><th>User</th><th>Type</th><th>Duration (min)</th><th>Calories</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {activities.length === 0 && (
              <tr><td colSpan="6" className="text-center text-muted">No activities logged yet.</td></tr>
            )}
            {activities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.id}</td>
                <td><strong>{activity.user ? (activity.user.username || activity.user) : '—'}</strong></td>
                <td><span className="badge bg-secondary">{activity.type}</span></td>
                <td>{activity.duration} min</td>
                <td>{activity.calories} kcal</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(activity.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Log Activity</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">User</label>
                    <select className="form-select" required value={form.user}
                      onChange={e => setForm({ ...form, user: e.target.value })}>
                      <option value="">Select User</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Activity Type</label>
                    <input className="form-control" placeholder="e.g. run, cycle, swim" required value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Duration (minutes)</label>
                    <input className="form-control" type="number" min="1" placeholder="Duration" required value={form.duration}
                      onChange={e => setForm({ ...form, duration: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Calories Burned</label>
                    <input className="form-control" type="number" min="0" placeholder="Calories" required value={form.calories}
                      onChange={e => setForm({ ...form, calories: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-octofit">Save Activity</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;

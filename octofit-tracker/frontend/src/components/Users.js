import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  const fetchUsers = () => {
    console.log('Users: fetching from', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Users: fetched data', data);
        setUsers(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Users: fetch error', err);
        setError(err.message);
      });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => { setForm({ username: '', email: '', password: '' }); setShowModal(false); fetchUsers(); })
      .catch(err => setError(err.message));
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
      .then(() => fetchUsers())
      .catch(err => setError(err.message));
  };

  return (
    <div className="page-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">&#x1F464; Users</h2>
        <button className="btn btn-octofit" onClick={() => setShowModal(true)}>+ Add User</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr><th>#</th><th>Username</th><th>Email</th><th>Team</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan="5" className="text-center text-muted">No users found.</td></tr>
            )}
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td><strong>{user.username}</strong></td>
                <td>{user.email}</td>
                <td>{user.team ? (user.team.name || user.team) : <span className="text-muted">—</span>}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
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
                <h5 className="modal-title">Add User</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input className="form-control" placeholder="Username" required value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input className="form-control" type="email" placeholder="Email" required value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input className="form-control" type="password" placeholder="Password" required value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-octofit">Save User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

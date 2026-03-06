import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '' });

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  const fetchTeams = () => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        console.log('Teams: fetched data', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
      })
      .catch(err => {
        console.error('Teams: fetch error', err);
        setError(err.message);
      });
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => { setForm({ name: '' }); setShowModal(false); fetchTeams(); })
      .catch(err => setError(err.message));
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}${id}/`, { method: 'DELETE' })
      .then(() => fetchTeams())
      .catch(err => setError(err.message));
  };

  return (
    <div className="page-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">&#x1F91D; Teams</h2>
        <button className="btn btn-octofit" onClick={() => setShowModal(true)}>+ Add Team</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr><th>#</th><th>Team Name</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {teams.length === 0 && (
              <tr><td colSpan="3" className="text-center text-muted">No teams found.</td></tr>
            )}
            {teams.map(team => (
              <tr key={team.id}>
                <td>{team.id}</td>
                <td><strong>{team.name}</strong></td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(team.id)}>Delete</button>
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
                <h5 className="modal-title">Add Team</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Team Name</label>
                    <input className="form-control" placeholder="Enter team name" required value={form.name}
                      onChange={e => setForm({ name: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-octofit">Save Team</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;
